import React from "react";

import { MdMoreVert } from "react-icons/md";

import { Card } from "@/shared/components/ui/card";
import { IDocumentCardProps, TVectorSearchResult } from "@/shared/typedefs/dashboard.types";

import { useDocumentCard } from "./useDocumentCard";

const DocumentCard: React.FC<IDocumentCardProps> = ({ document, onMenuClick }) => {
  const {
    showMenu,
    handleCardClick,
    handleMenuToggle,
    handleViewDetails,
    handleDelete,
    fileConfig,
  } = useDocumentCard(document, onMenuClick);

  const filename = document.filename;
  const category = "category" in document ? document.category : undefined;
  const tags = "tags" in document ? document.tags : undefined;
  const summary_title = "summary_title" in document ? document.summary_title : undefined;
  const similarityScore =
    "similarity_score" in document ? (document as TVectorSearchResult).similarity_score : undefined;
  const chunkContent =
    "chunk_content" in document ? (document as TVectorSearchResult).chunk_content : undefined;

  const FileIcon = fileConfig.icon;

  return (
    <Card
      className="glass-card group hover:border-primary/40 transition-all cursor-pointer p-4"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 flex-shrink-0 ${fileConfig.bg} ${fileConfig.text} rounded-lg flex items-center justify-center`}
        >
          <FileIcon className="text-[28px]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-body-md text-on-surface font-semibold">{filename}</h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {similarityScore !== undefined && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase">
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

          {summary_title && (
            <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{summary_title}</p>
          )}

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

        <div className="relative flex-shrink-0">
          <button
            className="text-outline hover:text-primary transition-colors p-1"
            onClick={handleMenuToggle}
            aria-label="Document options"
          >
            <MdMoreVert className="text-xl" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-surface-container border border-white/10 rounded-lg shadow-xl z-20">
              <button
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 transition-colors first:rounded-t-lg"
                onClick={handleViewDetails}
              >
                View Details
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors last:rounded-b-lg"
                onClick={handleDelete}
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
