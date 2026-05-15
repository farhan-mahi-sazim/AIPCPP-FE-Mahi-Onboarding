import { S3_CDN_BASE_URL } from "../env.constants";

export const constructFullUrl = (pathname?: string | null): string => {
  if (!S3_CDN_BASE_URL) {
    throw new Error("Base URL is not defined");
  }

  return pathname ? new URL(pathname, S3_CDN_BASE_URL).toString() : "";
};
