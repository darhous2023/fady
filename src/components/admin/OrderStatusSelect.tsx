"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DEFAULT_ORDER_STATUS_LABELS, ORDER_STATUS_KEYS, type OrderStatusKey } from "@/lib/orderStatusLabels";

const STATUS_COLORS: Record<OrderStatusKey, string> = {
  pending: "text-yellow-400",
  confirmed: "text-blue-400",
  shipped: "text-purple-400",
  delivered: "text-green-400",
  cancelled: "text-red-400",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<Record<OrderStatusKey, string>>(DEFAULT_ORDER_STATUS_LABELS);

  useEffect(() => {
    fetch("/api/order-status-labels").then(r => r.json()).then(setLabels).catch(() => {});
  }, []);

  const STATUS_OPTIONS = ORDER_STATUS_KEYS.map(value => ({ value, label: labels[value], color: STATUS_COLORS[value] }));

  async function handleChange(newStatus: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    if (res.ok) {
      setStatus(newStatus);
      toast.success("تم تحديث الحالة");
    } else {
      toast.error("فشل التحديث");
    }
  }

  const opt = STATUS_OPTIONS.find((o) => o.value === status);

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className={`bg-transparent border border-[#9BA3AA]/20 rounded px-2 py-1 text-xs focus:outline-none ${opt?.color || "text-[#F2F0EC]"}`}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0A0A0A] text-[#F2F0EC]">
          {o.label}
        </option>
      ))}
    </select>
  );
}
