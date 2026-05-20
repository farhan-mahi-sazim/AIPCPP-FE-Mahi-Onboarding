import { useState, useEffect } from "react";

import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";
import { useUploadDocumentMutation, useGetJobStatusQuery } from "@/shared/redux/rtk-apis/documents.api";

export interface IUploadSectionCallbacks {
  onUploadSuccess?: () => void;
}

export interface IUseUploadSectionReturn {
  file: File | null;
  isDragging: boolean;
  isUploading: boolean;
  uploadError: unknown;
  jobStatus: ReturnType<typeof useGetJobStatusQuery>["data"];
  setFile: (file: File | null) => void;
  setIsDragging: (dragging: boolean) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getStepStatus: (stepKey: string) => "idle" | "completed" | "active" | "failed";
  steps: { key: string; label: string }[];
  onUploadSuccess: (() => void) | undefined;
}

const UPLOAD_STEPS = [
  { key: "PENDING", label: STRINGS.upload.steps.PENDING },
  { key: "EXTRACTING", label: STRINGS.upload.steps.EXTRACTING },
  { key: "ANALYZING", label: STRINGS.upload.steps.ANALYZING },
  { key: "PERSISTING", label: STRINGS.upload.steps.PERSISTING },
  { key: "COMPLETED", label: STRINGS.upload.steps.COMPLETED },
];

export const useUploadSection = ({ onUploadSuccess }: IUploadSectionCallbacks): IUseUploadSectionReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const [uploadDocument, { isLoading: isUploading, error: uploadError }] = useUploadDocumentMutation();

  const { data: jobStatus } = useGetJobStatusQuery(jobId ?? "", {
    skip: !jobId,
    pollingInterval: jobId ? 2000 : undefined,
  });

  const handleUpload = async (fileToUpload: File) => {
    try {
      const response = await uploadDocument(fileToUpload).unwrap();
      setJobId(response.job.id);
      notifications.show({
        title: STRINGS.upload.started,
        message: STRINGS.upload.startedMsg,
        color: "blue",
      });
    } catch (err) {
      console.error("Upload failed", err);
      notifications.show({
        title: STRINGS.upload.failed,
        message: STRINGS.upload.failedMsg,
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (jobStatus?.status === "COMPLETED") {
      notifications.show({
        title: STRINGS.upload.success,
        message: STRINGS.upload.successMsg,
        color: "teal",
      });
      onUploadSuccess?.();
      setJobId(null);
      setFile(null);
    } else if (jobStatus?.status === "FAILED") {
      notifications.show({
        title: STRINGS.upload.procFailed,
        message: STRINGS.upload.procFailedMsg,
        color: "red",
      });
      setJobId(null);
    }
  }, [jobStatus, onUploadSuccess]);

  const getStepStatus = (stepKey: string): "idle" | "completed" | "active" | "failed" => {
    if (!jobStatus) return "idle";
    const currentStatus = jobStatus.status;
    const currentIndex = UPLOAD_STEPS.findIndex((s) => s.key === currentStatus);
    const stepIndex = UPLOAD_STEPS.findIndex((s) => s.key === stepKey);

    if (currentStatus === "FAILED" && stepIndex >= currentIndex) {
      return "failed";
    }
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
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
    jobStatus,
    setFile,
    setIsDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    getStepStatus,
    steps: UPLOAD_STEPS,
    onUploadSuccess,
  };
};
