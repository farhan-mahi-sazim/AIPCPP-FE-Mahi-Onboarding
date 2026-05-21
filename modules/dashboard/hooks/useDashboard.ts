import { useState, useEffect, useMemo } from "react";

import { notifications } from "@mantine/notifications";

import {
  useGetSummariesQuery,
  useDeleteDocumentMutation,
  useVectorSearchQuery,
} from "@/shared/redux/rtk-apis/documents.api";
import { TDashboardDocument, TDocumentSummary } from "@/shared/typedefs/dashboard.types";

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
  handleDelete: (id: string) => Promise<void>;
  refetch: () => void;
  isSemantic: boolean;
  setIsSemantic: (value: boolean) => void;
}

export const useDashboard = (): IUseDashboardReturn => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isSemantic, setIsSemantic] = useState(false);

  const [deleteDocument] = useDeleteDocumentMutation();
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const offset = (page - 1) * limit;

  const {
    data: response,
    isLoading: isSummariesLoading,
    error: summariesError,
    refetch: refetchSummaries,
  } = useGetSummariesQuery(
    {
      search: debouncedSearch,
      limit,
      offset,
    },
    { skip: isSemantic },
  );

  const showSemanticResults = isSemantic && !!debouncedSearch;

  const {
    data: vectorSearchResponse,
    isLoading: isVectorSearchLoading,
    error: vectorSearchError,
  } = useVectorSearchQuery(
    {
      query: debouncedSearch,
      limit,
      offset,
    },
    { skip: !showSemanticResults },
  );

  const documents = useMemo(() => {
    if (isSemantic) {
      return vectorSearchResponse?.results ?? [];
    }
    return response?.data ?? [];
  }, [isSemantic, response?.data, vectorSearchResponse?.results]);

  const totalPages = useMemo(() => {
    if (isSemantic) {
      return showSemanticResults ? Math.ceil((vectorSearchResponse?.total ?? 0) / limit) || 1 : 1;
    }
    return response?.total_pages ?? 1;
  }, [isSemantic, showSemanticResults, response?.total_pages, vectorSearchResponse?.total]);

  const processedDocuments = useMemo(() => {
    if (isSemantic) {
      let result = [...documents];
      if (filterType) {
        result = result.filter((doc) => {
          const fileType =
            "file_type" in doc ? doc.file_type : doc.filename.split(".").pop()?.toUpperCase();
          return fileType === filterType;
        });
      }
      return result;
    }

    let result = [...documents] as TDocumentSummary[];
    if (filterType) {
      result = result.filter((doc) => doc.file_type === filterType);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [documents, filterType, sortOrder, isSemantic]);

  const isLoading = isSemantic
    ? showSemanticResults
      ? isVectorSearchLoading
      : false
    : isSummariesLoading;
  const error = isSemantic ? (showSemanticResults ? vectorSearchError : null) : summariesError;

  const refetch = () => {
    if (!isSemantic) {
      refetchSummaries();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id).unwrap();
        notifications.show({
          title: "Deleted",
          message: "Document deleted successfully.",
          color: "teal",
        });
        refetch();
      } catch (err) {
        console.error("Delete failed", err);
        notifications.show({
          title: "Error",
          message: "Failed to delete document.",
          color: "red",
        });
      }
    }
  };

  return {
    search,
    debouncedSearch,
    sortOrder,
    filterType,
    page,
    totalPages,
    documents,
    isLoading,
    error,
    processedDocuments,
    setSearch,
    setSortOrder,
    setFilterType,
    setPage,
    handleDelete,
    refetch,
    isSemantic,
    setIsSemantic,
  };
};
