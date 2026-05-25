import React from "react";

import { MdMoreVert } from "react-icons/md";

import { Card } from "@/shared/components/ui/card";
import { STRINGS } from "@/shared/constants/strings.constants";
import { IDocumentCardProps } from "@/shared/typedefs/dashboard.types";

import { useDocumentCard } from "./useDocumentCard";

const DocumentCard: React.FC<IDocumentCardProps> = ({ document, onMenuClick }) => {
  const {
    showMenu,
    handleCardClick,
    handleMenuToggle,
    handleViewDetails,
    handleDelete,
    fileConfig,
    filename,
    category,
    tags,
    summaryTitle,
    summaryText,
    relevance,
    matchCount,
    bestHighlight,
    highlightScore,
  } = useDocumentCard(document, onMenuClick);

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
              {relevance && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase">
                  {relevance}
                </span>
              )}
              {category && (
                <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded uppercase">
                  {category}
                </span>
              )}
            </div>
          </div>

          {summaryTitle && (
            <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{summaryTitle}</p>
          )}
          {summaryText && <p className="text-sm text-outline mt-1 line-clamp-2">{summaryText}</p>}

          <div className="flex flex-col gap-2 mt-1">
            <span className="text-label-sm text-on-surface-variant opacity-60 flex-shrink-0">
              {new Date(document.created_at).toLocaleDateString()}
            </span>

            {matchCount !== undefined && (
              <span className="text-[11px] uppercase tracking-[0.2em] text-outline">
                {matchCount} {STRINGS.dashboard.matches}
              </span>
            )}

            {tags && tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {tags.map((tag: string) => (
                  <span key={tag} className="text-xs text-outline bg-white/5 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {bestHighlight && (
              <div className="text-sm text-outline-variant mt-2 line-clamp-3 bg-white/5 p-2 rounded-lg">
                <span
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: bestHighlight }}
                />
              </div>
            )}
            {highlightScore !== undefined && (
              <span className="text-[10px] text-outline/70 uppercase tracking-[0.3em]">
                {STRINGS.dashboard.score} {Math.round(highlightScore * 100)}%
              </span>
            )}
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <button
            className="text-outline hover:text-primary transition-colors p-1"
            onClick={handleMenuToggle}
            aria-label={STRINGS.dashboard.documentOptions}
          >
            <MdMoreVert className="text-xl" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-surface-container border border-white/10 rounded-lg shadow-xl z-20">
              <button
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-white/5 transition-colors first:rounded-t-lg"
                onClick={handleViewDetails}
              >
                {STRINGS.dashboard.viewDetails}
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors last:rounded-b-lg"
                onClick={handleDelete}
              >
                {STRINGS.dashboard.delete}
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;
