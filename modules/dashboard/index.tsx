import React from "react";

import { Pagination } from "@mantine/core";

import DashboardFooter from "./components/DashboardFooter";
import DocumentGrid from "./components/DocumentGrid/DocumentGrid";
import SearchHeader from "./components/SearchHeader/SearchHeader";
import UploadSection from "./components/UploadSection/UploadSection";
import { useDashboard } from "./hooks/useDashboard";

const Dashboard: React.FC = () => {
  const [showUpload, setShowUpload] = React.useState(false);
  const uploadRef = React.useRef<HTMLDivElement>(null);

  const {
    search,
    sortOrder,
    filterType,
    page,
    totalPages,
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
  } = useDashboard();

  const handleUploadSuccess = () => {
    refetch();
    setShowUpload(false);
  };

  React.useEffect(() => {
    if (showUpload && uploadRef.current) {
      uploadRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showUpload]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <main className="pt-24 px-container-margin pb-12 max-w-[1440px] mx-auto">
        <SearchHeader
          search={search}
          onSearchChange={setSearch}
          onFilterSelect={setFilterType}
          onSort={() => {
            const nextOrder = sortOrder === "desc" ? "asc" : "desc";
            setSortOrder(nextOrder);
          }}
          filterType={filterType}
          sortOrder={sortOrder}
          isSemantic={isSemantic}
          onToggleSemantic={() => {
            setIsSemantic(!isSemantic);
            setPage(1);
          }}
        />

        {showUpload && (
          <div ref={uploadRef}>
            <UploadSection onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        <DocumentGrid
          documents={processedDocuments}
          isLoading={isLoading}
          error={error}
          onUploadClick={() => setShowUpload(true)}
          onDocumentMenuClick={handleDelete}
          synthesisAnswer={synthesisAnswer}
        />

        <div className="flex justify-center mt-8">
          <Pagination total={totalPages} value={page} onChange={setPage} radius="xl" color="blue" />
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
};

export default Dashboard;
