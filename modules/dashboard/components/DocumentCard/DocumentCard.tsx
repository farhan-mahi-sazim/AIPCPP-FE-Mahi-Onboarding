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

  const fileType = "file_type" in document ? document.file_type : "TXT";
  const category = "category" in document ? document.category : null;
  const tags = "tags" in document ? document.tags : [];
  const chunkContent = "chunk_content" in document ? document.chunk_content : null;
  const similarityScore = "similarity_score" in document ? document.similarity_score : undefined;

  const fileStyle = FILE_TYPE_STYLES[fileType] ?? DEFAULT_FILE_STYLE;
  const FileIcon = fileType === "PDF" ? MdPictureAsPdf : MdDescription;

  return (
    <Card
      className="glass-card group hover:border-primary/40 transition-all cursor-pointer p-4 h-full flex flex-col justify-between"
      onClick={() => router.push(`/document/${document.document_id}`)}
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
            <h3 className="text-body-md text-on-surface font-semibold truncate">
              {document.filename}
            </h3>
            <div className="flex gap-2 flex-shrink-0">
              {similarityScore !== undefined && (
                <span className="text-[10px] font-bold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2 py-0.5 rounded uppercase">
                  Match: {Math.round(similarityScore * 100)}%
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
              {new Date(document.created_at).toLocaleDateString()}
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

            {chunkContent && (
              <p className="text-sm text-outline-variant mt-2 line-clamp-3 bg-white/5 p-2 rounded-lg">
                &quot;{chunkContent}&quot;
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
                  router.push(`/document/${document.document_id}`);
                  setShowMenu(false);
                }}
              >
                View Details
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors last:rounded-b-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuClick?.(document.document_id);
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
