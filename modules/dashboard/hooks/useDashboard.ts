import { useState, useEffect, useMemo } from "react";

import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";
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
  handleDelete: (id: string) => void;
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

  useEffect(() => {
    setPage(1);
  }, [filterType]);

  const offset = (page - 1) * limit;

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetSummariesQuery({
    search: debouncedSearch,
    file_type: filterType,
    sort_order: sortOrder,
    limit,
    offset,
  });

  const documents = useMemo(() => response?.data ?? [], [response?.data]);
  const totalPages = useMemo(() => response?.total_pages ?? 1, [response?.total_pages]);

  const processedDocuments = useMemo(() => documents, [documents]);

  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: "Delete Document",
      children: STRINGS.details.deleteConfirm,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteDocument(id).unwrap();
          notifications.show({
            title: STRINGS.details.deleted,
            message: STRINGS.details.deletedMsg,
            color: "teal",
          });
          refetch();
        } catch (err) {
          console.error("Delete failed", err);
          notifications.show({
            title: STRINGS.details.error,
            message: STRINGS.details.errorMsg,
            color: "red",
          });
        }
      },
    });
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
