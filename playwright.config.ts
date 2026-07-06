import { defineConfig, devices } from "@playwright/test";

// Shared Playwright harness (Station 4 of the "9/10 -> 10/10" plan).
// PLAYWRIGHT_BASE_URL must point at an isolated app instance backed by
// isolated test databases only -- never the real DATABASE_URL/CARS_DATABASE_URL.
// See .github/workflows/e2e-smoke.yml and docs/TESTING_AND_VERIFICATION.md
// for how the isolated instance is built in CI.
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
