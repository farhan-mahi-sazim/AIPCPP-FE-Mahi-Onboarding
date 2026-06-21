import { useState, useEffect, useMemo } from "react";

import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import { STRINGS } from "@/shared/constants/strings.constants";
import {
  useGetSummariesQuery,
  useDeleteDocumentMutation,
  useVectorSearchQuery,
} from "@/shared/redux/rtk-apis/documents.api";

import { IUseDashboardReturn } from "./useDashboard.types";

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

  useEffect(() => {
    setPage(1);
  }, [filterType]);

  const offset = (page - 1) * limit;

  const {
    data: response,
    isLoading: isSummariesLoading,
    error: summariesError,
    refetch: refetchSummaries,
  } = useGetSummariesQuery(
    {
      search: debouncedSearch,
      file_type: filterType,
      sort_order: sortOrder,
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
      if (!showSemanticResults) return [];
      return vectorSearchResponse?.results ?? [];
    }
    return response?.data ?? [];
  }, [isSemantic, showSemanticResults, response?.data, vectorSearchResponse?.results]);

  const synthesisAnswer = useMemo(() => {
    if (!showSemanticResults) {
      return null;
    }
    return vectorSearchResponse?.synthesis_answer ?? null;
  }, [showSemanticResults, vectorSearchResponse?.synthesis_answer]);

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
        result = result.filter((doc) => doc.file_type === filterType);
      }
      return result;
    }

    return documents;
  }, [documents, filterType, isSemantic]);

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
    isSemantic,
    setIsSemantic,
    synthesisAnswer,
  };
};
