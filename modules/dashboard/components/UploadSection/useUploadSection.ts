import { useState, useEffect, useRef, useCallback } from "react";

import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";

export interface IUploadSectionCallbacks {
  onUploadSuccess?: () => void;
}

type UploadStage = "idle" | "uploading" | "pending" | "processing" | "completed" | "failed";

interface IProgressData {
  type?: string;
  document_id?: string;
  progress?: number;
  stage?: string;
  status?: string;
}

export interface IUseUploadSectionReturn {
  file: File | null;
  isDragging: boolean;
  isUploading: boolean;
  uploadError: Error | null;
  progress: number;
  uploadProgress: number;
  stage: string;
  stageLabel: string;
  uploadedDocId: string | null;
  uploadedDocData: { filename: string; file_type: string } | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getStepStatus: (stepKey: string) => "idle" | "completed" | "active" | "failed";
  steps: { key: string; label: string }[];
  onUploadSuccess: (() => void) | undefined;
  resetUpload: () => void;
}

const UPLOAD_STEPS = [
  { key: "UPLOADING", label: STRINGS.upload.steps.UPLOADING },
  { key: "PENDING", label: STRINGS.upload.steps.PENDING },
  { key: "PROCESSING", label: STRINGS.upload.steps.PROCESSING },
  { key: "COMPLETED", label: STRINGS.upload.steps.COMPLETED },
];

const MAX_SSE_RETRIES = 4;
const INITIAL_RETRY_MS = 1000;
const MAX_RETRY_MS = 8000;
const POLL_INTERVAL_MS = 3000;

export const useUploadSection = ({
  onUploadSuccess,
}: IUploadSectionCallbacks): IUseUploadSectionReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);
  const [uploadedDocData, setUploadedDocData] = useState<{
    filename: string;
    file_type: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [stageLabel, setStageLabel] = useState("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastProgressRef = useRef(0);
  const documentIdRef = useRef<string | null>(null);
  const subscribeRef = useRef<((documentId: string) => void) | null>(null);

  const cleanupEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const cleanupRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const cleanupPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const resetUpload = useCallback(() => {
    cleanupEventSource();
    cleanupRetry();
    cleanupPolling();
    setFile(null);
    setIsUploading(false);
    setUploadError(null);
    setUploadedDocId(null);
    setUploadedDocData(null);
    setProgress(0);
    setUploadProgress(0);
    setStage("idle");
    setStageLabel("idle");
    setCurrentStepIndex(-1);
    retryCountRef.current = 0;
    lastProgressRef.current = 0;
    documentIdRef.current = null;
  }, [cleanupEventSource, cleanupPolling, cleanupRetry]);

  const clampProgress = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

  const formatStageLabel = (value: string | undefined) => {
    if (!value) return "processing";
    return value.toLowerCase().replace(/_/g, " ");
  };

  const mapBackendStageToUI = (
    rawStage: string | undefined,
    progress: number,
  ): { uiStage: UploadStage; stepIndex: number } => {
    const stage = (rawStage ?? "").toLowerCase();
    if (stage === "failed") return { uiStage: "failed", stepIndex: -1 };
    if (stage === "completed" || progress >= 100) return { uiStage: "completed", stepIndex: 3 };
    if (stage === "uploading") return { uiStage: "uploading", stepIndex: 0 };
    if (stage === "pending" || stage === "queued") return { uiStage: "pending", stepIndex: 1 };
    if (
      stage === "extraction" ||
      stage === "ai_task" ||
      stage === "embedding" ||
      stage === "persistence" ||
      stage === "processing"
    ) {
      return { uiStage: "processing", stepIndex: 2 };
    }
    if (progress > 0) return { uiStage: "processing", stepIndex: 2 };
    return { uiStage: "pending", stepIndex: 1 };
  };

  const parseProgressPayload = useCallback((payload: unknown) => {
    if (typeof payload !== "object" || payload === null) return null;
    const record = payload as Record<string, unknown>;
    const progressValue = typeof record["progress"] === "number" ? record["progress"] : 0;
    const progress = clampProgress(progressValue);
    const rawStage = typeof record["stage"] === "string" ? record["stage"] : undefined;
    const rawType = typeof record["type"] === "string" ? record["type"] : undefined;
    const rawStatus = typeof record["status"] === "string" ? record["status"] : undefined;
    const stageToUse = rawStage ?? rawType ?? rawStatus;
    const { uiStage, stepIndex } = mapBackendStageToUI(stageToUse, progress);
    const isFailed = uiStage === "failed";
    const isCompleted = uiStage === "completed";

    return {
      progress,
      stepStage: uiStage,
      stepIndex,
      stageLabel: formatStageLabel(stageToUse),
      isCompleted,
      isFailed,
    };
  }, []);

  const applyProgressUpdate = useCallback(
    (payload: ReturnType<typeof parseProgressPayload>) => {
      if (!payload) return;
      const nextProgress = Math.max(lastProgressRef.current, payload.progress);
      lastProgressRef.current = nextProgress;
      setProgress(nextProgress);
      setStage(payload.stepStage);
      setStageLabel(payload.stageLabel);
      setCurrentStepIndex(payload.stepIndex);

      if (payload.isCompleted) {
        cleanupEventSource();
        cleanupRetry();
        cleanupPolling();
        setIsUploading(false);
        onUploadSuccess?.();
      } else if (payload.isFailed) {
        cleanupEventSource();
        cleanupRetry();
        cleanupPolling();
        setIsUploading(false);
        notifications.show({
          title: STRINGS.upload.procFailed,
          message: STRINGS.upload.procFailedMsg,
          color: "red",
        });
        resetUpload();
      }
    },
    [cleanupEventSource, cleanupPolling, cleanupRetry, onUploadSuccess, resetUpload],
  );

  const startPolling = useCallback(
    (documentId: string) => {
      if (pollingIntervalRef.current) return;
      const poll = async () => {
        try {
          const response = await fetch(`/api/v1/content/jobs/${documentId}/progress`);
          if (!response.ok) return;
          const data: unknown = await response.json();
          applyProgressUpdate(parseProgressPayload(data));
        } catch (error) {
          console.error("Polling error:", error);
        }
      };
      poll();
      pollingIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    },
    [applyProgressUpdate, parseProgressPayload],
  );

  const scheduleRetry = useCallback(() => {
    if (!documentIdRef.current) return;
    if (retryCountRef.current >= MAX_SSE_RETRIES) {
      cleanupEventSource();
      startPolling(documentIdRef.current);
      return;
    }
    const retryDelay = Math.min(INITIAL_RETRY_MS * 2 ** retryCountRef.current, MAX_RETRY_MS);
    retryCountRef.current += 1;
    cleanupRetry();
    retryTimeoutRef.current = setTimeout(() => {
      if (documentIdRef.current && subscribeRef.current) {
        subscribeRef.current(documentIdRef.current);
      }
    }, retryDelay);
  }, [cleanupEventSource, cleanupRetry, startPolling]);

  const subscribeToProgress = useCallback(
    (documentId: string) => {
      documentIdRef.current = documentId;
      cleanupEventSource();
      cleanupPolling();

      startPolling(documentId);

      const eventSource = new EventSource(`/api/v1/content/jobs/${documentId}/progress/stream`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        retryCountRef.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data: IProgressData = JSON.parse(event.data);
          applyProgressUpdate(parseProgressPayload(data));
        } catch (err) {
          console.error("Failed to parse SSE data:", err);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        cleanupEventSource();
        scheduleRetry();
      };
    },
    [
      applyProgressUpdate,
      cleanupEventSource,
      cleanupPolling,
      parseProgressPayload,
      scheduleRetry,
      startPolling,
    ],
  );

  subscribeRef.current = subscribeToProgress;

  const uploadDocument = (fileToUpload: File) =>
    new Promise<{
      document: { id: string; filename: string; file_type: string };
    }>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const request = new XMLHttpRequest();
      request.open("POST", "/api/v1/content/upload");
      request.responseType = "json";

      request.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = clampProgress((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      };

      request.onload = () => {
        if (request.status < 200 || request.status >= 300) {
          reject(new Error("Upload failed"));
          return;
        }
        const response = request.response ?? null;
        if (!response || typeof response !== "object") {
          reject(new Error("Invalid upload response"));
          return;
        }
        resolve(response as { document: { id: string; filename: string; file_type: string } });
      };

      request.onerror = () => {
        reject(new Error("Upload failed"));
      };

      request.send(formData);
    });

  const handleUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    setUploadError(null);
    setProgress(0);
    setUploadProgress(0);
    setStage("uploading");
    setStageLabel("uploading");
    setCurrentStepIndex(0);

    try {
      const { document } = await uploadDocument(fileToUpload);

      setUploadedDocId(document.id);
      setUploadedDocData({
        filename: document.filename,
        file_type: document.file_type,
      });
      setProgress(0);
      setStage("pending");
      setStageLabel("queued");
      setCurrentStepIndex(1);
      lastProgressRef.current = 0;

      notifications.show({
        title: STRINGS.upload.started,
        message: STRINGS.upload.startedMsg,
        color: "blue",
      });

      subscribeToProgress(document.id);
    } catch (err) {
      console.error("Upload failed", err);
      setUploadError(err instanceof Error ? err : new Error(String(err)));
      setIsUploading(false);
      notifications.show({
        title: STRINGS.upload.failed,
        message: STRINGS.upload.failedMsg,
        color: "red",
      });
    }
  };

  useEffect(
    () => () => {
      cleanupEventSource();
      cleanupRetry();
      cleanupPolling();
    },
    [cleanupEventSource, cleanupPolling, cleanupRetry],
  );

  const getStepStatus = (stepKey: string): "idle" | "completed" | "active" | "failed" => {
    if (stage === "idle") return "idle";
    if (stage === "failed") return "failed";

    const stepIndex = UPLOAD_STEPS.findIndex((s) => s.key === stepKey.toUpperCase());

    if (currentStepIndex > stepIndex) return "completed";
    if (currentStepIndex === stepIndex) return "active";
    return "idle";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  return {
    file,
    isDragging,
    isUploading,
    uploadError,
    progress,
    uploadProgress,
    stage,
    stageLabel,
    uploadedDocId,
    uploadedDocData,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    getStepStatus,
    steps: UPLOAD_STEPS,
    onUploadSuccess,
    resetUpload,
  };
};
