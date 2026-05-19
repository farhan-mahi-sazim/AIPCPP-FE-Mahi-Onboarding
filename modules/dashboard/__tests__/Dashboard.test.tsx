import React from "react";

import { MantineProvider } from "@mantine/core";
import { render, screen, fireEvent, act } from "@testing-library/react";

import "@testing-library/jest-dom";
import { useGetSummariesQuery, useVectorSearchQuery } from "@/shared/redux/rtk-apis/documents.api";

import Dashboard from "../index";

jest.mock("@/shared/redux/rtk-apis/documents.api", () => ({
  useGetSummariesQuery: jest.fn(),
  useVectorSearchQuery: jest.fn(),
  useDeleteDocumentMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
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

const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("Dashboard", () => {
  beforeEach(() => {
    (useVectorSearchQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });
  it("renders the search bar", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [MOCK_DOCUMENT], total: 1, page: 1, page_size: 20, total_pages: 1 },
      isLoading: false,
      error: null,
    });
    renderWithMantine(<Dashboard />);
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
    renderWithMantine(<Dashboard />);
    expect(screen.getByText("Loading documents...")).toBeInTheDocument();
  });

  it("shows error state on failure", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500 },
    });
    renderWithMantine(<Dashboard />);
    expect(screen.getByText("Failed to load documents.")).toBeInTheDocument();
  });

  it("shows empty state when no documents", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, page_size: 20, total_pages: 0 },
      isLoading: false,
      error: null,
    });
    renderWithMantine(<Dashboard />);
    expect(screen.getByText("No documents found.")).toBeInTheDocument();
  });

  it("renders document cards with correct data", () => {
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [MOCK_DOCUMENT], total: 1, page: 1, page_size: 20, total_pages: 1 },
      isLoading: false,
      error: null,
    });
    renderWithMantine(<Dashboard />);
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
    renderWithMantine(<Dashboard />);
    expect(screen.getByText("Process new document")).toBeInTheDocument();
  });

  it("passes search value to the query hook", () => {
    jest.useFakeTimers();
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, page_size: 20, total_pages: 0 },
      isLoading: false,
      error: null,
    });
    renderWithMantine(<Dashboard />);
    const searchInput = screen.getByPlaceholderText("Search files by name, type, or tag...");

    act(() => {
      fireEvent.change(searchInput, { target: { value: "annual" } });
    });

    // Fast-forward time for debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(useGetSummariesQuery).toHaveBeenLastCalledWith(
      {
        search: "annual",
        limit: 10,
        offset: 0,
      },
      expect.anything(),
    );
    jest.useRealTimers();
  });

  it("toggles semantic search mode and calls vector search API", () => {
    jest.useFakeTimers();
    (useGetSummariesQuery as jest.Mock).mockReturnValue({
      data: { data: [], total: 0, page: 1, page_size: 20, total_pages: 0 },
      isLoading: false,
      error: null,
    });
    (useVectorSearchQuery as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            document_id: "uuid-2",
            filename: "semantic_match.pdf",
            chunk_content: "This is a semantic chunk.",
            similarity_score: 0.95,
            summary: "Semantic summary",
            created_at: "2024-05-15T10:00:00Z",
          },
        ],
        total: 1,
        query: "annual",
        limit: 10,
        offset: 0,
      },
      isLoading: false,
      error: null,
    });

    renderWithMantine(<Dashboard />);

    // Toggle Semantic Search
    const semanticButton = screen.getByRole("button", { name: "Toggle semantic search" });
    fireEvent.click(semanticButton);

    const searchInput = screen.getByPlaceholderText("Ask a question about your documents...");

    act(() => {
      fireEvent.change(searchInput, { target: { value: "annual" } });
    });

    // Fast-forward time for debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(useVectorSearchQuery).toHaveBeenCalledWith(
      { query: "annual", limit: 10, offset: 0 },
      expect.anything(),
    );

    // Check if the semantic result is rendered
    expect(screen.getByText("semantic_match.pdf")).toBeInTheDocument();
    expect(screen.getByText("Match: 95%")).toBeInTheDocument();
    expect(screen.getByText(/"This is a semantic chunk."/)).toBeInTheDocument();

    jest.useRealTimers();
  });
});
