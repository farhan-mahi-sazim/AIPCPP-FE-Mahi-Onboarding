import { env } from "next-runtime-env";

export const NODE_ENV = env("NODE_ENV");
export const STAGE_ENV = env("NEXT_PUBLIC_STAGE_ENV") as
  | "production"
  | "development"
  | "local";

export const API_BASE_URL = env("NEXT_PUBLIC_API_BASE_URL");
export const S3_CDN_BASE_URL = env("NEXT_PUBLIC_S3_CDN_BASE_URL");
export const ENV_STAGE = env("NEXT_PUBLIC_ENV_STAGE") as
  | "production"
  | "development"
  | "local";
export const BASE_URL = env("BASE_URL");
