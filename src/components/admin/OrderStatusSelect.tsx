"use client";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "pending", label: "بانتظار التأكيد", color: "text-yellow-400" },
  { value: "confirmed", label: "تم تأكيد الموعد", color: "text-blue-400" },
  { value: "shipped", label: "تم التواصل", color: "text-purple-400" },
  { value: "delivered", label: "تمت المعاينة", color: "text-green-400" },
  { value: "cancelled", label: "ملغي", color: "text-red-400" },
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

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
      className={`bg-transparent border border-[#C9A84C]/20 rounded px-2 py-1 text-xs focus:outline-none ${opt?.color || "text-[#F5EFE0]"}`}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0A0806] text-[#F5EFE0]">
          {o.label}
        </option>
      ))}
    </select>
  );
}
