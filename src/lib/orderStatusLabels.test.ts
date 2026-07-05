import { describe, it, expect } from "vitest";
import { getOrderStatusLabels, ORDER_STATUS_SETTING_KEY, DEFAULT_ORDER_STATUS_LABELS, ORDER_STATUS_KEYS } from "./orderStatusLabels";

describe("ORDER_STATUS_SETTING_KEY", () => {
  it("builds the settings-table key for a given status", () => {
    expect(ORDER_STATUS_SETTING_KEY("pending")).toBe("order_status_label_pending");
    expect(ORDER_STATUS_SETTING_KEY("cancelled")).toBe("order_status_label_cancelled");
  });
});

describe("getOrderStatusLabels", () => {
  it("falls back to the default booking-flow labels when settings has none", () => {
    expect(getOrderStatusLabels({})).toEqual(DEFAULT_ORDER_STATUS_LABELS);
  });

  it("overrides only the statuses actually present in settings", () => {
    const result = getOrderStatusLabels({ order_status_label_pending: "قيد المراجعة" });
    expect(result.pending).toBe("قيد المراجعة");
    expect(result.confirmed).toBe(DEFAULT_ORDER_STATUS_LABELS.confirmed);
  });

  it("returns a label for every known status key", () => {
    const result = getOrderStatusLabels({});
    for (const key of ORDER_STATUS_KEYS) {
      expect(result[key]).toBeTruthy();
    }
  });

  it("ignores an empty-string override and keeps the default", () => {
    const result = getOrderStatusLabels({ order_status_label_shipped: "" });
    expect(result.shipped).toBe(DEFAULT_ORDER_STATUS_LABELS.shipped);
  });
});
