import { useRouter } from "next/router";

import {
  MdPictureAsPdf,
  MdDescription,
  MdTextSnippet,
  MdInsertPhoto,
  MdInsertDriveFile,
} from "react-icons/md";

import {
  IDocumentCardProps,
  TDashboardDocument,
  TVectorSearchResult,
} from "@/shared/typedefs/dashboard.types";

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
  handleCardClick: () => void;
  handleViewDetails: () => void;
  handleDelete: () => void;
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

const isVectorSearchResult = (document: TDashboardDocument): document is TVectorSearchResult =>
  "relevance" in document && "match_count" in document && "best_chunk" in document;

export const useDocumentCard = (
  document: IDocumentCardProps["document"],
  onMenuClick?: (documentId: string) => void,
): IUseDocumentCardReturn => {
  const router = useRouter();
  const { document_id } = document;
  const file_type = document.file_type || document.filename?.split(".").pop();

  const fileConfig = FILE_TYPE_CONFIG[file_type?.toUpperCase() || ""] ?? DEFAULT_FILE_CONFIG;
  const filename = document.filename;
  const category = "category" in document ? document.category : undefined;
  const tags = "tags" in document ? document.tags : undefined;
  const summaryTitle = "summary_title" in document ? document.summary_title : undefined;
  const summaryText = "summary" in document ? document.summary : undefined;
  const relevance = isVectorSearchResult(document) ? document.relevance : undefined;
  const matchCount = isVectorSearchResult(document) ? document.match_count : undefined;
  const bestHighlight = isVectorSearchResult(document) ? document.best_chunk.highlight : undefined;
  const highlightScore = isVectorSearchResult(document)
    ? document.best_chunk.similarity_score
    : undefined;

  const handleNavigateToDetails = () => {
    router.push(`/document/${document_id}`);
  };

  const handleDelete = () => {
    onMenuClick?.(document_id);
  };

  return {
    handleCardClick: handleNavigateToDetails,
    handleViewDetails: handleNavigateToDetails,
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
