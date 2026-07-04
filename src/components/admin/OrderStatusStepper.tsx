"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { OrderStatusKey } from "@/lib/orderStatusLabels";

const STEP_KEYS: OrderStatusKey[] = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderStatusStepper({
  orderId,
  currentStatus,
  labels,
}: {
  orderId: string;
  currentStatus: string;
  labels: Record<OrderStatusKey, string>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isCancelled = currentStatus === "cancelled";
  const currentIdx = STEP_KEYS.indexOf(currentStatus as OrderStatusKey);
  const nextKey = currentIdx >= 0 && currentIdx < STEP_KEYS.length - 1 ? STEP_KEYS[currentIdx + 1] : null;

  async function setStatus(status: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    if (res.ok) { toast.success("تم تحديث الحالة"); router.refresh(); }
    else toast.error("فشل التحديث");
  }

  return (
    <div>
      <div className="flex items-center gap-1 flex-wrap">
        {STEP_KEYS.map((key, i) => {
          const done = !isCancelled && i <= currentIdx;
          const active = !isCancelled && i === currentIdx;
          return (
            <div key={key} className="flex items-center gap-1">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                active ? "bg-[#9BA3AA] text-[#0A0A0A] border-[#9BA3AA]"
                : done ? "bg-[#9BA3AA]/15 text-[#9BA3AA] border-[#9BA3AA]/30"
                : "bg-transparent text-[#F2F0EC]/30 border-[#9BA3AA]/10"
              }`}>
                <span>{done ? "✓" : i + 1}</span>
                <span>{labels[key]}</span>
              </div>
              {i < STEP_KEYS.length - 1 && (
                <div className={`w-4 h-0.5 ${done ? "bg-[#9BA3AA]/40" : "bg-[#9BA3AA]/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      {isCancelled ? (
        <p className="text-xs text-red-400 font-medium mt-3">❌ {labels.cancelled}</p>
      ) : (
        <div className="flex gap-2 mt-4">
          {nextKey && (
            <button onClick={() => setStatus(nextKey)} disabled={loading}
              className="text-xs px-4 py-2 rounded-lg bg-[#9BA3AA] hover:bg-[#7d858c] text-[#0A0A0A] font-bold disabled:opacity-50 transition-colors">
              {loading ? "..." : `المرحلة التالية: ${labels[nextKey]} ←`}
            </button>
          )}
          <button onClick={() => setStatus("cancelled")} disabled={loading}
            className="text-xs px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors">
            إلغاء الحجز
          </button>
        </div>
      )}
    </div>
  );
}
