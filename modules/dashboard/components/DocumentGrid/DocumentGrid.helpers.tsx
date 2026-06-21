import { TDashboardDocument } from "@/modules/dashboard/dashboard.types";
import { parseRTKErrorMessage } from "@/shared/utils/errors";

import DocumentCard from "../DocumentCard/DocumentCard";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";

export function renderContent(
  isLoading: boolean,
  error: unknown,
  documents: TDashboardDocument[],
  onDocumentMenuClick?: (documentId: string) => void,
) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={parseRTKErrorMessage(error)} />;
  if (documents.length === 0) return <EmptyState />;

  return documents.map((doc, index) => (
    <DocumentCard
      key={`${doc.document_id}-${index}`}
      document={doc}
      onMenuClick={onDocumentMenuClick}
    />
  ));
}
