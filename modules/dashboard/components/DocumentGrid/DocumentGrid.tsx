import React from "react";

import { IDocumentGridProps } from "@/modules/dashboard/dashboard.types";

import { renderContent } from "./DocumentGrid.helpers";
import SynthesisBox from "./SynthesisBox";
import UploadCard from "./UploadCard";

const DocumentGrid: React.FC<IDocumentGridProps> = ({
  documents,
  isLoading,
  error,
  onUploadClick,
  onDocumentMenuClick,
  synthesisAnswer,
}) => (
  <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {synthesisAnswer && <SynthesisBox answer={synthesisAnswer} />}
    {renderContent(isLoading, error, documents, onDocumentMenuClick)}
    <UploadCard onClick={onUploadClick} />
  </section>
);

export default DocumentGrid;
