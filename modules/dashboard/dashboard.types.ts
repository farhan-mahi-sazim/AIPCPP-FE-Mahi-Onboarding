export interface IDocumentSummary {
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

export interface IGetSummariesResponse {
  data: IDocumentSummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface IGetSummariesArg {
  limit?: number;
  offset?: number;
  search?: string;
  file_type?: string | null;
  sort_order?: "asc" | "desc";
}

export interface ISearchHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilter?: () => void;
  onFilterSelect?: (value: string | null) => void;
  onSort?: () => void;
  filterType?: string | null;
  sortOrder?: "asc" | "desc";
  isSemantic?: boolean;
  onToggleSemantic?: () => void;
}

export interface IUploadDocumentResponse {
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

export interface IJobStatusResponse {
  id: string;
  status: "PENDING" | "EXTRACTING" | "ANALYZING" | "PERSISTING" | "COMPLETED" | "FAILED";
}

export interface IVectorSearchArg {
  query: string;
  limit?: number;
  offset?: number;
}

export interface IVectorSearchResult {
  document_id: string;
  filename: string;
  file_type: "PDF" | "DOC" | "DOCX" | "TXT" | string;
  summary: string | null;
  created_at: string;
  relevance: "low" | "medium" | "high" | string;
  match_count: number;
  best_chunk: {
    chunk_index: number;
    highlight: string;
    similarity_score: number;
  };
}

export interface IVectorSearchResponse {
  query: string;
  synthesis_answer: string | null;
  total: number;
  limit: number;
  offset: number;
  results: IVectorSearchResult[];
}

export type TDashboardDocument = IDocumentSummary | IVectorSearchResult;

export interface IDocumentCardProps {
  document: TDashboardDocument;
  onMenuClick?: (documentId: string) => void;
}

export interface IDocumentGridProps {
  documents: TDashboardDocument[];
  isLoading: boolean;
  error: unknown;
  onUploadClick?: () => void;
  onDocumentMenuClick?: (documentId: string) => void;
  synthesisAnswer?: string | null;
}
