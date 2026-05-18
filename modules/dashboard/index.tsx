import React, { useState } from "react";

import { useGetSummariesQuery } from "@/shared/redux/rtk-apis/documents.api";

import DocumentGrid from "./components/DocumentGrid/DocumentGrid";
import SearchHeader from "./components/SearchHeader/SearchHeader";

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

  const { data: response, isLoading, error } = useGetSummariesQuery({ search });

  const documents = response?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <main className="pt-24 px-container-margin pb-12 max-w-[1440px] mx-auto">
        <SearchHeader
          search={search}
          onSearchChange={setSearch}
        />
        <DocumentGrid
          documents={documents}
          isLoading={isLoading}
          error={error}
        />
        <DashboardFooter />
      </main>
    </div>
  );
};

export default Dashboard;
