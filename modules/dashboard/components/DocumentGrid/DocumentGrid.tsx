import React from "react";

import { MdAdd } from "react-icons/md";

import { IDocumentGridProps } from "@/shared/typedefs/dashboard.types";

import DocumentCard from "../DocumentCard/DocumentCard";


const LoadingState: React.FC = () => (
  <div className="text-center col-span-full py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
    <p className="mt-4 text-outline">Loading documents...</p>
  </div>
);

const ErrorState: React.FC<{ error: unknown }> = ({ error }) => (
  <div className="text-center col-span-full py-12">
    <p className="text-error font-semibold">Failed to load documents.</p>
    <p className="text-xs text-outline mt-2">{JSON.stringify(error)}</p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center col-span-full py-12 text-outline">
    <p>No documents found.</p>
  </div>
);

const UploadCard: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    className="border-2 border-dashed border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-primary/50 transition-all cursor-pointer bg-white/[0.02] w-full text-left"
    onClick={onClick}
    aria-label="Upload new document"
  >
    <div className="w-12 h-12 flex-shrink-0 bg-surface-container-highest/50 rounded-lg flex items-center justify-center text-outline group-hover:text-primary transition-colors">
      <MdAdd className="text-[28px]" />
    </div>
    <div>
      <p className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">
        Process new document
      </p>
      <p className="text-[10px] text-outline uppercase tracking-widest mt-0.5">Neural Hub Active</p>
    </div>
  </button>
);

const DocumentGrid: React.FC<IDocumentGridProps> = ({
  documents,
  isLoading,
  error,
  onUploadClick,
  onDocumentMenuClick,
}) => {
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (documents.length === 0) return <EmptyState />;

    return documents.map((doc) => (
      <DocumentCard key={doc.document_id} document={doc} onMenuClick={onDocumentMenuClick} />
    ));
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {renderContent()}
      <UploadCard onClick={onUploadClick} />
    </section>
  );
};

export default DocumentGrid;
