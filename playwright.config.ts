import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

if (process.env["STAGE_ENV"] === "local") {
  dotenv.config({ path: path.resolve(__dirname, ".env.test.local") });
}

export default defineConfig({
  testDir: "./e2e-tests",
  testMatch: ["**/*.e2e-spec.ts"],
  expect: { timeout: 100000 },
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: process.env["BASE_URL"] || "http://localhost:3000",
    video: "on",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
