import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import { useGetSummariesQuery } from "@/shared/redux/rtk-apis/documents.api";

import Dashboard from "../index";

jest.mock("@/shared/redux/rtk-apis/documents.api", () => ({
  useGetSummariesQuery: jest.fn(),
}));

const MOCK_DOCUMENT = {
  document_id: "uuid-1",
  filename: "test_report.pdf",
  file_type: "PDF",
  summary: "Test summary",
  category: "Finance",
  tags: ["revenue", "growth"],
  created_at: "2024-05-15T10:00:00Z",
  updated_at: "2024-05-15T12:00:00Z",
};

describe("Dashboard", () => {
  it("renders the search bar", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [MOCK_DOCUMENT], total: 1, page: 1, page_size: 20, total_pages: 1 },
      isLoading: false,
      error: null,
    });
    render(<Dashboard />);
    expect(
      screen.getByPlaceholderText("Search files by name, type, or tag..."),
    ).toBeInTheDocument();
  });

  it("shows loading spinner while fetching", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByText("Loading documents...")).toBeInTheDocument();
  });

  it("shows error state on failure", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500 },
    });
    render(<Dashboard />);
    expect(screen.getByText("Failed to load documents.")).toBeInTheDocument();
  });

  it("shows empty state when no documents", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, page_size: 20, total_pages: 0 },
      isLoading: false,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByText("No documents found.")).toBeInTheDocument();
  });

  it("renders document cards with correct data", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [MOCK_DOCUMENT], total: 1, page: 1, page_size: 20, total_pages: 1 },
      isLoading: false,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByText("test_report.pdf")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("#revenue")).toBeInTheDocument();
    expect(screen.getByText("#growth")).toBeInTheDocument();
  });

  it("always shows the upload card", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [MOCK_DOCUMENT], total: 1, page: 1, page_size: 20, total_pages: 1 },
      isLoading: false,
      error: null,
    });
    render(<Dashboard />);
    expect(screen.getByText("Process new document")).toBeInTheDocument();
  });

  it("passes search value to the query hook", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, page_size: 20, total_pages: 0 },
      isLoading: false,
      error: null,
    });
    render(<Dashboard />);
    const searchInput = screen.getByPlaceholderText("Search files by name, type, or tag...");
    fireEvent.change(searchInput, { target: { value: "annual" } });
    expect(useGetSummariesQuery).toHaveBeenLastCalledWith({ search: "annual" });
  });
});
