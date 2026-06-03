export interface TDocumentSummary {
  document_id: string;
  filename: string;
  file_type: "PDF" | "DOCX" | "TXT" | string;
  summary: string | null;
  summary_title?: string | null;
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
  file_type?: string | null;
  sort_order?: "asc" | "desc";
}

export interface IDocumentCardProps {
  document: TDocumentSummary;
  onMenuClick?: (documentId: string) => void;
}

export interface ISearchHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilter?: () => void;
  onFilterSelect?: (value: string | null) => void;
  onSort?: () => void;
  filterType?: string | null;
  sortOrder?: "asc" | "desc";
}

export interface IDocumentGridProps {
  documents: TDocumentSummary[];
  isLoading: boolean;
  error: unknown;
  onUploadClick?: () => void;
  onDocumentMenuClick?: (documentId: string) => void;
}

export interface TUploadDocumentResponse {
  document: {
    id: string;
    filename: string;
    file_type: string;
    created_at: string;
  };
  job: {
    id: string;
    status: "PENDING" | "EXTRACTING" | "ANALYZING" | "PERSISTING" | "COMPLETED" | "FAILED";
  };
  message: string;
}

export interface TJobStatusResponse {
  id: string;
  status: "PENDING" | "EXTRACTING" | "ANALYZING" | "PERSISTING" | "COMPLETED" | "FAILED";
}

export interface TTimelineItem {
  id: string;
  version_number: number;
  source: "AI" | "HUMAN";
  data: {
    filename?: string;
    summary?: string;
    summary_title?: string;
    tags?: string[];
    category?: string;
  };
  created_at: string;
}
