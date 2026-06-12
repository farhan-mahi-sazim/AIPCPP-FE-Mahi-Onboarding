import { useRouter } from "next/router";

import {
  FILE_TYPE_CONFIG,
  DEFAULT_FILE_CONFIG,
} from "../components/DocumentCard/DocumentCard.constants";
import { isVectorSearchResult } from "../components/DocumentCard/DocumentCard.helpers";
import {
  IUseDocumentCardReturn,
  TDocumentCardInput,
} from "../components/DocumentCard/DocumentCard.types";

export const useDocumentCard = (
  document: TDocumentCardInput,
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
