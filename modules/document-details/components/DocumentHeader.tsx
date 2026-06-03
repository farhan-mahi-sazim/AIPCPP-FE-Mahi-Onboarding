import React from "react";

import { MdDelete } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

interface IDocumentHeaderProps {
  id: string;
  filename?: string;
  isDeleting: boolean;
  onDelete: () => void;
}

const DocumentHeader: React.FC<IDocumentHeaderProps> = ({ id, filename, isDeleting, onDelete }) => (
  <div className="flex justify-between items-start mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-on-surface">
        {filename ? filename : STRINGS.details.title}
      </h1>
      <p className="text-sm text-outline mt-1">ID: {id}</p>
    </div>
    <button
      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      onClick={onDelete}
      disabled={isDeleting}
    >
      <MdDelete /> {isDeleting ? "Deleting..." : "Delete"}
    </button>
  </div>
);

export default DocumentHeader;
