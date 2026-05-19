import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MantineProvider } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import {
  useUploadDocumentMutation,
  useGetJobStatusQuery,
} from "@/shared/redux/rtk-apis/documents.api";
import UploadSection from "../UploadSection";
import { STRINGS } from "@/shared/constants/strings.constants";

// Mock the API hooks
jest.mock("@/shared/redux/rtk-apis/documents.api", () => ({
  useUploadDocumentMutation: jest.fn(),
  useGetJobStatusQuery: jest.fn(),
}));

// Mock notifications
jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
  },
}));

const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe("UploadSection", () => {
  const mockUploadDocument = jest.fn();
  const mockUnwrap = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUploadDocument.mockReturnValue({ unwrap: mockUnwrap });
    (useUploadDocumentMutation as jest.Mock).mockReturnValue([
      mockUploadDocument,
      { isLoading: false, error: null },
    ]);

    (useGetJobStatusQuery as jest.Mock).mockReturnValue({
      data: null,
    });
  });

  it("renders correctly", () => {
    renderWithMantine(<UploadSection />);
    expect(screen.getByText(STRINGS.upload.title)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.upload.dragDrop)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.upload.trackerTitle)).toBeInTheDocument();
  });

  it("calls upload API when a file is selected via input", async () => {
    mockUnwrap.mockResolvedValue({ job: { id: "job-123" } });

    renderWithMantine(<UploadSection />);

    // Create a mock file
    const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });

    // Find the hidden file input
    const fileInput = document.querySelector("#file-input") as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadDocument).toHaveBeenCalledWith(file);
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: STRINGS.upload.started,
        }),
      );
    });
  });

  it("calls upload API when a file is dropped", async () => {
    mockUnwrap.mockResolvedValue({ job: { id: "job-123" } });

    renderWithMantine(<UploadSection />);

    const file = new File(["dummy content"], "test.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Find the dropzone
    const dropzone = screen.getByText(STRINGS.upload.dragDrop).closest("div");

    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockUploadDocument).toHaveBeenCalledWith(file);
    });
  });

  it("updates pipeline tracker when job status changes", () => {
    (useGetJobStatusQuery as jest.Mock).mockReturnValue({
      data: { status: "EXTRACTING" },
    });

    renderWithMantine(<UploadSection />);

    // The EXTRACTING status should be shown next to the title as well as in the pipeline
    const extractingElements = screen.getAllByText("EXTRACTING");
    expect(extractingElements.length).toBeGreaterThan(0);
  });

  it("shows success notification and calls onUploadSuccess when COMPLETED", async () => {
    const onUploadSuccessMock = jest.fn();

    (useGetJobStatusQuery as jest.Mock).mockReturnValue({
      data: { status: "COMPLETED" },
    });

    renderWithMantine(<UploadSection onUploadSuccess={onUploadSuccessMock} />);

    await waitFor(() => {
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: STRINGS.upload.success,
        }),
      );
      expect(onUploadSuccessMock).toHaveBeenCalled();
    });
  });

  it("shows error notification when FAILED", async () => {
    (useGetJobStatusQuery as jest.Mock).mockReturnValue({
      data: { status: "FAILED" },
    });

    renderWithMantine(<UploadSection />);

    await waitFor(() => {
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: STRINGS.upload.procFailed,
          color: "red",
        }),
      );
    });
  });
});
