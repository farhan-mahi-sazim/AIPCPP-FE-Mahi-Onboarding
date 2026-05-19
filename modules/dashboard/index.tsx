import React, { useState, useEffect } from "react";

import { Pagination } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import {
  useGetSummariesQuery,
  useDeleteDocumentMutation,
} from "@/shared/redux/rtk-apis/documents.api";

import DocumentGrid from "./components/DocumentGrid/DocumentGrid";
import SearchHeader from "./components/SearchHeader/SearchHeader";
import UploadSection from "./components/UploadSection/UploadSection";

const DashboardFooter: React.FC = () => (
  <footer className="mt-section-gap pt-gutter border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-gutter">
    <div className="flex items-center gap-base">
      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      <span className="text-label-sm text-on-surface-variant">
        AIPCPP Neural Core v2.4.0 — 98.4% Accuracy
      </span>
    </div>
    <nav className="flex gap-gutter">
      {["System Health", "Compliance", "Docs"].map((link) => (
        <span
          key={link}
          className="text-label-sm text-outline hover:text-on-surface cursor-pointer transition-colors"
        >
          {link}
        </span>
      ))}
    </nav>
  </footer>
);

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [deleteDocument] = useDeleteDocumentMutation();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
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

  const documents = response?.data ?? [];
  const totalPages = response?.total_pages ?? 1;

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

  // Client-side filtering
  let processedDocuments = [...documents];
  if (filterType) {
    processedDocuments = processedDocuments.filter((doc) => doc.file_type === filterType);
  }

  // Client-side sorting
  processedDocuments.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const handleUploadSuccess = () => {
    refetch();
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <main className="pt-24 px-container-margin pb-12 max-w-[1440px] mx-auto">
        <SearchHeader
          search={search}
          onSearchChange={setSearch}
          onFilterSelect={(type) => {
            setFilterType(type);
          }}
          onSort={() => {
            const nextOrder = sortOrder === "desc" ? "asc" : "desc";
            setSortOrder(nextOrder);
          }}
          filterType={filterType}
          sortOrder={sortOrder}
        />

        {showUpload && <UploadSection onUploadSuccess={handleUploadSuccess} />}

        <DocumentGrid
          documents={processedDocuments}
          isLoading={isLoading}
          error={error}
          onUploadClick={() => setShowUpload(true)}
          onDocumentMenuClick={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8">
          <Pagination total={totalPages} value={page} onChange={setPage} radius="xl" color="blue" />
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
};

export default Dashboard;
