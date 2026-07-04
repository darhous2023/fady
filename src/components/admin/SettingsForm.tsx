"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ORDER_STATUS_KEYS, ORDER_STATUS_SETTING_KEY, DEFAULT_ORDER_STATUS_LABELS } from "@/lib/orderStatusLabels";

const inputCls = "w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-4 py-2.5 text-[#F2F0EC] text-sm placeholder:text-[#F2F0EC]/20 focus:outline-none focus:border-[#9BA3AA]/60 transition-colors";
const labelCls = "block text-sm text-[#F2F0EC]/60 mb-1.5";
const STATUS_KEY_DESCRIPTIONS_AR: Record<string, string> = {
  pending: "بانتظار التأكيد (الحجز الجديد)",
  confirmed: "بعد تأكيد الموعد",
  shipped: "بعد التواصل مع العميل",
  delivered: "بعد إتمام المعاينة",
  cancelled: "عند الإلغاء",
};

function LogoField({ defaultValue }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue || "/logo-400.png");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await r.json();
    setUploading(false);
    if (!r.ok) { toast.error(data.error || "فشل الرفع"); return; }
    setUrl(data.url);
    toast.success("تم رفع الشعار");
  }

  return (
    <div>
      <label className={labelCls}>شعار الموقع (يظهر في الهيدر والفوتر ومقدمة التحميل)</label>
      <input type="hidden" name="logo_url" value={url} readOnly />
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-14 h-14 object-cover rounded-lg border border-[#9BA3AA]/20 flex-shrink-0" />
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
        <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-[#9BA3AA]/25 text-[#9BA3AA] rounded-lg hover:bg-[#9BA3AA]/10 transition-colors disabled:opacity-50">
          {uploading ? "جاري الرفع..." : "↑ رفع شعار جديد"}
        </button>
        <input type="url" placeholder="أو ألصق رابط صورة" value={url} onChange={e => setUrl(e.target.value)} className={inputCls + " flex-1"} />
      </div>
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const textKeys = [
      "whatsapp_number", "store_name_ar", "store_tagline_ar", "instagram_url", "facebook_url", "tiktok_url",
      "logo_url", "intro_tagline_ar", "announcement_text", "flash_deals_title_ar", "flash_deals_ends_at",
      ...ORDER_STATUS_KEYS.map(ORDER_STATUS_SETTING_KEY),
    ];
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">الشعار ومقدمة التحميل</h2>

        <LogoField defaultValue={settings.logo_url} />

        <div>
          <label className={labelCls}>الشعار التعريفي (يظهر تحت اسم ELFADY في الهيدر، الفوتر، شاشة الدخول، ومقدمة التحميل — في كل الموقع)</label>
          <input name="intro_tagline_ar" defaultValue={settings.intro_tagline_ar || "حيث تلتقي الفخامة بالثقة"} className={inputCls} />
        </div>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">معلومات المتجر</h2>

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

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">روابط السوشيال</h2>
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

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">الإعلان العلوي</h2>
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
            className="w-4 h-4 accent-[#9BA3AA]"
          />
          <label htmlFor="announcement_active" className="text-sm text-[#F2F0EC]/60 cursor-pointer">تفعيل الإعلان العلوي</label>
        </div>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">مسمّيات مراحل الحجز</h2>
        <p className="text-xs text-[#F2F0EC]/30">
          النصوص اللي تظهر للعميل في صفحة تتبّع الحجز، ولصاحب المعرض في تفاصيل الحجز — بدون تغيير في منطق الحالات نفسه.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ORDER_STATUS_KEYS.map(key => (
            <div key={key}>
              <label className={labelCls}>مرحلة: {STATUS_KEY_DESCRIPTIONS_AR[key]}</label>
              <input
                name={ORDER_STATUS_SETTING_KEY(key)}
                defaultValue={settings[ORDER_STATUS_SETTING_KEY(key)] || DEFAULT_ORDER_STATUS_LABELS[key]}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
        <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3 flex items-center gap-2">
          ⚡ عروض الفلاش
        </h2>
        <p className="text-xs text-[#F2F0EC]/30">
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
            <p className="text-xs text-[#F2F0EC]/30 mt-1">اتركيه فارغاً لعرض العروض بدون عداد</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="flash_deals_active"
            id="flash_deals_active"
            defaultChecked={settings.flash_deals_active === "true"}
            className="w-4 h-4 accent-[#9BA3AA]"
          />
          <label htmlFor="flash_deals_active" className="text-sm text-[#F2F0EC]/60 cursor-pointer">تفعيل قسم عروض الفلاش</label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#9BA3AA] hover:bg-[#7d858c] disabled:opacity-50 text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors"
        >
          {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </form>
  );
}
