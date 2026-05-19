import React, { useState, useEffect } from "react";

import { notifications } from "@mantine/notifications";
import { MdCloudUpload, MdCheck, MdError, MdHourglassEmpty } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";
import {
  useUploadDocumentMutation,
  useGetJobStatusQuery,
} from "@/shared/redux/rtk-apis/documents.api";

export interface IUploadSectionProps {
  onUploadSuccess?: () => void;
}

const UploadSection: React.FC<IUploadSectionProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const [uploadDocument, { isLoading: isUploading, error: uploadError }] =
    useUploadDocumentMutation();

  // Only query when jobId is present and pollingInterval stops when jobId is null
  const { data: jobStatus } = useGetJobStatusQuery(jobId ?? "", {
    skip: !jobId,
    pollingInterval: jobId ? 2000 : undefined,
  });

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
      setJobId(null); // Stop polling
      setFile(null);
    } else if (jobStatus?.status === "FAILED") {
      notifications.show({
        title: STRINGS.upload.procFailed,
        message: STRINGS.upload.procFailedMsg,
        color: "red",
      });
      setJobId(null); // Stop polling
    }
  }, [jobStatus, onUploadSuccess]);

  const steps = [
    { key: "PENDING", label: STRINGS.upload.steps.PENDING },
    { key: "EXTRACTING", label: STRINGS.upload.steps.EXTRACTING },
    { key: "ANALYZING", label: STRINGS.upload.steps.ANALYZING },
    { key: "PERSISTING", label: STRINGS.upload.steps.PERSISTING },
    { key: "COMPLETED", label: STRINGS.upload.steps.COMPLETED },
  ];

  const getStepStatus = (stepKey: string) => {
    if (!jobStatus) return "idle";
    const currentStatus = jobStatus.status;
    const currentIndex = steps.findIndex((s) => s.key === currentStatus);
    const stepIndex = steps.findIndex((s) => s.key === stepKey);

    if (currentStatus === "FAILED" && stepIndex >= currentIndex) {
      return "failed";
    }
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "idle";
  };

  return (
    <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-on-surface">{STRINGS.upload.title}</h2>
        {jobStatus && (
          <div className="text-sm text-outline flex items-center gap-2">
            Status: <span className="text-on-surface font-medium">{jobStatus.status}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div
          className={`col-span-2 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-white/10 hover:border-white/20 bg-white/[0.02]"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,image/*"
          />
          <MdCloudUpload className="text-5xl text-outline mb-4" />
          <p className="text-on-surface text-center">
            {file ? file.name : STRINGS.upload.dragDrop}
          </p>
          <p className="text-outline text-xs mt-2">{STRINGS.upload.supportText}</p>
          {isUploading && (
            <div className="mt-4 text-primary text-sm font-medium animate-pulse">
              Uploading file...
            </div>
          )}
          {uploadError && (
            <div className="mt-4 text-error text-sm font-medium flex items-center gap-2">
              <MdError /> Upload failed. Please try again.
            </div>
          )}
        </div>

        {/* Pipeline Tracker */}
        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
          <h3 className="text-sm font-medium text-on-surface-variant mb-4">
            {STRINGS.upload.trackerTitle}
          </h3>
          <div className="flex flex-col gap-4">
            {steps.map((step) => {
              const status = getStepStatus(step.key);
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      status === "completed"
                        ? "bg-teal-500 text-white"
                        : status === "active"
                          ? "bg-indigo-500 text-white animate-pulse"
                          : status === "failed"
                            ? "bg-red-500 text-white"
                            : "bg-white/10 text-outline"
                    }`}
                  >
                    {status === "completed" ? (
                      <MdCheck />
                    ) : status === "failed" ? (
                      <MdError />
                    ) : status === "active" ? (
                      <MdHourglassEmpty className="animate-spin" />
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        status === "active" ? "text-on-surface" : "text-outline"
                      }`}
                    >
                      {step.key}
                    </p>
                    <p className="text-xs text-outline-variant">{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
