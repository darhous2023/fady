import { existsSync, readFileSync } from "fs";
import { expect, test } from "@playwright/test";

// Station 6 critical-journey E2E tests, reusing Station 4/5's shared
// harness (isolated store DB + isolated cars-catalog DB, no new
// infrastructure). Requires scripts/test-env-seed-demo-product.ts to have
// run first (adds one demo active product for the booking/tracking/admin
// journeys) -- these tests skip gracefully if it hasn't.
const DEMO_SLUG = "e2e-test-corolla-2020";
const credsPath = ".e2e-test-admin.local.json";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  const { email, password } = JSON.parse(readFileSync(credsPath, "utf8"));
  await page.goto("/admin/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard");
}

test.describe("Home page", () => {
  test("renders and links to both gateways", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toContainText("ELFADY");
    await expect(page.locator('a[href="/new"]').first()).toHaveCount(1);
    await expect(page.locator('a[href="/used"]').first()).toHaveCount(1);
  });
});

test.describe.serial("Used-car browse -> detail -> full booking -> phone tracking", () => {
  test.skip(!existsSync(credsPath), "No disposable test admin/demo product found -- run the test-env-seed-* scripts first");

  const phone = "01099887766";
  let orderNumber = "";

  test("browse /used and open the demo car's detail page", async ({ page }) => {
    await page.goto("/used");
    const link = page.locator(`a[href="/products/${DEMO_SLUG}"]`).first();
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForURL(`**/products/${DEMO_SLUG}`);
    await expect(page.locator("body")).toContainText("تويوتا كورولا");
  });

  test("book a viewing end-to-end and land on the confirmation page", async ({ page }) => {
    await page.goto(`/products/${DEMO_SLUG}`);
    await page.getByRole("button", { name: "احجز معاينة" }).click();
    await page.goto("/checkout");
    await page.fill('input[placeholder="مثال: أحمد محمد"]', "عميل اختبار Station 6");
    await page.fill('input[placeholder="01XXXXXXXXX"]', phone);
    await page.getByRole("button", { name: /إرسال طلب الحجز/ }).click();
    await page.waitForURL("**/order-confirmed**");
    const url = new URL(page.url());
    orderNumber = url.searchParams.get("order") ?? "";
    expect(orderNumber).toMatch(/^FADY-/);
  });

  test("track the booking by phone number on /track", async ({ page }) => {
    test.skip(!orderNumber, "Booking step did not produce an order number");
    await page.goto("/track");
    await page.fill('input[placeholder*="01xxxxxxxxx"]', phone);
    await page.getByRole("button", { name: "تتبّع" }).click();
    await expect(page.locator("body")).toContainText(orderNumber);
  });
});

test.describe("New-car search -> detail", () => {
  test("searching a common brand returns real catalog results that link to a detail page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/new/search?q=Toyota");
    // `waitForLoadState("networkidle")` is not used deliberately -- Next.js's
    // background <Link> prefetching on a results grid keeps the network
    // non-idle indefinitely, hanging this call for the full test timeout
    // (found while building this test). Wait for the specific outcome
    // instead: either a real result link or the "no results" copy.
    const firstCarLink = page.locator('a[href^="/new/car/"]').first();
    const noResultsText = page.getByText("لا توجد نتائج");
    await expect(firstCarLink.or(noResultsText)).toBeVisible();
    const noResults = await noResultsText.count();
    test.skip(noResults > 0, "Isolated cars-catalog branch has no Toyota-matching rows");
    await firstCarLink.click();
    await page.waitForURL("**/new/car/**");
    expect(errors, `console/page errors: ${errors.join(", ")}`).toEqual([]);
  });
});

test.describe("New-car favorites", () => {
  test("adding a car to favorites via localStorage shows it on /new/favorites", async ({ page }) => {
    // Reads the car link from a real rendered page via a locator (auto-
    // waiting) rather than an in-page fetch()+regex, which proved flaky
    // under a long single-worker Playwright session (Station 6 finding --
    // see STATION_6_REPORT.md).
    await page.goto("/new/browse");
    const firstLink = page.locator('a[href^="/new/car/"]').first();
    await expect(firstLink).toBeVisible();
    const href = await firstLink.getAttribute("href");
    const carHref = href ? decodeURIComponent(href.replace(/^\/new\/car\//, "")) : null;
    test.skip(!carHref, "No car link found in the isolated test catalog");
    await page.evaluate((key) => {
      window.localStorage.setItem("elfady_new_cars_favorites", JSON.stringify([key]));
    }, carHref);
    await page.goto("/new/favorites");
    await expect(page.getByText("لا توجد سيارات في المفضلة بعد")).toHaveCount(0);
    await expect(page.locator('a[href^="/new/car/"]').first()).toBeVisible();
  });
});

test.describe("Admin edit reflects live on the public site", () => {
  test.skip(!existsSync(credsPath), "No disposable test admin found -- run scripts/test-env-seed-admin.ts first");

  test("changing the demo product's price via admin API shows the new price on /products/[slug]", async ({ page }) => {
    await loginAsAdmin(page);
    const productId = await page.evaluate(async (slug) => {
      const res = await fetch(`/api/products?limit=100`);
      const list = await res.json();
      const match = Array.isArray(list) ? list.find((p: { slug: string }) => p.slug === slug) : null;
      return match?.id ?? null;
    }, DEMO_SLUG);
    test.skip(!productId, "Demo product not found via /api/products -- run scripts/test-env-seed-demo-product.ts first");

    const newPrice = "612345";
    const patchStatus = await page.evaluate(async ({ id, price }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      return res.status;
    }, { id: productId, price: newPrice });
    expect(patchStatus).toBe(200);

    await page.goto(`/products/${DEMO_SLUG}`);
    const expectedFormatted = await page.evaluate((p) => Number(p).toLocaleString("ar-EG"), newPrice);
    await expect(page.locator("body")).toContainText(expectedFormatted);

    // Restore the original seeded price so this test is repeatable against
    // a long-lived branch (no-op against a throwaway CI branch anyway).
    await page.evaluate(async (id) => {
      await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: "550000" }),
      });
    }, productId);
  });
});

test.describe("Admin settings change reflects in the footer", () => {
  test.skip(!existsSync(credsPath), "No disposable test admin found -- run scripts/test-env-seed-admin.ts first");

  test("changing whatsapp_number via admin settings updates the footer WhatsApp link", async ({ page }) => {
    await loginAsAdmin(page);
    const newNumber = "+201234567890";
    const postStatus = await page.evaluate(async (value) => {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: [{ key: "whatsapp_number", value }] }),
      });
      return res.status;
    }, newNumber);
    expect(postStatus).toBe(200);

    await page.goto("/");
    // StoreFooter fetches /api/store-config client-side and rebuilds its
    // wa.me link from the fresh number -- wait for it to settle.
    await expect(page.locator('a[href*="wa.me/201234567890"]').first()).toBeVisible({ timeout: 10000 });

    // Restore the original number so this test is repeatable against a
    // long-lived branch (harmless no-op against a throwaway CI branch that
    // gets deleted right after anyway).
    await page.evaluate(async () => {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: [{ key: "whatsapp_number", value: "+201555557745" }] }),
      });
    });
  });
});
