import { useState, useEffect, useMemo } from "react";

import { notifications } from "@mantine/notifications";

import {
  useGetSummariesQuery,
  useDeleteDocumentMutation,
} from "@/shared/redux/rtk-apis/documents.api";

export interface IUseDashboardReturn {
  search: string;
  debouncedSearch: string;
  sortOrder: "asc" | "desc";
  filterType: string | null;
  page: number;
  totalPages: number;
  documents: ReturnType<typeof useGetSummariesQuery>["data"]["data"];
  isLoading: boolean;
  error: unknown;
  processedDocuments: ReturnType<typeof useGetSummariesQuery>["data"]["data"];
  setSearch: (value: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setFilterType: (type: string | null) => void;
  setPage: (page: number) => void;
  handleDelete: (id: string) => Promise<void>;
  refetch: ReturnType<typeof useGetSummariesQuery>["refetch"];
}

export const useDashboard = (): IUseDashboardReturn => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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
    isLoading,
    error,
    refetch,
  } = useGetSummariesQuery({
    search: debouncedSearch,
    limit,
    offset,
  });

  const documents = useMemo(() => response?.data ?? [], [response?.data]);
  const totalPages = useMemo(() => response?.total_pages ?? 1, [response?.total_pages]);

  const processedDocuments = useMemo(() => {
    let result = [...documents];

    if (filterType) {
      result = result.filter((doc) => doc.file_type === filterType);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [documents, filterType, sortOrder]);

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
  };
};
