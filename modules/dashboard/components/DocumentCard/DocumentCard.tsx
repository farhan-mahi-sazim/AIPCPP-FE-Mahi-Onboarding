import React from "react";

import { MdPictureAsPdf, MdDescription, MdMoreVert } from "react-icons/md";

import { Card } from "@/shared/components/ui/card";

import { IDocumentCardProps } from "@/shared/typedefs/dashboard.types";


const FILE_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  PDF: { bg: "bg-red-500/10", text: "text-red-400" },
  DOCX: { bg: "bg-blue-500/10", text: "text-blue-400" },
  TXT: { bg: "bg-green-500/10", text: "text-green-400" },
};

const DEFAULT_FILE_STYLE = { bg: "bg-surface-container", text: "text-outline" };

const DocumentCard: React.FC<IDocumentCardProps> = ({ document, onMenuClick }) => {
  const { document_id, filename, file_type, category, tags, created_at } = document;
  const fileStyle = FILE_TYPE_STYLES[file_type] ?? DEFAULT_FILE_STYLE;
  const FileIcon = file_type === "PDF" ? MdPictureAsPdf : MdDescription;

  return (
    <Card className="glass-card group hover:border-primary/40 transition-all cursor-pointer p-4">
      <div className="flex items-center gap-4">
        {/* File Type Icon */}
        <div className={`w-12 h-12 flex-shrink-0 ${fileStyle.bg} ${fileStyle.text} rounded-lg flex items-center justify-center`}>
          <FileIcon className="text-[28px]" />
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-body-md text-on-surface font-semibold truncate">{filename}</h3>
            {category && (
              <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded uppercase flex-shrink-0">
                {category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-label-sm text-on-surface-variant opacity-60 flex-shrink-0">
              {new Date(created_at).toLocaleDateString()}
            </span>
            <div className="flex gap-1.5 overflow-hidden">
              {(tags ?? []).map((tag) => (
                <span key={tag} className="text-[10px] text-outline bg-white/5 px-1.5 rounded truncate">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <button
          className="text-outline hover:text-primary transition-colors flex-shrink-0"
          onClick={() => onMenuClick?.(document_id)}
          aria-label="Document options"
        >
          <MdMoreVert className="text-xl" />
        </button>
      </div>
    </Card>
  );
};

export default DocumentCard;
