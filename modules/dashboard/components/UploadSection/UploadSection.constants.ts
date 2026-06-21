import { STRINGS } from "@/shared/constants/strings.constants";

export const UPLOAD_STEPS = [
  { key: "UPLOADING", label: STRINGS.upload.steps.UPLOADING },
  { key: "EXTRACTION", label: STRINGS.upload.steps.EXTRACTION },
  { key: "AI_TASK", label: STRINGS.upload.steps.AI_TASK },
  { key: "EMBEDDING", label: STRINGS.upload.steps.EMBEDDING },
  { key: "PERSISTENCE", label: STRINGS.upload.steps.PERSISTENCE },
  { key: "COMPLETED", label: STRINGS.upload.steps.COMPLETED },
];

export const POLL_INTERVAL_MS = 3000;
export const SSE_FALLBACK_TIMEOUT_MS = 15000;
