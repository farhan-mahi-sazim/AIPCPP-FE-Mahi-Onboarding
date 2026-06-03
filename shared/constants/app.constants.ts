export const APP_NAME = "AIPCPP";

export const NOTIFICATION_AUTO_CLOSE_TIMEOUT_IN_MILLISECONDS = 5000;

export const DATE_AND_TIME_FORMAT = "D MMM, YYYY [at] h:mma";

export const FILE_TYPES = {
  PDF: "PDF",
  IMAGE: "IMAGE",
  TEXT: "TEXT",
  DOCX: "DOCX",
  DOC: "DOC",
} as const;

export const FILE_TYPE_OPTIONS = Object.values(FILE_TYPES);
