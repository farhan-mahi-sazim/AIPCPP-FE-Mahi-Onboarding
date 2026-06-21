import React from "react";

import { screen, fireEvent, waitFor, act } from "@testing-library/react";

import "@testing-library/jest-dom";
import {
  useGetDocumentTimelineQuery,
  useDeleteDocumentMutation,
  useCreateVersionOverrideMutation,
  useUpdateHumanVersionMutation,
  useDeleteVersionMutation,
} from "@/shared/redux/rtk-apis/documents.api";
import { ITimelineItem } from "@/shared/typedefs/common.types";
import { renderWithProviders } from "@/shared/utils/test-utils";

import DocumentDetails from "../index";

jest.mock("@/shared/redux/rtk-apis/documents.api", () => ({
  useGetDocumentTimelineQuery: jest.fn(),
  useDeleteDocumentMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useCreateVersionOverrideMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useUpdateHumanVersionMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useDeleteVersionMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),

  useGetSummariesQuery: jest.fn(() => ({ data: null, isLoading: false, error: null })),
  useUploadDocumentMutation: jest.fn(() => [jest.fn(), { isLoading: false, error: null }]),
  useGetJobStatusQuery: jest.fn(() => ({ data: null })),
  useVectorSearchQuery: jest.fn(() => ({ data: null, isLoading: false, error: null })),
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { id: "doc-uuid-123" },
    push: jest.fn(),
  }),
}));

jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
  },
}));

const MOCK_AI_VERSION: ITimelineItem = {
  id: "v1-ai",
  version_number: 1,
  source: "AI",
  data: {
    filename: "annual_report.pdf",
    summary_title: "Annual Financial Report",
    category: "Finance",
    summary: "A detailed annual report covering fiscal year 2024.",
    tags: ["revenue", "growth", "forecast"],
  },
  created_at: "2024-06-01T10:00:00Z",
};

const MOCK_HUMAN_VERSION: ITimelineItem = {
  id: "v2-human",
  version_number: 2,
  source: "HUMAN",
  data: {
    filename: "annual_report.pdf",
    summary_title: "Annual Report – Updated",
    category: "Finance",
    summary: "Human-edited version of the annual report with corrections.",
    tags: ["revenue", "updated"],
  },
  created_at: "2024-06-05T14:30:00Z",
};

const MOCK_TIMELINE_DATA = {
  items: [MOCK_HUMAN_VERSION, MOCK_AI_VERSION],
  total: 2,
};

const mockTimelineQuery = (
  overrides: Partial<ReturnType<typeof useGetDocumentTimelineQuery>> = {},
) => {
  (useGetDocumentTimelineQuery as jest.Mock).mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    ...overrides,
  });
};

describe("DocumentDetails", () => {
  const mockDeleteDocument = jest.fn(() => ({ unwrap: () => Promise.resolve({ message: "ok" }) }));
  const mockCreateOverride = jest.fn(() => ({
    unwrap: () => Promise.resolve({ id: "v3-new", version_number: 3 }),
  }));
  const mockUpdateVersion = jest.fn(() => ({ unwrap: () => Promise.resolve({}) }));
  const mockDeleteVersion = jest.fn(() => ({ unwrap: () => Promise.resolve({ message: "ok" }) }));

  beforeEach(() => {
    jest.clearAllMocks();

    (useDeleteDocumentMutation as jest.Mock).mockReturnValue([
      mockDeleteDocument,
      { isLoading: false },
    ]);
    (useCreateVersionOverrideMutation as jest.Mock).mockReturnValue([
      mockCreateOverride,
      { isLoading: false },
    ]);
    (useUpdateHumanVersionMutation as jest.Mock).mockReturnValue([
      mockUpdateVersion,
      { isLoading: false },
    ]);
    (useDeleteVersionMutation as jest.Mock).mockReturnValue([
      mockDeleteVersion,
      { isLoading: false },
    ]);
  });

  it("renders loading skeletons while data is being fetched", () => {
    mockTimelineQuery({ isLoading: true });

    renderWithProviders(<DocumentDetails />);

    expect(screen.queryByText("Back to Dashboard")).not.toBeInTheDocument();
  });

  it("renders the error state on API failure", () => {
    mockTimelineQuery({ error: { status: 500 } });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("Error Loading Document")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("renders the success state with document data", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("annual_report.pdf")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();

    const summaryElements = screen.getAllByText(
      "Human-edited version of the annual report with corrections.",
    );
    expect(summaryElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders timeline with all versions", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("Timeline (History)")).toBeInTheDocument();
    expect(screen.getByText("Version 2")).toBeInTheDocument();
    expect(screen.getByText("Version 1")).toBeInTheDocument();
  });

  it("displays version source badges (AI and HUMAN)", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    const humanBadges = screen.getAllByText("HUMAN");
    const aiBadges = screen.getAllByText("AI");

    expect(humanBadges.length).toBeGreaterThanOrEqual(1);
    expect(aiBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("switches displayed data when a different version is selected", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    const initialSummaries = screen.getAllByText(
      "Human-edited version of the annual report with corrections.",
    );
    expect(initialSummaries.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByText("Version 1"));

    const updatedSummaries = screen.getAllByText(
      "A detailed annual report covering fiscal year 2024.",
    );
    expect(updatedSummaries.length).toBeGreaterThanOrEqual(1);
  });

  it("shows the Edit Details button when not in edit mode", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByLabelText("Edit Details")).toBeInTheDocument();
  });

  it("enters edit mode and displays the form when Edit Details is clicked", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Edit Details"));

    expect(screen.getByLabelText("Document Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Tags (comma-separated)")).toBeInTheDocument();
  });

  it("pre-populates form fields with the selected version data", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Edit Details"));

    expect(screen.getByLabelText("Document Title")).toHaveValue("Annual Report – Updated");
    expect(screen.getByLabelText("Category")).toHaveValue("Finance");
    expect(screen.getByLabelText("Summary")).toHaveValue(
      "Human-edited version of the annual report with corrections.",
    );
    expect(screen.getByLabelText("Tags (comma-separated)")).toHaveValue("revenue, updated");
  });

  it("hides the Edit Details button while in edit mode", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Edit Details"));

    expect(screen.queryByLabelText("Edit Details")).not.toBeInTheDocument();
  });

  it("exits edit mode when Cancel is clicked", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Edit Details"));
    expect(screen.getByLabelText("Document Title")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByLabelText("Document Title")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Edit Details")).toBeInTheDocument();
  });

  it("shows the 'Save as new version' checkbox for HUMAN versions", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Edit Details"));

    expect(
      screen.getByLabelText("Save as new version (retains historical version)"),
    ).toBeInTheDocument();
  });

  it("calls createVersionOverride when submitting with 'Create Override'", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Create Override"));

    const submitButton = screen.getByText("Create Override");
    expect(submitButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockCreateOverride).toHaveBeenCalledWith({
        documentId: "doc-uuid-123",
        data: {
          summary_title: "Annual Report – Updated",
          category: "Finance",
          summary: "Human-edited version of the annual report with corrections.",
          tags: ["revenue", "updated"],
        },
      });
    });
  });

  it("calls updateHumanVersion when submitting with 'Save Changes' (checkbox unchecked)", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Edit Details"));

    const submitButton = screen.getByText("Save Changes");
    expect(submitButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdateVersion).toHaveBeenCalledWith({
        versionId: "v2-human",
        documentId: "doc-uuid-123",
        data: {
          summary_title: "Annual Report – Updated",
          category: "Finance",
          summary: "Human-edited version of the annual report with corrections.",
          tags: ["revenue", "updated"],
        },
      });
    });
  });

  it("shows the delete button only for HUMAN versions in the timeline", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    const deleteButtons = screen.getAllByTitle("Delete version override");
    expect(deleteButtons).toHaveLength(1);
  });

  it("calls deleteVersion when the timeline delete button is clicked", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    const deleteButton = screen.getByTitle("Delete version override");

    act(() => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(mockDeleteVersion).toHaveBeenCalledWith({
        versionId: "v2-human",
        documentId: "doc-uuid-123",
      });
    });
  });

  it("does not show the 'Save as new version' checkbox when AI version is selected", () => {
    mockTimelineQuery({
      data: { items: [MOCK_AI_VERSION], total: 1 },
    });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Create Override"));

    expect(
      screen.queryByLabelText("Save as new version (retains historical version)"),
    ).not.toBeInTheDocument();
  });

  it("shows validation errors when form fields are cleared and submitted", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByLabelText("Edit Details"));

    const titleInput = screen.getByLabelText("Document Title");
    const categoryInput = screen.getByLabelText("Category");
    const summaryInput = screen.getByLabelText("Summary");
    const tagsInput = screen.getByLabelText("Tags (comma-separated)");

    fireEvent.change(titleInput, { target: { value: "" } });
    fireEvent.change(categoryInput, { target: { value: "" } });
    fireEvent.change(summaryInput, { target: { value: "" } });
    fireEvent.change(tagsInput, { target: { value: "" } });

    act(() => {
      fireEvent.click(screen.getByText("Save Changes"));
    });

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Category is required")).toBeInTheDocument();
    });

    expect(mockCreateOverride).not.toHaveBeenCalled();
  });

  it("renders the back button on the success page", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
  });

  it("renders the no-timeline fallback when items array is empty", () => {
    mockTimelineQuery({ data: { items: [], total: 0 } });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("No timeline items found.")).toBeInTheDocument();
  });
});
