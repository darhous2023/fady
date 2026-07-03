"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const textKeys = ["whatsapp_number", "store_name_ar", "store_tagline_ar", "instagram_url", "facebook_url", "tiktok_url", "hero_words", "announcement_text", "flash_deals_title_ar", "flash_deals_ends_at"];
    const updates = [
      ...textKeys.map((key) => ({ key, value: (form.elements.namedItem(key) as HTMLInputElement)?.value || "" })),
      { key: "announcement_active", value: (form.elements.namedItem("announcement_active") as HTMLInputElement)?.checked ? "true" : "false" },
      { key: "flash_deals_active", value: (form.elements.namedItem("flash_deals_active") as HTMLInputElement)?.checked ? "true" : "false" },
    ];

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: updates }),
    });
    setLoading(false);
    if (res.ok) toast.success("تم حفظ الإعدادات");
    else toast.error("فشل الحفظ");
  }

  const inputCls = "w-full bg-[#1A1310] border border-[#C9A84C]/20 rounded-lg px-4 py-2.5 text-[#F5EFE0] text-sm placeholder:text-[#F5EFE0]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors";
  const labelCls = "block text-sm text-[#F5EFE0]/60 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F5EFE0] border-b border-[#C9A84C]/10 pb-3">معلومات المتجر</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>اسم المتجر</label>
            <input name="store_name_ar" defaultValue={settings.store_name_ar || "الفادي"} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>رقم الواتساب</label>
            <input name="whatsapp_number" defaultValue={settings.whatsapp_number || "+201555557745"} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>الشعار الفرعي</label>
          <input name="store_tagline_ar" defaultValue={settings.store_tagline_ar} className={inputCls} />
        </div>
      </div>

      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F5EFE0] border-b border-[#C9A84C]/10 pb-3">روابط السوشيال</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>إنستاجرام</label>
            <input name="instagram_url" defaultValue={settings.instagram_url} placeholder="https://instagram.com/..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>فيسبوك</label>
            <input name="facebook_url" defaultValue={settings.facebook_url} placeholder="https://facebook.com/..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>تيك توك</label>
            <input name="tiktok_url" defaultValue={settings.tiktok_url} placeholder="https://tiktok.com/@..." className={inputCls} />
          </div>
        </div>
      </div>

      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F5EFE0] border-b border-[#C9A84C]/10 pb-3">صفحة البداية</h2>
        <div>
          <label className={labelCls}>كلمات الهيرو (مفصولة بفواصل)</label>
          <textarea
            name="hero_words"
            defaultValue={settings.hero_words || "شُعوراً, هويّتكِ, قوّتكِ, أُسلوباً, تميّزكِ"}
            rows={2}
            className={inputCls}
            style={{ resize: "vertical", lineHeight: 1.6 }}
            placeholder="شُعوراً, هويّتكِ, قوّتكِ"
          />
          <p className="text-xs text-[#F5EFE0]/30 mt-1">اكتبي الكلمات مفصولة بفواصل — ستظهر متعاقبة في الصفحة الرئيسية</p>
        </div>
        <div>
          <label className={labelCls}>نص الإعلان العلوي (اتركيه فارغاً لإخفائه)</label>
          <input
            name="announcement_text"
            defaultValue={settings.announcement_text || ""}
            className={inputCls}
            placeholder="مثال: شحن مجاني على جميع الطلبات اليوم!"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="announcement_active"
            id="announcement_active"
            defaultChecked={settings.announcement_active === "true"}
            className="w-4 h-4 accent-[#C9A84C]"
          />
          <label htmlFor="announcement_active" className="text-sm text-[#F5EFE0]/60 cursor-pointer">تفعيل الإعلان العلوي</label>
        </div>
      </div>

      {/* Flash Deals */}
      <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F5EFE0] border-b border-[#C9A84C]/10 pb-3 flex items-center gap-2">
          ⚡ عروض الفلاش
        </h2>
        <p className="text-xs text-[#F5EFE0]/30">
          يتم عرض المنتجات المميّزة (Featured) التي لديها سعر مخفّض تلقائياً في قسم عروض الفلاش.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>عنوان القسم</label>
            <input name="flash_deals_title_ar" defaultValue={settings.flash_deals_title_ar || "عروض الفلاش"} className={inputCls} placeholder="عروض الفلاش" />
          </div>
          <div>
            <label className={labelCls}>تاريخ ووقت الانتهاء</label>
            <input
              type="datetime-local"
              name="flash_deals_ends_at"
              defaultValue={settings.flash_deals_ends_at ? settings.flash_deals_ends_at.slice(0, 16) : ""}
              className={inputCls}
              style={{ colorScheme: "dark" }}
            />
            <p className="text-xs text-[#F5EFE0]/30 mt-1">اتركيه فارغاً لعرض العروض بدون عداد</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="flash_deals_active"
            id="flash_deals_active"
            defaultChecked={settings.flash_deals_active === "true"}
            className="w-4 h-4 accent-[#C9A84C]"
          />
          <label htmlFor="flash_deals_active" className="text-sm text-[#F5EFE0]/60 cursor-pointer">تفعيل قسم عروض الفلاش</label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#B89440] disabled:opacity-50 text-[#0A0806] font-bold text-sm rounded-lg transition-colors"
        >
          {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </form>
  );
}
