import React from "react";

import { MdAdd, MdDelete, MdEdit } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

interface IDocumentHeaderProps {
  id: string;
  filename?: string;
  isDeleting: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  onOverride?: () => void;
  canEdit?: boolean;
  isEditing?: boolean;
  versionNumber?: number;
  versionSource?: "AI" | "HUMAN";
}

const DocumentHeader: React.FC<IDocumentHeaderProps> = ({
  id,
  filename,
  isDeleting,
  onDelete,
  onEdit,
  onOverride,
  canEdit,
  isEditing,
  versionNumber,
  versionSource,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/5">
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
          {filename ? filename : STRINGS.details.title}
        </h1>
        {versionNumber !== undefined && (
          <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            v{versionNumber}
          </span>
        )}
        {versionSource && (
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              versionSource === "HUMAN"
                ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                : "bg-teal-500/10 text-teal-300 border border-teal-500/20"
            }`}
          >
            {versionSource}
          </span>
        )}
      </div>
      <p className="text-xs text-outline mt-1 font-mono">
        {STRINGS.details.headerIdPrefix} {id}
      </p>
    </div>
    <div className="flex gap-2 w-full sm:w-auto">
      {onOverride && !isEditing && (
        <button
          className="flex-1 sm:flex-initial bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm border border-indigo-500/20"
          onClick={onOverride}
          aria-label={STRINGS.details.createOverride}
        >
          <MdAdd size={16} />
        </button>
      )}
      {onEdit && canEdit && !isEditing && (
        <button
          className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm shadow-sm"
          onClick={onEdit}
          aria-label={STRINGS.details.editDetails}
        >
          <MdEdit size={16} />
        </button>
      )}
      <button
        className="flex-1 sm:flex-initial bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm border border-red-500/10"
        onClick={onDelete}
        disabled={isDeleting}
        aria-label={isDeleting ? STRINGS.details.deleting : STRINGS.details.delete}
      >
        <MdDelete size={16} />
      </button>
    </div>
  </div>
);

export default DocumentHeader;
