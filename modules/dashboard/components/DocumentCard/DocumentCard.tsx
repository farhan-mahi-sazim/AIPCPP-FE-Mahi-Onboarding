import React from "react";

import { MdMoreVert } from "react-icons/md";

import { Card } from "@/shared/components/ui/card";
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
  } = useDocumentCard(document, onMenuClick);

  const { filename, category, tags, created_at, summary_title } = document;
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
            {category && (
              <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-2 py-0.5 rounded uppercase flex-shrink-0">
                {category}
              </span>
            )}
          </div>

          {summary_title && (
            <p className="text-sm text-on-surface-variant mt-1 line-clamp-1">{summary_title}</p>
          )}

          <div className="flex flex-col gap-2 mt-1">
            <span className="text-label-sm text-on-surface-variant opacity-60 flex-shrink-0">
              {new Date(created_at).toLocaleDateString()}
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {(tags ?? []).map((tag) => (
                <span key={tag} className="text-xs text-outline bg-white/5 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
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
