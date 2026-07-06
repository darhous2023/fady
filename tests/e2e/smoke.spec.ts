import { existsSync, readFileSync } from "fs";
import { expect, test } from "@playwright/test";

// Station 4 smoke test: proves the shared harness works end-to-end against
// an isolated app instance (isolated store DB + isolated cars-catalog DB).
// Full functional/write-path suite is built in Station 6 -- this test only
// proves the isolation + login flow are real.

test("home page renders from the isolated store DB", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText("ELFADY");
});

test("admin can log in through the real form on the isolated test env", async ({ page }) => {
  const credsPath = ".e2e-test-admin.local.json";
  test.skip(!existsSync(credsPath), "No disposable test admin found -- run scripts/test-env-seed-admin.ts first");

  const { email, password } = JSON.parse(readFileSync(credsPath, "utf8"));

  await page.goto("/admin/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL("**/admin/dashboard");
  await expect(page.locator("h1")).toContainText("الداشبورد");
});
