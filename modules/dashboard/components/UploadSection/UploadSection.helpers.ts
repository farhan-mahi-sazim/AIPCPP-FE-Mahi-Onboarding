import { TUploadStage } from "./UploadSection.types";

export function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function formatStageLabel(value: string | undefined): string {
  if (!value) return "processing";
  return value.toLowerCase().replace(/_/g, " ");
}

export function mapBackendStageToUI(
  rawStage: string | undefined,
  progress: number,
): { uiStage: TUploadStage; stepIndex: number } {
  const stage = (rawStage ?? "").toLowerCase();
  if (stage === "failed") return { uiStage: "failed", stepIndex: -1 };
  if (stage === "completed" || progress >= 100) return { uiStage: "completed", stepIndex: 3 };
  if (stage === "uploading") return { uiStage: "uploading", stepIndex: 0 };
  if (stage === "pending" || stage === "queued") return { uiStage: "pending", stepIndex: 1 };
  if (
    stage === "extraction" ||
    stage === "ai_task" ||
    stage === "embedding" ||
    stage === "persistence" ||
    stage === "processing"
  ) {
    return { uiStage: "processing", stepIndex: 2 };
  }
  if (progress > 0) return { uiStage: "processing", stepIndex: 2 };
  return { uiStage: "pending", stepIndex: 1 };
}
