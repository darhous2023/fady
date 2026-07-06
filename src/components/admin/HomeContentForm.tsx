"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";

const inputCls = "w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-4 py-2.5 text-[#F2F0EC] text-sm placeholder:text-[#F2F0EC]/20 focus:outline-none focus:border-[#9BA3AA]/60 transition-colors";
const labelCls = "block text-sm text-[#F2F0EC]/60 mb-1.5";
const sectionCls = "bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5";
const h2Cls = "font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3";

function ImageField({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue || "");
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
    toast.success("تم رفع الصورة");
  }

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type="hidden" name={name} value={url} readOnly />
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#9BA3AA]/20 flex-shrink-0" />
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }} />
        <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-[#9BA3AA]/25 text-[#9BA3AA] rounded-lg hover:bg-[#9BA3AA]/10 transition-colors disabled:opacity-50">
          {uploading ? "جاري الرفع..." : "↑ رفع صورة"}
        </button>
        <input type="url" placeholder="أو ألصق رابط صورة" value={url} onChange={e => setUrl(e.target.value)} className={inputCls + " flex-1"} />
      </div>
    </div>
  );
}

export default function HomeContentForm({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const keys = [
      "hero_video_url", "hero_eyebrow_ar", "hero_headline_ar", "hero_subheadline_ar",
      "gateway_new_title_ar", "gateway_new_desc_ar", "gateway_new_image",
      "gateway_used_title_ar", "gateway_used_desc_ar", "gateway_used_image",
      "marquee_text_ar", "statement_headline_ar", "financing_marquee_title_ar",
      "trust_pillar_1_title_ar", "trust_pillar_1_desc_ar",
      "trust_pillar_2_title_ar", "trust_pillar_2_desc_ar",
      "trust_pillar_3_title_ar", "trust_pillar_3_desc_ar",
      "how_it_works_1_title_ar", "how_it_works_1_desc_ar",
      "how_it_works_2_title_ar", "how_it_works_2_desc_ar",
      "how_it_works_3_title_ar", "how_it_works_3_desc_ar",
      "showroom_video_url", "showroom_headline_ar", "showroom_desc_ar",
      "used_hero_video_url", "used_hero_eyebrow_ar", "used_hero_headline_ar", "used_hero_subheadline_ar",
      "used_section_eyebrow_ar", "used_section_title_ar", "used_section_subtitle_ar",
      "new_hero_video_url", "new_hero_eyebrow_ar", "new_hero_headline_ar", "new_hero_subheadline_ar",
    ];
    const updates = keys.map((key) => ({
      key,
      value: (form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | null)?.value || "",
    }));

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: updates }),
    });
    setLoading(false);
    if (res.ok) toast.success("تم حفظ محتوى الصفحة الرئيسية");
    else toast.error("فشل الحفظ");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={sectionCls}>
        <h2 className={h2Cls}>الهيرو (أول ما يشوفه الزائر)</h2>
        <div>
          <label className={labelCls}>رابط فيديو الخلفية (MP4)</label>
          <input name="hero_video_url" defaultValue={settings.hero_video_url} placeholder="https://.../video.mp4" className={inputCls} />
          <p className="text-xs text-[#F2F0EC]/25 mt-1">اتركه فارغًا لعرض صورة ثابتة بدلًا من الفيديو</p>
        </div>
        <div>
          <label className={labelCls}>الشعار العلوي الصغير</label>
          <input name="hero_eyebrow_ar" defaultValue={settings.hero_eyebrow_ar || "معرض سيارات موثوق"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>العنوان الكبير</label>
          <input name="hero_headline_ar" defaultValue={settings.hero_headline_ar || "الفادي"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الجملة الفرعية</label>
          <textarea name="hero_subheadline_ar" rows={2} defaultValue={settings.hero_subheadline_ar || "سيارات جديدة ومستعملة، بثقة وشفافية، وتواصل فوري"} className={inputCls} />
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>البوابتين</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs text-[#9BA3AA] font-bold uppercase tracking-widest">بوابة السيارات الجديدة</p>
            <input name="gateway_new_title_ar" defaultValue={settings.gateway_new_title_ar || "سيارات جديدة"} placeholder="العنوان" className={inputCls} />
            <textarea name="gateway_new_desc_ar" rows={2} defaultValue={settings.gateway_new_desc_ar || "تصفّح كل الماركات والموديلات واسأل عن التوفر"} placeholder="الوصف" className={inputCls} />
            <ImageField label="صورة الخلفية" name="gateway_new_image" defaultValue={settings.gateway_new_image} />
          </div>
          <div className="space-y-3">
            <p className="text-xs text-[#9BA3AA] font-bold uppercase tracking-widest">بوابة السيارات المستعملة</p>
            <input name="gateway_used_title_ar" defaultValue={settings.gateway_used_title_ar || "سيارات مستعملة"} placeholder="العنوان" className={inputCls} />
            <textarea name="gateway_used_desc_ar" rows={2} defaultValue={settings.gateway_used_desc_ar || "سيارات متاحة فعليًا في المعرض بحالة مفحوصة"} placeholder="الوصف" className={inputCls} />
            <ImageField label="صورة الخلفية" name="gateway_used_image" defaultValue={settings.gateway_used_image} />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>الشريط المتحرك والعنوان الفاصل</h2>
        <div>
          <label className={labelCls}>نص الشريط المتحرك</label>
          <input name="marquee_text_ar" defaultValue={settings.marquee_text_ar || "سيارات جديدة · سيارات مستعملة · فحص شامل · تواصل فوري"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>عنوان الفاصل الكبير</label>
          <input name="statement_headline_ar" defaultValue={settings.statement_headline_ar || "ثقة تُبنى بالتفاصيل"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>عنوان شريط التمويل والتقسيط</label>
          <input name="financing_marquee_title_ar" defaultValue={settings.financing_marquee_title_ar || "التمويل والتقسيط"} className={inputCls} />
          <p className="text-xs text-[#F2F0EC]/25 mt-1">العروض نفسها تُدار من صفحة «التمويل والتقسيط» في القائمة الجانبية</p>
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>ركائز الثقة (3 بطاقات مرقّمة)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-2">
              <p className="text-xs text-[#9BA3AA] font-bold">.0{n}</p>
              <input name={`trust_pillar_${n}_title_ar`} defaultValue={settings[`trust_pillar_${n}_title_ar`]} placeholder="العنوان" className={inputCls} />
              <textarea name={`trust_pillar_${n}_desc_ar`} rows={3} defaultValue={settings[`trust_pillar_${n}_desc_ar`]} placeholder="الوصف" className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>طريقة العمل (3 خطوات)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-2">
              <p className="text-xs text-[#9BA3AA] font-bold">الخطوة {n}</p>
              <input name={`how_it_works_${n}_title_ar`} defaultValue={settings[`how_it_works_${n}_title_ar`]} placeholder="العنوان" className={inputCls} />
              <textarea name={`how_it_works_${n}_desc_ar`} rows={3} defaultValue={settings[`how_it_works_${n}_desc_ar`]} placeholder="الوصف" className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>قسم فيديو المعرض</h2>
        <div>
          <label className={labelCls}>رابط الفيديو (MP4)</label>
          <input name="showroom_video_url" defaultValue={settings.showroom_video_url} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>العنوان</label>
          <input name="showroom_headline_ar" defaultValue={settings.showroom_headline_ar || "زور المعرض بنفسك"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الوصف</label>
          <textarea name="showroom_desc_ar" rows={2} defaultValue={settings.showroom_desc_ar || "تجربة معاينة حقيقية لكل سيارة قبل القرار"} className={inputCls} />
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>هيرو صفحة السيارات المستعملة (/used)</h2>
        <div>
          <label className={labelCls}>رابط فيديو الخلفية (MP4)</label>
          <input name="used_hero_video_url" defaultValue={settings.used_hero_video_url} placeholder="https://.../video.mp4" className={inputCls} />
          <p className="text-xs text-[#F2F0EC]/25 mt-1">اتركه فارغًا لعرض خلفية داكنة بدون فيديو</p>
        </div>
        <div>
          <label className={labelCls}>الشعار العلوي الصغير</label>
          <input name="used_hero_eyebrow_ar" defaultValue={settings.used_hero_eyebrow_ar || "سيارات مفحوصة وموثّقة"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>العنوان الكبير</label>
          <input name="used_hero_headline_ar" defaultValue={settings.used_hero_headline_ar || "سيارات مستعملة"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الوصف</label>
          <textarea name="used_hero_subheadline_ar" rows={2} defaultValue={settings.used_hero_subheadline_ar || "كل سيارة موجودة فعليًا في المعرض — بحالة مفحوصة وصور حقيقية"} className={inputCls} />
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>هيرو صفحة السيارات الجديدة (/new)</h2>
        <div>
          <label className={labelCls}>رابط فيديو الخلفية (MP4)</label>
          <input name="new_hero_video_url" defaultValue={settings.new_hero_video_url} placeholder="https://.../video.mp4" className={inputCls} />
          <p className="text-xs text-[#F2F0EC]/25 mt-1">اتركه فارغًا لعرض خلفية داكنة بدون فيديو — فيديو مستقل عن فيديو الصفحة الرئيسية وفيديو هيرو السيارات المستعملة</p>
        </div>
        <div>
          <label className={labelCls}>الشعار العلوي الصغير</label>
          <input name="new_hero_eyebrow_ar" defaultValue={settings.new_hero_eyebrow_ar || "كتالوج السيارات الجديدة"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>العنوان الكبير</label>
          <input name="new_hero_headline_ar" defaultValue={settings.new_hero_headline_ar || "سيارات جديدة"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الوصف</label>
          <textarea name="new_hero_subheadline_ar" rows={2} defaultValue={settings.new_hero_subheadline_ar || "تصفّح كتالوج السيارات الجديدة الكامل — الماركات والموديلات والمواصفات الحقيقية"} className={inputCls} />
        </div>
      </div>

      <div className={sectionCls}>
        <h2 className={h2Cls}>عنوان قسم السيارات المستعملة في الصفحة الرئيسية</h2>
        <div>
          <label className={labelCls}>الشعار العلوي الصغير</label>
          <input name="used_section_eyebrow_ar" defaultValue={settings.used_section_eyebrow_ar || "متاحة الآن في المعرض"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>العنوان</label>
          <input name="used_section_title_ar" defaultValue={settings.used_section_title_ar || "سيارات مستعملة موثوقة"} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>الوصف</label>
          <input name="used_section_subtitle_ar" defaultValue={settings.used_section_subtitle_ar || "فحص شامل، حالة موثّقة، وتواصل فوري عبر واتساب"} className={inputCls} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-[#9BA3AA] hover:bg-[#838B92] disabled:opacity-50 text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors">
          {loading ? "جاري الحفظ..." : "حفظ كل التعديلات"}
        </button>
      </div>
    </form>
  );
}
