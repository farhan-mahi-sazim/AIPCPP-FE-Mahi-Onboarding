import { useState, useEffect, useRef, useCallback } from "react";

import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";

import {
  UPLOAD_STEPS,
  POLL_INTERVAL_MS,
  SSE_FALLBACK_TIMEOUT_MS,
} from "../../components/UploadSection/UploadSection.constants";
import {
  clampProgress,
  formatStageLabel,
  mapBackendStageToUI,
} from "../../components/UploadSection/UploadSection.helpers";
import {
  IUploadSectionCallbacks,
  IUseUploadSectionReturn,
  IProgressData,
} from "../../components/UploadSection/UploadSection.types";
import { PROGRESS_BASELINES } from "./uploadSection.constant";

const UPLOAD_ERROR_PATTERNS = [
  {
    pattern: /too large|maximum size/i,
    titleKey: "fileTooLarge" as const,
    messageKey: "fileTooLargeMsg" as const,
  },
] as const;

function getUploadErrorNotification(message: string) {
  const match = UPLOAD_ERROR_PATTERNS.find((entry) => entry.pattern.test(message));
  if (match) {
    return {
      title: STRINGS.upload[match.titleKey],
      message: STRINGS.upload[match.messageKey],
    };
  }
  return { title: STRINGS.upload.failed, message: STRINGS.upload.failedMsg };
}

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
  const [stage, setStage] = useState<string>("idle");
  const [stageLabel, setStageLabel] = useState("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastProgressRef = useRef(0);
  const documentIdRef = useRef<string | null>(null);
  const sseFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const cleanupPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const cleanupSseFallbackTimer = useCallback(() => {
    if (sseFallbackTimerRef.current) {
      clearTimeout(sseFallbackTimerRef.current);
      sseFallbackTimerRef.current = null;
    }
  }, []);

  const resetUpload = useCallback(() => {
    cleanupEventSource();
    cleanupPolling();
    cleanupSseFallbackTimer();
    setFile(null);
    setIsUploading(false);
    setUploadError(null);
    setUploadedDocId(null);
    setUploadedDocData(null);
    setProgress(0);
    setStage("idle");
    setStageLabel("idle");
    setCurrentStepIndex(-1);
    lastProgressRef.current = 0;
    documentIdRef.current = null;
  }, [cleanupEventSource, cleanupPolling, cleanupSseFallbackTimer]);

  const parseProgressPayload = useCallback((payload: unknown) => {
    if (typeof payload !== "object" || payload === null) return null;
    const record = payload as Record<string, unknown>;
    const progressValue = typeof record["progress"] === "number" ? record["progress"] : 0;
    const progress = clampProgress(progressValue);
    const rawStage = typeof record["stage"] === "string" ? record["stage"] : undefined;
    const rawType = typeof record["type"] === "string" ? record["type"] : undefined;
    const rawStatus = typeof record["status"] === "string" ? record["status"] : undefined;

    const statusFailed =
      rawStatus?.toLowerCase() === "failed" || rawStage?.toLowerCase() === "failed";
    if (statusFailed) {
      return {
        progress: 0,
        stepStage: "failed" as string,
        stepIndex: -1,
        stageLabel: "failed",
        isCompleted: false,
        isFailed: true,
      };
    }

    const stageToUse = rawStage ?? rawType ?? rawStatus;
    const { uiStage, stepIndex } = mapBackendStageToUI(stageToUse ?? "", progress);
    const adjustedProgress =
      progress === 0 && stepIndex >= 1 ? (PROGRESS_BASELINES[stepIndex] ?? progress) : progress;
    const isCompleted = uiStage === "completed";

    return {
      progress: adjustedProgress,
      stepStage: uiStage as string,
      stepIndex,
      stageLabel: formatStageLabel(stageToUse),
      isCompleted,
      isFailed: false,
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
        cleanupPolling();
        cleanupSseFallbackTimer();
        setIsUploading(false);
        onUploadSuccess?.();
      } else if (payload.isFailed) {
        cleanupEventSource();
        cleanupPolling();
        cleanupSseFallbackTimer();
        setIsUploading(false);
        notifications.show({
          title: STRINGS.upload.procFailed,
          message: STRINGS.upload.procFailedMsg,
          color: "red",
        });
        resetUpload();
      }
    },
    [cleanupEventSource, cleanupPolling, cleanupSseFallbackTimer, onUploadSuccess, resetUpload],
  );

  const startPolling = useCallback(
    (documentId: string) => {
      if (pollingIntervalRef.current) return;
      const poll = async () => {
        try {
          const response = await fetch(`/api/v1/content/jobs/${documentId}/progress`);
          if (response.status === 410 || response.status === 404) {
            cleanupPolling();
            return;
          }
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
    [applyProgressUpdate, cleanupPolling, parseProgressPayload],
  );

  const startFallbackTimer = useCallback(() => {
    cleanupSseFallbackTimer();
    sseFallbackTimerRef.current = setTimeout(() => {
      cleanupEventSource();
      if (documentIdRef.current) {
        startPolling(documentIdRef.current);
      }
    }, SSE_FALLBACK_TIMEOUT_MS);
  }, [cleanupEventSource, cleanupSseFallbackTimer, startPolling]);

  const subscribeToProgress = useCallback(
    (documentId: string) => {
      documentIdRef.current = documentId;
      cleanupEventSource();
      cleanupPolling();
      cleanupSseFallbackTimer();

      const eventSource = new EventSource(`/api/v1/content/jobs/${documentId}/progress/stream`);
      eventSourceRef.current = eventSource;

      startFallbackTimer();

      eventSource.onmessage = (event) => {
        cleanupSseFallbackTimer();
        try {
          const data: IProgressData = JSON.parse(event.data);
          applyProgressUpdate(parseProgressPayload(data));
        } catch (err) {
          console.error("Failed to parse SSE data:", err);
        }
        if (eventSourceRef.current) {
          startFallbackTimer();
        }
      };

      eventSource.onerror = () => {
        cleanupEventSource();
        cleanupSseFallbackTimer();
        if (documentIdRef.current) {
          startPolling(documentIdRef.current);
        }
      };
    },
    [
      applyProgressUpdate,
      cleanupEventSource,
      cleanupPolling,
      cleanupSseFallbackTimer,
      parseProgressPayload,
      startFallbackTimer,
      startPolling,
    ],
  );

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
        const percent = clampProgress((event.loaded / event.total) * 100 * 0.4);
        setProgress(percent);
      };

      request.onload = () => {
        if (request.status < 200 || request.status >= 300) {
          let errorMessage = "Upload failed";
          const errorBody = request.response as Record<string, unknown> | null;
          const detail = errorBody?.["detail"];
          if (typeof detail === "string") {
            errorMessage = detail;
          }
          reject(new Error(errorMessage));
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
    setStage("uploading");
    setCurrentStepIndex(0);

    try {
      const { document } = await uploadDocument(fileToUpload);

      setUploadedDocId(document.id);
      setUploadedDocData({
        filename: document.filename,
        file_type: document.file_type,
      });
      setProgress(40);
      setStage("pending");
      setStageLabel("queued");
      setCurrentStepIndex(1);
      lastProgressRef.current = 40;

      notifications.show({
        title: STRINGS.upload.started,
        message: STRINGS.upload.startedMsg,
        color: "blue",
      });

      subscribeToProgress(document.id);
    } catch (err) {
      console.error("Upload failed", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setUploadError(error);
      setIsUploading(false);

      const { title, message } = getUploadErrorNotification(error.message);
      notifications.show({ title, message, color: "red" });
    }
  };

  useEffect(
    () => () => {
      cleanupEventSource();
      cleanupPolling();
      cleanupSseFallbackTimer();
    },
    [cleanupEventSource, cleanupPolling, cleanupSseFallbackTimer],
  );

  const getStepStatus = (stepKey: string) => {
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
