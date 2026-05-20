export interface TDocumentSummary {
  document_id: string;
  filename: string;
  file_type: "PDF" | "DOCX" | "TXT" | string;
  summary: string | null;
  category: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TGetSummariesResponse {
  data: TDocumentSummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TGetSummariesArg {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface IDocumentCardProps {
  document: TDocumentSummary;
  onMenuClick?: (documentId: string) => void;
}

export interface ISearchHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilter?: () => void;
  onSort?: () => void;
}

export interface IDocumentGridProps {
  documents: TDocumentSummary[];
  isLoading: boolean;
  error: unknown;
  onUploadClick?: () => void;
  onDocumentMenuClick?: (documentId: string) => void;
}
