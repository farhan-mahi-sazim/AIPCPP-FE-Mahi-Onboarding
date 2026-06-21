import { TDashboardDocument, IVectorSearchResult } from "@/modules/dashboard/dashboard.types";

export function isVectorSearchResult(
  document: TDashboardDocument,
): document is IVectorSearchResult {
  return "relevance" in document && "match_count" in document && "best_chunk" in document;
}
