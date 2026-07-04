export const ORDER_STATUS_KEYS = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatusKey = (typeof ORDER_STATUS_KEYS)[number];

export const DEFAULT_ORDER_STATUS_LABELS: Record<OrderStatusKey, string> = {
  pending: "تم استلام الطلب",
  confirmed: "تم تأكيد الموعد",
  shipped: "تم التواصل",
  delivered: "تمت المعاينة",
  cancelled: "ملغي",
};

export const ORDER_STATUS_SETTING_KEY = (key: OrderStatusKey) => `order_status_label_${key}`;

export function getOrderStatusLabels(settingsMap: Record<string, string>): Record<OrderStatusKey, string> {
  const labels = { ...DEFAULT_ORDER_STATUS_LABELS };
  for (const key of ORDER_STATUS_KEYS) {
    const value = settingsMap[ORDER_STATUS_SETTING_KEY(key)];
    if (value) labels[key] = value;
  }
  return labels;
}
