import { TDashboardDocument } from "@/modules/dashboard/dashboard.types";

export interface IUseDashboardReturn {
  search: string;
  debouncedSearch: string;
  sortOrder: "asc" | "desc";
  filterType: string | null;
  page: number;
  totalPages: number;
  documents: TDashboardDocument[];
  isLoading: boolean;
  error: unknown;
  processedDocuments: TDashboardDocument[];
  setSearch: (value: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setFilterType: (type: string | null) => void;
  setPage: (page: number) => void;
  handleDelete: (id: string) => void;
  refetch: () => void;
  isSemantic: boolean;
  setIsSemantic: (value: boolean) => void;
  synthesisAnswer: string | null;
}
