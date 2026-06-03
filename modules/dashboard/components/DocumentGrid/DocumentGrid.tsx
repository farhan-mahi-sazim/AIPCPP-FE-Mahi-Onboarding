import React from "react";

import { IDocumentGridProps } from "@/shared/typedefs/dashboard.types";

import DocumentCard from "../DocumentCard/DocumentCard";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import SynthesisBox from "./SynthesisBox";
import UploadCard from "./UploadCard";

const DocumentGrid: React.FC<IDocumentGridProps> = ({
  documents,
  isLoading,
  error,
  onUploadClick,
  onDocumentMenuClick,
  synthesisAnswer,
}) => {
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (documents.length === 0) return <EmptyState />;

    return documents.map((doc, index) => (
      <DocumentCard
        key={`${doc.document_id}-${index}`}
        document={doc}
        onMenuClick={onDocumentMenuClick}
      />
    ));
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {synthesisAnswer && <SynthesisBox answer={synthesisAnswer} />}
      {renderContent()}
      <UploadCard onClick={onUploadClick} />
    </section>
  );
};

export default DocumentGrid;
