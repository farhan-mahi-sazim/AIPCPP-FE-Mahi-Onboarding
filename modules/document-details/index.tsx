import React from "react";

import { MdArrowBack } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

import DocumentHeader from "./components/DocumentHeader";
import DocumentInfo from "./components/DocumentInfo";
import DocumentTimeline from "./components/DocumentTimeline";
import { useDocumentDetails } from "./hooks/useDocumentDetails";

const DocumentDetails: React.FC = () => {
  const {
    id,
    documentData,
    timelineItems,
    isLoading,
    error,
    isDeleting,
    handleDelete,
    handleBack,
  } = useDocumentDetails();

  if (isLoading) return <div className="text-center py-12">Loading details...</div>;
  if (error) return <div className="text-center py-12 text-error">Failed to load details.</div>;

  return (
    <div className="min-h-screen bg-background text-on-surface p-6">
      <div className="max-w-4xl mx-auto">
        <button
          className="flex items-center gap-2 text-outline hover:text-on-surface mb-6 transition-colors"
          onClick={handleBack}
        >
          <MdArrowBack /> {STRINGS.details.back}
        </button>

        <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md">
          <DocumentHeader
            id={id}
            filename={documentData?.filename}
            isDeleting={isDeleting}
            onDelete={handleDelete}
          />

          <DocumentInfo
            category={documentData?.category}
            summary={documentData?.summary}
            summary_title={documentData?.summary_title}
            tags={documentData?.tags}
          />

          <hr className="my-6 border-white/5" />

          <DocumentTimeline timelineItems={timelineItems} />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
