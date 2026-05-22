import React from "react";

import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";

import { STRINGS } from "@/shared/constants/strings.constants";
import { renderWithProviders } from "@/shared/utils/test-utils";

import UploadSection from "../UploadSection";

// Mock notifications
jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
  },
}));

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("UploadSection", () => {
  it("renders correctly", () => {
    renderWithProviders(<UploadSection />);
    expect(screen.getByText(STRINGS.upload.title)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.upload.dragDrop)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.upload.trackerTitle)).toBeInTheDocument();
  });

  it("renders all pipeline steps", () => {
    renderWithProviders(<UploadSection />);
    expect(screen.getByText(STRINGS.upload.steps.UPLOADING)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.upload.steps.PENDING)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.upload.steps.PROCESSING)).toBeInTheDocument();
    expect(screen.getByText(STRINGS.upload.steps.COMPLETED)).toBeInTheDocument();
  });

  it("renders file input", () => {
    renderWithProviders(<UploadSection />);
    expect(document.querySelector("#file-input")).toBeTruthy();
  });
});
