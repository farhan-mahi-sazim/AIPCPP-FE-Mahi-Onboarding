import { STRINGS } from "@/shared/constants/strings.constants";

export const UPLOAD_STEPS = [
  { key: "UPLOADING", label: STRINGS.upload.steps.UPLOADING },
  { key: "PENDING", label: STRINGS.upload.steps.PENDING },
  { key: "PROCESSING", label: STRINGS.upload.steps.PROCESSING },
  { key: "COMPLETED", label: STRINGS.upload.steps.COMPLETED },
];

export const POLL_INTERVAL_MS = 3000;
export const SSE_FALLBACK_TIMEOUT_MS = 15000;
