import { TApiErrorResponse } from "@/shared/index.types";
const DEFAULT_ERROR = "Something went wrong";

export function parseApiErrorMessage(err: unknown) {
  if (!isApiErrorMessage(err)) {
    return DEFAULT_ERROR;
  }

  let errorMessage = "";
  if (Array.isArray(err?.data?.message)) {
    errorMessage = err.data.message.join(", ");
  } else {
    errorMessage = err?.data?.message || "Please try again later";
  }

  return errorMessage;
}

export function getApiErrorStatusCode(err: unknown) {
  if (!isApiErrorMessage(err)) return 500;

  return err.status;
}

export function isApiErrorMessage(err: unknown): err is TApiErrorResponse {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "data" in err &&
    typeof err.data === "object" &&
    err.data !== null &&
    "statusCode" in err.data
  );
}

export function parseRTKErrorMessage(err: unknown): string {
  if (!err) return "";

  if (isApiErrorMessage(err)) {
    return parseApiErrorMessage(err);
  }

  if (typeof err !== "object" || err === null) {
    return DEFAULT_ERROR;
  }

  const record = err as Record<string, unknown>;

  if (typeof record["status"] === "number") {
    const data = record["data"];
    if (typeof data === "object" && data !== null) {
      const dataRecord = data as Record<string, unknown>;
      if (typeof dataRecord["message"] === "string") return dataRecord["message"];
      if (typeof dataRecord["error"] === "string") return dataRecord["error"];
    }
    return `Server error (${record["status"]})`;
  }

  if (typeof record["status"] === "string" && typeof record["error"] === "string") {
    return record["error"];
  }

  if (typeof record["message"] === "string") {
    return record["message"];
  }

  return DEFAULT_ERROR;
}
