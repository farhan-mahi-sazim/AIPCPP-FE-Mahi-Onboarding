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
import { TTimelineItem } from "@/shared/typedefs/dashboard.types";
import { renderWithProviders } from "@/shared/utils/test-utils";

import DocumentDetails from "../index";

// ──────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────

jest.mock("@/shared/redux/rtk-apis/documents.api", () => ({
  useGetDocumentTimelineQuery: jest.fn(),
  useDeleteDocumentMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useCreateVersionOverrideMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useUpdateHumanVersionMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useDeleteVersionMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  // Keep other hooks that may be imported elsewhere in the provider tree
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

// ──────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────

const MOCK_AI_VERSION: TTimelineItem = {
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

const MOCK_HUMAN_VERSION: TTimelineItem = {
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

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const mockTimelineQuery = (overrides: Partial<ReturnType<typeof useGetDocumentTimelineQuery>> = {}) => {
  (useGetDocumentTimelineQuery as jest.Mock).mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    ...overrides,
  });
};

// ──────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────

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
    (useDeleteVersionMutation as jest.Mock).mockReturnValue([mockDeleteVersion, { isLoading: false }]);
  });

  // ──────────────────────────────────────────
  // Three-State Mandate
  // ──────────────────────────────────────────

  it("renders loading skeletons while data is being fetched", () => {
    mockTimelineQuery({ isLoading: true });

    renderWithProviders(<DocumentDetails />);

    // The loading state uses Mantine Skeletons which render as generic elements.
    // The back button and main content should NOT be visible.
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

    // The latest version (HUMAN v2) should be displayed by default
    expect(screen.getByText("annual_report.pdf")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    // Summary text appears in both the info card and the timeline preview
    const summaryElements = screen.getAllByText(
      "Human-edited version of the annual report with corrections.",
    );
    expect(summaryElements.length).toBeGreaterThanOrEqual(1);
  });

  // ──────────────────────────────────────────
  // Version Selection
  // ──────────────────────────────────────────

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

    // The timeline renders source badges for each version
    const humanBadges = screen.getAllByText("HUMAN");
    const aiBadges = screen.getAllByText("AI");

    expect(humanBadges.length).toBeGreaterThanOrEqual(1);
    expect(aiBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("switches displayed data when a different version is selected", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    // Initially shows HUMAN v2 data (summary appears in both info card and timeline)
    const initialSummaries = screen.getAllByText(
      "Human-edited version of the annual report with corrections.",
    );
    expect(initialSummaries.length).toBeGreaterThanOrEqual(1);

    // Click on AI v1 in the timeline
    fireEvent.click(screen.getByText("Version 1"));

    // Now the info card should show AI v1 data (appears in both info card and timeline)
    const updatedSummaries = screen.getAllByText(
      "A detailed annual report covering fiscal year 2024.",
    );
    expect(updatedSummaries.length).toBeGreaterThanOrEqual(1);
  });

  // ──────────────────────────────────────────
  // Edit Mode
  // ──────────────────────────────────────────

  it("shows the Edit Details button when not in edit mode", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("Edit Details")).toBeInTheDocument();
  });

  it("enters edit mode and displays the form when Edit Details is clicked", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByText("Edit Details"));

    // The form inputs should now be visible
    expect(screen.getByLabelText("Document Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Tags (comma-separated)")).toBeInTheDocument();
  });

  it("pre-populates form fields with the selected version data", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByText("Edit Details"));

    // HUMAN v2 is selected by default
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

    fireEvent.click(screen.getByText("Edit Details"));

    expect(screen.queryByText("Edit Details")).not.toBeInTheDocument();
  });

  it("exits edit mode when Cancel is clicked", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByText("Edit Details"));
    expect(screen.getByLabelText("Document Title")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    // Should be back to view mode
    expect(screen.queryByLabelText("Document Title")).not.toBeInTheDocument();
    expect(screen.getByText("Edit Details")).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Create New Version Override
  // ──────────────────────────────────────────

  it("shows the 'Save as new version' checkbox for HUMAN versions", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    // Default selected version is HUMAN v2 → showCreateNewOption = !isAI = true
    fireEvent.click(screen.getByText("Edit Details"));

    expect(
      screen.getByLabelText("Save as new version (retains historical version)"),
    ).toBeInTheDocument();
  });

  it("calls createVersionOverride when submitting with 'Create Override'", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByText("Edit Details"));

    // The checkbox is checked by default (isCreateNewVersion = true)
    const submitButton = screen.getByText("Create Override");
    expect(submitButton).toBeInTheDocument();

    await act(async () => {
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

  // ──────────────────────────────────────────
  // Update Existing Human Version
  // ──────────────────────────────────────────

  it("calls updateHumanVersion when submitting with 'Save Changes' (checkbox unchecked)", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByText("Edit Details"));

    // Uncheck the "Save as new version" checkbox
    const checkbox = screen.getByLabelText("Save as new version (retains historical version)");
    fireEvent.click(checkbox);

    const submitButton = screen.getByText("Save Changes");
    expect(submitButton).toBeInTheDocument();

    await act(async () => {
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

  // ──────────────────────────────────────────
  // Delete Version
  // ──────────────────────────────────────────

  it("shows the delete button only for HUMAN versions in the timeline", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    // The delete button (trash icon) should be rendered for HUMAN versions only
    const deleteButtons = screen.getAllByTitle("Delete version override");
    expect(deleteButtons).toHaveLength(1); // Only for HUMAN v2
  });

  it("calls deleteVersion when the timeline delete button is clicked", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    const deleteButton = screen.getByTitle("Delete version override");

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(mockDeleteVersion).toHaveBeenCalledWith({
        versionId: "v2-human",
        documentId: "doc-uuid-123",
      });
    });
  });

  // ──────────────────────────────────────────
  // AI Version Restrictions
  // ──────────────────────────────────────────

  it("does not show the 'Save as new version' checkbox when AI version is selected", () => {
    // Only AI version in the timeline → forces isCreateNewVersion = true, hides checkbox
    mockTimelineQuery({
      data: { items: [MOCK_AI_VERSION], total: 1 },
    });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByText("Edit Details"));

    // showCreateNewOption = !isSelectedVersionAI → false for AI, so checkbox is hidden
    expect(
      screen.queryByLabelText("Save as new version (retains historical version)"),
    ).not.toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Form Validation (Zod)
  // ──────────────────────────────────────────

  it("shows validation errors when form fields are cleared and submitted", async () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    fireEvent.click(screen.getByText("Edit Details"));

    // Clear all fields
    const titleInput = screen.getByLabelText("Document Title");
    const categoryInput = screen.getByLabelText("Category");
    const summaryInput = screen.getByLabelText("Summary");
    const tagsInput = screen.getByLabelText("Tags (comma-separated)");

    fireEvent.change(titleInput, { target: { value: "" } });
    fireEvent.change(categoryInput, { target: { value: "" } });
    fireEvent.change(summaryInput, { target: { value: "" } });
    fireEvent.change(tagsInput, { target: { value: "" } });

    await act(async () => {
      fireEvent.click(screen.getByText("Create Override"));
    });

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Category is required")).toBeInTheDocument();
    });

    // The mutation should NOT have been called
    expect(mockCreateOverride).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────

  it("renders the back button on the success page", () => {
    mockTimelineQuery({ data: MOCK_TIMELINE_DATA });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Empty Timeline
  // ──────────────────────────────────────────

  it("renders the no-timeline fallback when items array is empty", () => {
    mockTimelineQuery({ data: { items: [], total: 0 } });

    renderWithProviders(<DocumentDetails />);

    expect(screen.getByText("No timeline items found.")).toBeInTheDocument();
  });
});
