import React, { useState } from "react";

import { useGetSummariesQuery } from "@/shared/redux/rtk-apis/documents.api";

import DashboardFooter from "./components/DashboardFooter";
import DocumentGrid from "./components/DocumentGrid/DocumentGrid";
import SearchHeader from "./components/SearchHeader/SearchHeader";

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");

  const { data: response, isLoading, error } = useGetSummariesQuery({ search });

  const documents = response?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <main className="pt-24 px-container-margin pb-12 max-w-[1440px] mx-auto">
        <SearchHeader search={search} onSearchChange={setSearch} />
        <DocumentGrid documents={documents} isLoading={isLoading} error={error} />
        <DashboardFooter />
      </main>
    </div>
  );
};

export default Dashboard;
