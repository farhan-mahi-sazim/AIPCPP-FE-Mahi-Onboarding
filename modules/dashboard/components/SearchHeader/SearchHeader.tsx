import React from "react";

import { Menu } from "@mantine/core";
import clsx from "clsx";
import { MdSearch, MdFilterList, MdSort, MdPsychology } from "react-icons/md";

import { FILE_TYPE_OPTIONS } from "@/shared/constants/app.constants";
import { ISearchHeaderProps } from "@/shared/typedefs/dashboard.types";

const SearchHeader: React.FC<ISearchHeaderProps> = ({
  search,
  onSearchChange,
  onFilterSelect,
  onSort,
  filterType,
  sortOrder,
  isSemantic,
  onToggleSemantic,
}) => (
  <section className="mb-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-gutter">
      {/* Search Input */}
      <div className="flex-1 relative max-w-2xl">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl" />
        <input
          id="document-search"
          className="w-full bg-surface-container border border-white/10 rounded-xl py-3 pl-12 pr-4 text-on-surface focus:border-primary focus:ring-0 transition-all"
          placeholder={
            isSemantic
              ? "Ask a question about your documents..."
              : "Search files by name, type, or tag..."
          }
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search documents"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Semantic Toggle */}
        <button
          className={clsx(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors border",
            isSemantic
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-surface-container border-white/10 text-on-surface-variant hover:bg-surface-container-high",
          )}
          onClick={onToggleSemantic}
          aria-label="Toggle semantic search"
        >
          <MdPsychology className="text-[20px]" />
          <span className="text-label-md">Semantic</span>
        </button>

        {/* Filter Dropdown */}
        <Menu shadow="md" width={150}>
          <Menu.Target>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Filter documents"
            >
              <MdFilterList className="text-[20px]" />
              <span className="text-label-md">{filterType ? `Type: ${filterType}` : "Filter"}</span>
            </button>
          </Menu.Target>

          <Menu.Dropdown className="bg-surface-container border border-white/10">
            <Menu.Item
              onClick={() => onFilterSelect?.(null)}
              className="text-on-surface hover:bg-white/5"
            >
              All
            </Menu.Item>
            {FILE_TYPE_OPTIONS.map((type) => (
              <Menu.Item
                key={type}
                onClick={() => onFilterSelect?.(type)}
                className="text-on-surface hover:bg-white/5"
              >
                {type}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary hover:bg-primary/20 transition-colors"
          onClick={onSort}
          aria-label="Sort documents"
        >
          <MdSort className="text-[20px]" />
          <span className="text-label-md">{sortOrder === "desc" ? "Newest" : "Oldest"}</span>
        </button>
      </div>
    </div>
  </section>
);

export default SearchHeader;
