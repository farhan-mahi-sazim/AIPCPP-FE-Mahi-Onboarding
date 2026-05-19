import React, { useState } from "react";

import { useRouter } from "next/router";

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
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  // Cast to any to handle both TDocumentSummary and TVectorSearchResult
  const {
    document_id,
    filename,
    file_type,
    category,
    tags,
    created_at,
    chunk_content,
    similarity_score,
  } = document as any;

  const fileStyle = FILE_TYPE_STYLES[file_type] ?? DEFAULT_FILE_STYLE;
  const FileIcon = file_type === "PDF" ? MdPictureAsPdf : MdDescription;

  return (
    <Card
      className="glass-card group hover:border-primary/40 transition-all cursor-pointer p-4 h-full flex flex-col justify-between"
      onClick={() => router.push(`/document/${document_id}`)}
    >
      <div className="flex items-start gap-4">
        {/* File Type Icon */}
        <div
          className={`w-12 h-12 flex-shrink-0 ${fileStyle.bg} ${fileStyle.text} rounded-lg flex items-center justify-center`}
        >
          <FileIcon className="text-[28px]" />
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-body-md text-on-surface font-semibold truncate">{filename}</h3>
            <div className="flex gap-2 flex-shrink-0">
              {similarity_score !== undefined && (
                <span className="text-[10px] font-bold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2 py-0.5 rounded uppercase">
                  Match: {Math.round(similarity_score * 100)}%
                </span>
              )}
              {category && (
                <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded uppercase">
                  {category}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <span className="text-label-sm text-on-surface-variant opacity-60 flex-shrink-0">
              {new Date(created_at).toLocaleDateString()}
            </span>

            {tags && tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {tags.map((tag: string) => (
                  <span key={tag} className="text-xs text-outline bg-white/5 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {chunk_content && (
              <p className="text-sm text-outline-variant mt-2 line-clamp-3 bg-white/5 p-2 rounded-lg text-sm">
                "{chunk_content}"
              </p>
            )}
          </div>
        </div>

        {/* Menu Button with Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            className="text-outline hover:text-primary transition-colors p-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            aria-label="Document options"
          >
            <MdMoreVert className="text-xl" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-surface-container border border-white/10 rounded-lg shadow-xl z-20">
              <button
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 transition-colors first:rounded-t-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/document/${document_id}`);
                  setShowMenu(false);
                }}
              >
                View Details
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors last:rounded-b-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuClick?.(document_id);
                  setShowMenu(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;
