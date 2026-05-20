import React from "react";

import { MdCloudUpload, MdCheck, MdError, MdHourglassEmpty } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

import { useUploadSection } from "./useUploadSection";

export interface IUploadSectionProps {
  onUploadSuccess?: () => void;
}

const UploadSection: React.FC<IUploadSectionProps> = ({ onUploadSuccess }) => {
  const {
    file,
    isDragging,
    isUploading,
    uploadError,
    jobStatus,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    getStepStatus,
    steps,
  } = useUploadSection({ onUploadSuccess });

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
