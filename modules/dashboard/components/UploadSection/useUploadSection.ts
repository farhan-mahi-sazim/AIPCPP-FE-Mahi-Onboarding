import { useState, useEffect, useRef, useCallback } from "react";

import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";

export interface IUploadSectionCallbacks {
  onUploadSuccess?: () => void;
}

export interface IProgressData {
  type: string;
  document_id: string;
  progress: number;
  stage: "uploading" | "pending" | "processing" | "completed" | "failed";
}

export interface IUseUploadSectionReturn {
  file: File | null;
  isDragging: boolean;
  isUploading: boolean;
  uploadError: unknown;
  progress: number;
  stage: string;
  uploadedDocId: string | null;
  uploadedDocData: { filename: string; file_type: string } | null;
  setFile: (file: File | null) => void;
  setIsDragging: (dragging: boolean) => void;
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

export const useUploadSection = ({
  onUploadSuccess,
}: IUploadSectionCallbacks): IUseUploadSectionReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<unknown>(null);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);
  const [uploadedDocData, setUploadedDocData] = useState<{
    filename: string;
    file_type: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("idle");

  const eventSourceRef = useRef<EventSource | null>(null);

  const cleanupEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const resetUpload = useCallback(() => {
    cleanupEventSource();
    setFile(null);
    setIsUploading(false);
    setUploadError(null);
    setUploadedDocId(null);
    setUploadedDocData(null);
    setProgress(0);
    setStage("idle");
  }, [cleanupEventSource]);

  const subscribeToProgress = useCallback(
    (documentId: string) => {
      cleanupEventSource();

      const eventSource = new EventSource(`/api/v1/content/jobs/${documentId}/progress/stream`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE connected");
      };

      eventSource.onmessage = (event) => {
        try {
          const data: IProgressData = JSON.parse(event.data);
          setProgress(data.progress);
          setStage(data.stage);

          if (data.type === "completed" || data.progress >= 100 || data.stage === "completed") {
            cleanupEventSource();
            setIsUploading(false);
            notifications.show({
              title: STRINGS.upload.success,
              message: STRINGS.upload.successMsg,
              color: "teal",
            });
            onUploadSuccess?.();
          } else if (data.stage === "failed") {
            cleanupEventSource();
            setIsUploading(false);
            notifications.show({
              title: STRINGS.upload.procFailed,
              message: STRINGS.upload.procFailedMsg,
              color: "red",
            });
            resetUpload();
          }
        } catch (err) {
          console.error("Failed to parse SSE data:", err);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        cleanupEventSource();
        setIsUploading(false);
      };
    },
    [cleanupEventSource, onUploadSuccess, resetUpload],
  );

  const handleUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    setUploadError(null);
    setProgress(0);
    setStage("uploading");

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("document_id", crypto.randomUUID());

      const response = await fetch("/api/v1/content/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { document } = await response.json();

      setUploadedDocId(document.id);
      setUploadedDocData({
        filename: document.filename,
        file_type: document.file_type,
      });

      notifications.show({
        title: STRINGS.upload.started,
        message: STRINGS.upload.startedMsg,
        color: "blue",
      });

      subscribeToProgress(document.id);
    } catch (err) {
      console.error("Upload failed", err);
      setUploadError(err);
      setIsUploading(false);
      notifications.show({
        title: STRINGS.upload.failed,
        message: STRINGS.upload.failedMsg,
        color: "red",
      });
    }
  };

  useEffect(() => () => cleanupEventSource(), [cleanupEventSource]);

  const getStepStatus = (stepKey: string): "idle" | "completed" | "active" | "failed" => {
    if (stage === "idle") return "idle";
    if (stage === "failed") return "failed";

    const stageOrder: Record<string, number> = {
      uploading: 0,
      pending: 1,
      processing: 2,
      completed: 3,
    };

    const currentStageIndex = stageOrder[stage] ?? -1;
    const stepIndex = UPLOAD_STEPS.findIndex((s) => s.key === stepKey.toUpperCase());

    if (currentStageIndex > stepIndex) return "completed";
    if (currentStageIndex === stepIndex) return "active";
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
    uploadedDocId,
    uploadedDocData,
    setFile,
    setIsDragging,
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
