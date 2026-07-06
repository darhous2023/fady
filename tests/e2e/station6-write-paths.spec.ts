import { existsSync, readFileSync } from "fs";
import { expect, test } from "@playwright/test";

// Station 6 write-path tests, reusing Station 4/5's shared harness. All
// writes land on the isolated test DBs only (PLAYWRIGHT_BASE_URL points at
// an app instance backed by throwaway Neon branches -- see playwright.config.ts).
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

async function getDemoProductId(page: import("@playwright/test").Page): Promise<string | null> {
  return page.evaluate(async (slug) => {
    const res = await fetch(`/api/products?limit=100`);
    const list = await res.json();
    const match = Array.isArray(list) ? list.find((p: { slug: string }) => p.slug === slug) : null;
    return match?.id ?? null;
  }, DEMO_SLUG);
}

test.describe("POST /api/orders (create booking)", () => {
  test("rejects missing required fields with 400", async ({ page }) => {
    await page.goto("/");
    const status = await page.evaluate(async () => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_name: "", phone: "" }),
      });
      return res.status;
    });
    expect(status).toBe(400);
  });

  test("creates a real booking with valid data and returns an order number", async ({ page }) => {
    await page.goto("/");
    const productId = await getDemoProductId(page);
    test.skip(!productId, "Demo product not found -- run scripts/test-env-seed-demo-product.ts first");

    const result = await page.evaluate(async (pid) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: "عميل اختبار الكتابة",
          phone: "01011223344",
          items: [{ product_id: pid, product_name: "تويوتا كورولا اختبار", quality_tier: "original", qty: 1, unit_price: 550000 }],
          subtotal: 550000,
          total: 550000,
        }),
      });
      return { status: res.status, body: await res.json() };
    }, productId);

    expect(result.status).toBe(201);
    expect(result.body.order_number).toMatch(/^FADY-/);
  });
});

test.describe("Admin order status update reflected in tracking", () => {
  test.skip(!existsSync(credsPath), "No disposable test admin found -- run scripts/test-env-seed-admin.ts first");

  test("admin updates status via PATCH, /api/orders/track shows the new status", async ({ page }) => {
    await page.goto("/");
    const productId = await getDemoProductId(page);
    test.skip(!productId, "Demo product not found -- run scripts/test-env-seed-demo-product.ts first");

    const phone = "01077665544";
    const created = await page.evaluate(async ({ pid, phone }) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: "عميل تتبّع الحالة",
          phone,
          items: [{ product_id: pid, product_name: "تويوتا كورولا اختبار", quality_tier: "original", qty: 1, unit_price: 550000 }],
          subtotal: 550000,
          total: 550000,
        }),
      });
      return res.json();
    }, { pid: productId, phone });

    await loginAsAdmin(page);

    // The order's UUID isn't in the public track response -- resolve it via
    // the admin orders list, which links each row to /admin/orders/[id].
    await page.goto("/admin/orders");
    const orderRowId = await page.evaluate((orderNumber) => {
      const link = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="/admin/orders/"]'))
        .find((a) => a.closest("tr")?.textContent?.includes(orderNumber));
      return link ? link.getAttribute("href")!.split("/").pop() : null;
    }, created.order_number);
    expect(orderRowId).toBeTruthy();

    const patchStatus = await page.evaluate(async (id) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });
      return res.status;
    }, orderRowId);
    expect(patchStatus).toBe(200);

    await page.goto("/track");
    await page.fill('input[placeholder*="01xxxxxxxxx"]', phone);
    await page.getByRole("button", { name: "تتبّع" }).click();
    await expect(page.locator("body")).toContainText("تم تأكيد الموعد");
  });
});

test.describe("GET /api/discounts/validate", () => {
  test("rejects a non-existent discount code", async ({ page }) => {
    await page.goto("/");
    const result = await page.evaluate(async () => {
      const res = await fetch("/api/discounts/validate?code=NOTAREALCODE999&total=100000");
      return { status: res.status, body: await res.json() };
    });
    expect(result.status).toBe(404);
    expect(result.body.error).toBeTruthy();
  });
});

test.describe("Review submission and admin approval", () => {
  test.skip(!existsSync(credsPath), "No disposable test admin found -- run scripts/test-env-seed-admin.ts first");

  test("a submitted review is not public until an admin approves it", async ({ page }) => {
    await page.goto("/");
    const productId = await getDemoProductId(page);
    test.skip(!productId, "Demo product not found -- run scripts/test-env-seed-demo-product.ts first");

    const submitted = await page.evaluate(async (pid) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: pid, customer_name: "مراجع اختبار Station 6", rating: 5, comment_ar: "تجربة اختبار آلي" }),
      });
      return { status: res.status, body: await res.json() };
    }, productId);
    expect(submitted.status).toBe(201);

    // Not public yet: the per-product reviews endpoint filters on is_approved.
    const visibleBefore = await page.evaluate(async ({ pid, reviewId }) => {
      const res = await fetch(`/api/reviews?product_id=${pid}`);
      const list = await res.json();
      return Array.isArray(list) && list.some((r: { id: string }) => r.id === reviewId);
    }, { pid: productId, reviewId: submitted.body.id });
    expect(visibleBefore).toBe(false);

    await loginAsAdmin(page);
    const approveStatus = await page.evaluate(async (reviewId) => {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      });
      return res.status;
    }, submitted.body.id);
    expect(approveStatus).toBe(200);

    const visibleAfter = await page.evaluate(async ({ pid, reviewId }) => {
      const res = await fetch(`/api/reviews?product_id=${pid}`);
      const list = await res.json();
      return Array.isArray(list) && list.some((r: { id: string }) => r.id === reviewId);
    }, { pid: productId, reviewId: submitted.body.id });
    expect(visibleAfter).toBe(true);
  });
});

test.describe("Unauthenticated admin API access is rejected", () => {
  test("GET /api/admin/settings without a session returns 401", async ({ page }) => {
    // Fresh, cookie-less context: navigate to a public page first (fetch needs a same-origin page context).
    await page.goto("/");
    const status = await page.evaluate(async () => (await fetch("/api/admin/settings")).status);
    expect(status).toBe(401);
  });

  test("POST /api/admin/settings without a session returns 401", async ({ page }) => {
    await page.goto("/");
    const status = await page.evaluate(async () => (await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: [{ key: "whatsapp_number", value: "hijacked" }] }),
    })).status);
    expect(status).toBe(401);
  });
});
