export interface IUploadSectionProps {
  onUploadSuccess?: () => void;
}

export interface IUploadSectionCallbacks {
  onUploadSuccess?: () => void;
}

export type TUploadStage = "idle" | "uploading" | "pending" | "processing" | "completed" | "failed";

export interface IProgressData {
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
