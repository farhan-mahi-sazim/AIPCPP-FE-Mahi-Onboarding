import { STRINGS } from "@/shared/constants/strings.constants";

export const UPLOAD_STEPS = [
  { key: "UPLOADING", label: STRINGS.upload.steps.UPLOADING },
  { key: "PENDING", label: STRINGS.upload.steps.PENDING },
  { key: "PROCESSING", label: STRINGS.upload.steps.PROCESSING },
  { key: "COMPLETED", label: STRINGS.upload.steps.COMPLETED },
];

export const MAX_SSE_RETRIES = 4;
export const INITIAL_RETRY_MS = 1000;
export const MAX_RETRY_MS = 8000;
export const POLL_INTERVAL_MS = 3000;
