import { useState } from "react";

import { useRouter } from "next/router";

import {
  MdPictureAsPdf,
  MdDescription,
  MdTextSnippet,
  MdInsertPhoto,
  MdInsertDriveFile,
} from "react-icons/md";

import { IDocumentCardProps, TVectorSearchResult } from "@/shared/typedefs/dashboard.types";

export const FILE_TYPE_CONFIG: Record<
  string,
  { bg: string; text: string; icon: React.ElementType }
> = {
  PDF: { bg: "bg-red-500/10", text: "text-red-400", icon: MdPictureAsPdf },
  DOCX: { bg: "bg-blue-500/10", text: "text-blue-400", icon: MdDescription },
  DOC: { bg: "bg-blue-500/10", text: "text-blue-400", icon: MdDescription },
  TXT: { bg: "bg-green-500/10", text: "text-green-400", icon: MdTextSnippet },
  JPG: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
  JPEG: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
  PNG: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
  GIF: { bg: "bg-purple-500/10", text: "text-purple-400", icon: MdInsertPhoto },
};

export const DEFAULT_FILE_CONFIG = {
  bg: "bg-surface-container",
  text: "text-outline",
  icon: MdInsertDriveFile,
};

export interface IUseDocumentCardReturn {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  handleCardClick: () => void;
  handleMenuToggle: (e: React.MouseEvent) => void;
  handleViewDetails: (e: React.MouseEvent) => void;
  handleDelete: (e: React.MouseEvent) => void;
  fileConfig: { bg: string; text: string; icon: React.ElementType };
  filename: string;
  category?: string | null;
  tags?: string[] | null;
  summaryTitle?: string | null;
  summaryText?: string | null;
  relevance?: string;
  matchCount?: number;
  bestHighlight?: string;
  highlightScore?: number;
}

export const useDocumentCard = (
  document: IDocumentCardProps["document"],
  onMenuClick?: (documentId: string) => void,
): IUseDocumentCardReturn => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const { document_id } = document;
  const file_type = document.file_type || document.filename?.split(".").pop();

  const fileConfig = FILE_TYPE_CONFIG[file_type?.toUpperCase() || ""] ?? DEFAULT_FILE_CONFIG;
  const filename = document.filename;
  const category = "category" in document ? document.category : undefined;
  const tags = "tags" in document ? document.tags : undefined;
  const summaryTitle = "summary_title" in document ? document.summary_title : undefined;
  const summaryText = "summary" in document ? document.summary : undefined;
  const relevance =
    "relevance" in document ? (document as TVectorSearchResult).relevance : undefined;
  const matchCount =
    "match_count" in document ? (document as TVectorSearchResult).match_count : undefined;
  const bestHighlight =
    "best_chunk" in document ? (document as TVectorSearchResult).best_chunk.highlight : undefined;
  const highlightScore =
    "best_chunk" in document
      ? (document as TVectorSearchResult).best_chunk.similarity_score
      : undefined;

  const handleCardClick = () => {
    router.push(`/document/${document_id}`);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/document/${document_id}`);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick?.(document_id);
    setShowMenu(false);
  };

  return {
    showMenu,
    setShowMenu,
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
  };
};
