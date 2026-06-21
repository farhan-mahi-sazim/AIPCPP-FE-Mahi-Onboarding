import React from "react";

import { useRouter } from "next/router";

import { MdCloudUpload, MdCheck, MdArrowForward } from "react-icons/md";

import { useUploadSection } from "@/modules/dashboard/hooks/useUploadSection/useUploadSection";
import { STRINGS } from "@/shared/constants/strings.constants";

import { IUploadSectionProps } from "./UploadSection.types";

const UploadSection: React.FC<IUploadSectionProps> = ({ onUploadSuccess }) => {
  const router = useRouter();
  const {
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
    steps,
    resetUpload,
  } = useUploadSection({ onUploadSuccess });

  const isCompleted = stage === "completed";

  return (
    <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-on-surface">{STRINGS.upload.title}</h2>
        {isUploading && (
          <div className="text-sm text-outline flex items-center gap-2">
            <span className="text-on-surface font-medium capitalize">{stageLabel}</span>
            <span className="text-primary">{progress}%</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isCompleted && uploadedDocId && uploadedDocData ? (
          <div className="col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <MdCheck className="text-primary text-2xl" />
                </div>
                <div>
                  <p className="text-on-surface font-medium">{STRINGS.upload.completeTitle}</p>
                  <p className="text-sm text-on-surface-variant">{uploadedDocData.filename}</p>
                </div>
              </div>
              <button
                onClick={resetUpload}
                className="text-sm text-outline hover:text-on-surface transition-colors"
              >
                {STRINGS.upload.uploadAnother}
              </button>
            </div>

            <p className="text-sm text-on-surface-variant mb-4">{STRINGS.upload.readyMessage}</p>

            <button
              onClick={() => router.push(`/document/${uploadedDocId}`)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {STRINGS.upload.viewDocument}
              <MdArrowForward className="text-lg" />
            </button>
          </div>
        ) : (
          <div
            className={`col-span-2 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
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
              <div className="w-full max-w-xs mt-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-primary text-sm font-medium mt-2">
                  {progress}% - {stageLabel}
                </p>
              </div>
            )}
            {uploadError ? (
              <div className="mt-4 text-red-500 text-sm font-medium">
                {/too large|maximum size/i.test(uploadError.message)
                  ? STRINGS.upload.fileTooLargeMsg
                  : STRINGS.upload.failedRetry}
              </div>
            ) : null}
          </div>
        )}

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
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      status === "completed"
                        ? "bg-teal-500 text-white"
                        : status === "active"
                          ? "bg-primary text-white"
                          : status === "failed"
                            ? "bg-red-500 text-white"
                            : "bg-white/10 text-outline"
                    }`}
                  >
                    {status === "completed" ? (
                      <MdCheck />
                    ) : status === "active" ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
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
                      {step.label}
                    </p>
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
