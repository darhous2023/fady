"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category } from "@/lib/db/drizzle/schema";

type ProductRow = {
  id: string;
  name_ar: string;
  slug: string;
  description_ar: string | null;
  category_id: string;
  quality_tier: "hi_copy" | "mirror" | "original";
  price: string | number;
  compare_at_price: string | number | null;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  mileage_km?: number | null;
  transmission?: string | null;
  fuel_type?: string | null;
  body_type?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  engine_cc?: number | null;
  cylinders?: number | null;
  horsepower?: number | null;
  drivetrain?: string | null;
  doors?: number | null;
  seats?: number | null;
  previous_owners?: number | null;
  plate_type?: string | null;
  inspection_status?: string | null;
  warranty?: string | null;
  features_ar?: string | null;
};

type ImageRow = { id: string; url: string; alt_ar: string | null; sort_order: number };

// quality_tier is inherited from the fashion-store schema; relabeled here as the car's condition grade.
const QUALITY_OPTIONS = [
  { value: "original", label: "ممتازة" },
  { value: "mirror",   label: "جيدة جدًا" },
  { value: "hi_copy",  label: "جيدة" },
];
const TRANSMISSION_OPTIONS = [
  { value: "automatic", label: "أوتوماتيك" },
  { value: "manual",    label: "مانيوال" },
];
const FUEL_OPTIONS = [
  { value: "gasoline", label: "بنزين" },
  { value: "diesel",   label: "ديزل" },
  { value: "hybrid",   label: "هايبرد" },
  { value: "electric", label: "كهرباء" },
];
const STATUS_OPTIONS = [
  { value: "active",   label: "نشط" },
  { value: "draft",    label: "مسودة" },
  { value: "archived", label: "مؤرشف" },
];
const DRIVETRAIN_OPTIONS = [
  { value: "fwd", label: "دفع أمامي" },
  { value: "rwd", label: "دفع خلفي" },
  { value: "awd", label: "دفع رباعي" },
];
const COLOR_PRESETS = ["أبيض", "أسود", "فضي", "رمادي", "أحمر", "أزرق", "بني", "بيج"];
const PLATE_TYPE_PRESETS = ["ملاكي", "نقل خفيف", "أجرة"];
const INSPECTION_PRESETS = ["تم الفحص الشامل", "متاح الفحص عند الطلب", "لم يتم الفحص بعد"];
const WARRANTY_PRESETS = ["بدون ضمان", "ضمان المعرض 3 أشهر", "ضمان المعرض 6 أشهر", "ساري ضمان الوكيل"];

// ── Image manager (only shown when editing existing product) ─────────────────
function ImageManager({ productId }: { productId: string }) {
  const [images, setImages]       = useState<ImageRow[]>([]);
  const [urlInput, setUrlInput]   = useState("");
  const [altInput, setAltInput]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/products/${productId}/images`);
    if (r.ok) setImages(await r.json());
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await r.json();
    setUploading(false);
    if (!r.ok) { toast.error(data.error || "فشل الرفع"); return; }
    setUrlInput(data.url);
    toast.success("تم رفع الصورة — اضغط إضافة لحفظها");
  }

  async function addImage() {
    if (!urlInput.trim()) { toast.error("أدخل رابط الصورة"); return; }
    setAdding(true);
    const r = await fetch(`/api/admin/products/${productId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput.trim(), alt_ar: altInput.trim() || null, sort_order: images.length }),
    });
    setAdding(false);
    if (!r.ok) { toast.error("فشل إضافة الصورة"); return; }
    setUrlInput(""); setAltInput("");
    toast.success("تمت إضافة الصورة");
    load();
  }

  async function deleteImage(imgId: string) {
    if (!confirm("حذف هذه الصورة؟")) return;
    await fetch(`/api/admin/products/${productId}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_id: imgId }),
    });
    toast.success("تم الحذف");
    load();
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
      <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">
        صور المنتج
      </h2>

      {/* Existing images */}
      {images.length > 0 ? (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <div key={img.id} className="relative group" style={{ width: 100, height: 100 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt_ar ?? ""} className="w-full h-full object-cover rounded-lg border border-[#9BA3AA]/15" />
              {i === 0 && (
                <span className="absolute top-1 right-1 text-[9px] font-bold bg-[#9BA3AA] text-[#0A0A0A] px-1.5 py-0.5 rounded">
                  رئيسية
                </span>
              )}
              <button
                type="button"
                onClick={() => deleteImage(img.id)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity text-red-400 text-xs font-bold"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#F2F0EC]/30">لا توجد صور حتى الآن</p>
      )}

      {/* Add image section */}
      <div className="space-y-3 pt-2 border-t border-[#9BA3AA]/10">
        <p className="text-xs text-[#F2F0EC]/40 font-semibold uppercase tracking-widest">إضافة صورة</p>

        {/* Upload file */}
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }}
          />
          <button type="button" disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-[#9BA3AA]/25 text-[#9BA3AA] rounded-lg hover:bg-[#9BA3AA]/10 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <><span className="inline-block w-3 h-3 border border-[#9BA3AA]/40 border-t-[#9BA3AA] rounded-full animate-spin"/>جاري الرفع...</>
            ) : (
              <><span>↑</span> رفع صورة</>
            )}
          </button>
          <span className="text-xs text-[#F2F0EC]/25">أو</span>
        </div>

        {/* URL input */}
        <div className="flex gap-2">
          <input
            type="url" placeholder="رابط الصورة https://..."
            value={urlInput} onChange={e => setUrlInput(e.target.value)}
            className={inputCls + " flex-1"}
          />
          <input
            type="text" placeholder="وصف (اختياري)"
            value={altInput} onChange={e => setAltInput(e.target.value)}
            className={inputCls + " w-36"}
          />
          <button type="button" disabled={adding || !urlInput.trim()}
            onClick={addImage}
            className="px-4 py-2 bg-[#9BA3AA] hover:bg-[#7d858c] disabled:opacity-40 text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            {adding ? "..." : "إضافة"}
          </button>
        </div>

        {/* Preview */}
        {urlInput.trim() && (
          <div className="flex items-center gap-3 mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urlInput} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#9BA3AA]/20"
              onError={e => (e.currentTarget.style.display = "none")}
              onLoad={e => (e.currentTarget.style.display = "block")}
              style={{ display: "none" }}
            />
            <p className="text-xs text-[#F2F0EC]/30">معاينة الصورة</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 360° frames manager (only shown when editing existing product) ───────────
type Frame360Row = { id: string; url: string; sequence_index: number };

function Frames360Manager({ productId }: { productId: string }) {
  const [frames, setFrames]       = useState<Frame360Row[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/products/${productId}/360-frames`);
    if (r.ok) setFrames(await r.json());
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  async function uploadFrames(files: FileList) {
    setUploading(true);
    let nextIndex = frames.length;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) { toast.error(upData.error || "فشل رفع إحدى الصور"); continue; }
      await fetch(`/api/admin/products/${productId}/360-frames`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: upData.url, sequence_index: nextIndex }),
      });
      nextIndex += 1;
    }
    setUploading(false);
    toast.success("تم رفع صور الـ 360");
    load();
  }

  async function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= frames.length) return;
    const next = [...frames];
    [next[idx], next[target]] = [next[target], next[idx]];
    setFrames(next);
    await fetch(`/api/admin/products/${productId}/360-frames`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frames: next.map((f, i) => ({ id: f.id, sequence_index: i })) }),
    });
    load();
  }

  async function deleteFrame(frameId: string) {
    if (!confirm("حذف هذه الصورة من طقم الـ 360؟")) return;
    await fetch(`/api/admin/products/${productId}/360-frames`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frame_id: frameId }),
    });
    toast.success("تم الحذف");
    load();
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-[#9BA3AA]/10 pb-3">
        <h2 className="font-semibold text-[#F2F0EC]">عارض 360°</h2>
        <span className="text-xs text-[#F2F0EC]/30">{frames.length} صورة</span>
      </div>
      <p className="text-xs text-[#F2F0EC]/40">
        ارفع 12–36 صورة للسيارة مصوّرة بدورة كاملة حواليها (نفس المسافة والزاوية تقريبًا) — كل ما زاد عدد الصور، كل ما كان الدوران أنعم. لو مفيش صور هنا، هتظهر صفحة السيارة بمعرض الصور العادي بدل الـ 360.
      </p>

      {frames.length > 0 ? (
        <div className="flex gap-3 flex-wrap">
          {frames.map((f, i) => (
            <div key={f.id} className="relative group" style={{ width: 88, height: 88 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={`frame ${i + 1}`} className="w-full h-full object-cover rounded-lg border border-[#9BA3AA]/15" />
              <span className="absolute top-1 right-1 text-[9px] font-bold bg-[#9BA3AA] text-[#0A0A0A] px-1.5 py-0.5 rounded">
                {i + 1}
              </span>
              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 rounded-lg transition-opacity">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#F2F0EC] disabled:opacity-30">◀</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === frames.length - 1}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#F2F0EC] disabled:opacity-30">▶</button>
                </div>
                <button type="button" onClick={() => deleteFrame(f.id)} className="text-[10px] text-red-400 font-bold">حذف</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#F2F0EC]/30">لا توجد صور 360 حتى الآن</p>
      )}

      <div className="pt-2 border-t border-[#9BA3AA]/10">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { const files = e.target.files; if (files && files.length) uploadFrames(files); e.target.value = ""; }}
        />
        <button type="button" disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-[#9BA3AA]/25 text-[#9BA3AA] rounded-lg hover:bg-[#9BA3AA]/10 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <><span className="inline-block w-3 h-3 border border-[#9BA3AA]/40 border-t-[#9BA3AA] rounded-full animate-spin"/>جاري رفع صور الـ 360...</>
          ) : (
            <><span>↑</span> رفع صور 360° (يمكن اختيار عدة صور مرة واحدة)</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Variants manager ─────────────────────────────────────────────────────────
type VariantRow = { id: string; color_ar: string | null; size: string | null; sku: string | null; stock: number; price_override: string | null }
type NewVariant  = { color_ar: string; size: string; sku: string; stock: string; price_override: string }

function VariantsManager({ productId }: { productId: string }) {
  const [variants, setVariants] = useState<VariantRow[]>([])
  const [adding, setAdding]     = useState(false)
  const [editId, setEditId]     = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<NewVariant>>({})
  const [form, setForm]         = useState<NewVariant>({ color_ar: "", size: "", sku: "", stock: "0", price_override: "" })

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/products/${productId}/variants`)
    if (r.ok) setVariants(await r.json())
  }, [productId])

  useEffect(() => { load() }, [load])

  async function addVariant() {
    setAdding(true)
    const r = await fetch(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, stock: Number(form.stock), price_override: form.price_override || null }),
    })
    setAdding(false)
    if (!r.ok) { toast.error("فشل الإضافة"); return }
    toast.success("تمت إضافة المتغيّر")
    setForm({ color_ar: "", size: "", sku: "", stock: "0", price_override: "" })
    load()
  }

  async function saveEdit(id: string) {
    const r = await fetch(`/api/admin/products/${productId}/variants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editData,
        stock: editData.stock !== undefined ? Number(editData.stock) : undefined,
        price_override: editData.price_override !== undefined ? (editData.price_override || null) : undefined,
      }),
    })
    if (!r.ok) { toast.error("فشل الحفظ"); return }
    toast.success("تم التحديث")
    setEditId(null)
    setEditData({})
    load()
  }

  async function deleteVariant(id: string) {
    if (!confirm("حذف هذا المتغيّر؟")) return
    await fetch(`/api/admin/products/${productId}/variants/${id}`, { method: "DELETE" })
    toast.success("تم الحذف")
    load()
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
      <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">
        متغيّرات المنتج
        <span className="ml-2 text-xs font-normal text-[#F2F0EC]/30">(مقاسات، ألوان، مخزون)</span>
      </h2>

      {/* Variants table */}
      {variants.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="text-[#F2F0EC]/40 text-xs uppercase tracking-widest border-b border-[#9BA3AA]/10">
                <th className="pb-2 font-normal">اللون</th>
                <th className="pb-2 font-normal">المقاس</th>
                <th className="pb-2 font-normal">SKU</th>
                <th className="pb-2 font-normal">المخزون</th>
                <th className="pb-2 font-normal">سعر خاص</th>
                <th className="pb-2 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#9BA3AA]/05">
              {variants.map(v => (
                <tr key={v.id} className="text-[#F2F0EC]/80">
                  {editId === v.id ? (
                    <>
                      <td className="py-2 pr-0 pl-2">
                        <input value={editData.color_ar ?? v.color_ar ?? ""} onChange={e => setEditData(d => ({ ...d, color_ar: e.target.value }))} className={inputCls + " py-1 text-xs"} placeholder="اللون" />
                      </td>
                      <td className="py-2 px-2">
                        <input value={editData.size ?? v.size ?? ""} onChange={e => setEditData(d => ({ ...d, size: e.target.value }))} className={inputCls + " py-1 text-xs"} placeholder="M / XL" />
                      </td>
                      <td className="py-2 px-2">
                        <input value={editData.sku ?? v.sku ?? ""} onChange={e => setEditData(d => ({ ...d, sku: e.target.value }))} className={inputCls + " py-1 text-xs"} placeholder="SKU" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="number" min="0" value={editData.stock ?? String(v.stock)} onChange={e => setEditData(d => ({ ...d, stock: e.target.value }))} className={inputCls + " py-1 text-xs w-20"} />
                      </td>
                      <td className="py-2 px-2">
                        <input type="number" min="0" step="0.01" value={editData.price_override ?? v.price_override ?? ""} onChange={e => setEditData(d => ({ ...d, price_override: e.target.value }))} className={inputCls + " py-1 text-xs w-24"} placeholder="اتركه فارغاً" />
                      </td>
                      <td className="py-2 text-left whitespace-nowrap space-x-2 space-x-reverse">
                        <button type="button" onClick={() => saveEdit(v.id)} className="text-xs text-[#9BA3AA] hover:underline">حفظ</button>
                        <button type="button" onClick={() => { setEditId(null); setEditData({}) }} className="text-xs text-[#F2F0EC]/30 hover:text-[#F2F0EC]/60 mr-2">إلغاء</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2">{v.color_ar || <span className="text-[#F2F0EC]/20">—</span>}</td>
                      <td className="py-2 px-2">{v.size || <span className="text-[#F2F0EC]/20">—</span>}</td>
                      <td className="py-2 px-2 text-[#F2F0EC]/40 font-mono text-xs">{v.sku || "—"}</td>
                      <td className="py-2 px-2">
                        <span className={`font-bold ${v.stock === 0 ? "text-red-400" : v.stock < 5 ? "text-yellow-400" : "text-green-400"}`}>{v.stock}</span>
                      </td>
                      <td className="py-2 px-2">{v.price_override ? `${Number(v.price_override).toLocaleString("ar-EG")} ج` : <span className="text-[#F2F0EC]/20">السعر الأساسي</span>}</td>
                      <td className="py-2 text-left whitespace-nowrap space-x-2 space-x-reverse">
                        <button type="button" onClick={() => { setEditId(v.id); setEditData({}) }} className="text-xs text-[#9BA3AA]/70 hover:text-[#9BA3AA]">تعديل</button>
                        <button type="button" onClick={() => deleteVariant(v.id)} className="text-xs text-red-400/60 hover:text-red-400 mr-2">حذف</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-[#F2F0EC]/30">لا توجد متغيّرات — أضف مقاسات أو ألوان أدناه</p>
      )}

      {/* Add variant row */}
      <div className="space-y-3 pt-3 border-t border-[#9BA3AA]/10">
        <p className="text-xs text-[#F2F0EC]/40 font-semibold uppercase tracking-widest">إضافة متغيّر</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input placeholder="اللون" value={form.color_ar} onChange={e => setForm(f => ({ ...f, color_ar: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input placeholder="المقاس (M, XL…)" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input placeholder="SKU (اختياري)" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input type="number" min="0" placeholder="المخزون" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input type="number" min="0" step="0.01" placeholder="سعر خاص (اختياري)" value={form.price_override} onChange={e => setForm(f => ({ ...f, price_override: e.target.value }))} className={inputCls + " py-2 text-xs"} />
        </div>
        <button type="button" disabled={adding} onClick={addVariant}
          className="px-4 py-2 bg-[#9BA3AA] hover:bg-[#7d858c] disabled:opacity-40 text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors">
          {adding ? "..." : "+ إضافة متغيّر"}
        </button>
      </div>
    </div>
  )
}

// ── Main form ────────────────────────────────────────────────────────────────
export default function ProductForm({ categories, product }: { categories: Category[]; product?: ProductRow }) {
  const router  = useRouter();
  const isEdit  = !!product;
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form     = e.currentTarget;
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value;
    const getChecked = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.checked;

    const compare_at = getValue("compare_at_price");
    const data = {
      name_ar:         getValue("name_ar"),
      slug:            getValue("slug"),
      description_ar:  getValue("description_ar"),
      category_id:     getValue("category_id"),
      quality_tier:    getValue("quality_tier"),
      price:           getValue("price"),
      compare_at_price: compare_at || null,
      status:          getValue("status"),
      is_featured:     getChecked("is_featured"),
      make:            getValue("make") || null,
      model:           getValue("model") || null,
      year:            getValue("year") || null,
      mileage_km:      getValue("mileage_km") || null,
      transmission:    getValue("transmission") || null,
      fuel_type:       getValue("fuel_type") || null,
      body_type:       getValue("body_type") || null,
      exterior_color:  getValue("exterior_color") || null,
      interior_color:  getValue("interior_color") || null,
      engine_cc:       getValue("engine_cc") || null,
      cylinders:       getValue("cylinders") || null,
      horsepower:      getValue("horsepower") || null,
      drivetrain:      getValue("drivetrain") || null,
      doors:           getValue("doors") || null,
      seats:           getValue("seats") || null,
      previous_owners: getValue("previous_owners") || null,
      plate_type:      getValue("plate_type") || null,
      inspection_status: getValue("inspection_status") || null,
      warranty:        getValue("warranty") || null,
      features_ar:     getValue("features_ar") || null,
    };

    const url    = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "حدث خطأ");
      setLoading(false);
      return;
    }

    // For new product, get the returned id and redirect to edit page so user can add images
    if (!isEdit) {
      const created = await res.json();
      toast.success("تم إضافة المنتج — يمكنك إضافة الصور الآن");
      router.push(`/admin/products/${created.id}/edit`);
      return;
    }

    toast.success("تم تحديث المنتج");
    router.push("/admin/products");
    router.refresh();
  }

  function randomSlug() {
    return "p-" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
          <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">المعلومات الأساسية</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>عنوان الإعلان *</label>
              <input name="name_ar" required defaultValue={product?.name_ar} placeholder="مثال: تويوتا كورولا 2020"
                onChange={() => {}}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Slug (URL) *</label>
              <input name="slug" required defaultValue={product?.slug ?? randomSlug()} placeholder="p-ab12cd34" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>الوصف التفصيلي</label>
            <textarea name="description_ar" defaultValue={product?.description_ar || ""} rows={5}
              placeholder={`مثال:\nحالة السيارة: ممتازة، فبريكة بالكامل\nعدد الملاك: مالك واحد\nالفحص: تم الفحص الشامل\nملاحظات: صيانة دورية بالوكيل`}
              className={`${inputCls} resize-y min-h-[120px]`}
            />
            <p className="text-xs text-[#F2F0EC]/25 mt-1">اكتب كل التفاصيل المهمة للعميل قبل الاتصال</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>الماركة (القسم) *</label>
              <select name="category_id" required defaultValue={product?.category_id} className={inputCls}>
                <option value="">اختر الماركة</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>حالة السيارة *</label>
              <select name="quality_tier" required defaultValue={product?.quality_tier || "original"} className={inputCls}>
                {QUALITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>الحالة (النشر)</label>
              <select name="status" defaultValue={product?.status || "draft"} className={inputCls}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>السعر (جنيه) *</label>
              <input name="price" type="number" required min="1" step="0.01"
                defaultValue={product?.price ? String(product.price) : ""} placeholder="450000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>السعر قبل الخصم (اختياري)</label>
              <input name="compare_at_price" type="number" min="1" step="0.01"
                defaultValue={product?.compare_at_price ? String(product.compare_at_price) : ""} placeholder="480000" className={inputCls} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_featured" id="is_featured"
              defaultChecked={product?.is_featured} className="w-4 h-4 accent-[#9BA3AA]" />
            <label htmlFor="is_featured" className="text-sm text-[#F2F0EC]/60">
              سيارة مميّزة (تظهر في الصفحة الرئيسية)
            </label>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
          <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">مواصفات السيارة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>الموديل (الطراز)</label>
              <input name="model" defaultValue={product?.model || ""} placeholder="كورولا" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>الماركة (نصي، للعرض)</label>
              <input name="make" defaultValue={product?.make || ""} placeholder="تويوتا" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>سنة الصنع</label>
              <input name="year" type="number" min="1980" max="2030" defaultValue={product?.year ?? ""} placeholder="2020" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>العداد (كم)</label>
              <input name="mileage_km" type="number" min="0" defaultValue={product?.mileage_km ?? ""} placeholder="65000" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>ناقل الحركة</label>
              <select name="transmission" defaultValue={product?.transmission || "automatic"} className={inputCls}>
                {TRANSMISSION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>نوع الوقود</label>
              <select name="fuel_type" defaultValue={product?.fuel_type || "gasoline"} className={inputCls}>
                {FUEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>نوع الهيكل</label>
              <input name="body_type" defaultValue={product?.body_type || ""} placeholder="سيدان" className={inputCls} />
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
          <h2 className="font-semibold text-[#F2F0EC] border-b border-[#9BA3AA]/10 pb-3">مواصفات إضافية</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>اللون الخارجي</label>
              <input name="exterior_color" list="color-presets" defaultValue={product?.exterior_color || ""} placeholder="أبيض" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>اللون الداخلي</label>
              <input name="interior_color" list="color-presets" defaultValue={product?.interior_color || ""} placeholder="أسود" className={inputCls} />
            </div>
          </div>
          <datalist id="color-presets">
            {COLOR_PRESETS.map(c => <option key={c} value={c} />)}
          </datalist>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>سعة المحرك (سي سي)</label>
              <input name="engine_cc" type="number" min="0" defaultValue={product?.engine_cc ?? ""} placeholder="1600" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>عدد الأسطوانات</label>
              <input name="cylinders" type="number" min="0" defaultValue={product?.cylinders ?? ""} placeholder="4" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>قوة الحصان (HP)</label>
              <input name="horsepower" type="number" min="0" defaultValue={product?.horsepower ?? ""} placeholder="120" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>نظام الدفع</label>
              <select name="drivetrain" defaultValue={product?.drivetrain || ""} className={inputCls}>
                <option value="">— غير محدد —</option>
                {DRIVETRAIN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>عدد الأبواب</label>
              <input name="doors" type="number" min="0" max="6" defaultValue={product?.doors ?? ""} placeholder="4" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>عدد المقاعد</label>
              <input name="seats" type="number" min="0" max="12" defaultValue={product?.seats ?? ""} placeholder="5" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>عدد الملاك السابقين</label>
              <input name="previous_owners" type="number" min="0" defaultValue={product?.previous_owners ?? ""} placeholder="1" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>نوع اللوحة</label>
              <input name="plate_type" list="plate-type-presets" defaultValue={product?.plate_type || ""} placeholder="ملاكي" className={inputCls} />
              <datalist id="plate-type-presets">
                {PLATE_TYPE_PRESETS.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>حالة الفحص</label>
              <input name="inspection_status" list="inspection-presets" defaultValue={product?.inspection_status || ""} placeholder="تم الفحص الشامل" className={inputCls} />
              <datalist id="inspection-presets">
                {INSPECTION_PRESETS.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>الضمان</label>
              <input name="warranty" list="warranty-presets" defaultValue={product?.warranty || ""} placeholder="بدون ضمان" className={inputCls} />
              <datalist id="warranty-presets">
                {WARRANTY_PRESETS.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className={labelCls}>المزايا (سطر لكل ميزة)</label>
            <textarea name="features_ar" defaultValue={product?.features_ar || ""} rows={5}
              placeholder={"مثال:\nفتحة سقف\nشاشة تعمل باللمس\nكاميرا خلفية\nحساسات ركن\nمثبت سرعة"}
              className={`${inputCls} resize-y min-h-[110px]`}
            />
            <p className="text-xs text-[#F2F0EC]/25 mt-1">كل سطر يظهر كميزة منفصلة في صفحة السيارة</p>
          </div>
        </div>

        {!isEdit && (
          <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-5">
            <p className="text-sm text-[#F2F0EC]/40">
              💡 بعد حفظ المنتج ستُنقل تلقائياً لصفحة التعديل حيث يمكنك إضافة الصور.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 text-sm text-[#F2F0EC]/50 hover:text-[#F2F0EC] border border-[#9BA3AA]/20 rounded-lg transition-colors">
            إلغاء
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-[#9BA3AA] hover:bg-[#7d858c] disabled:opacity-50 text-[#0A0A0A] font-bold text-sm rounded-lg transition-colors">
            {loading ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
          </button>
        </div>
      </form>

      {/* Image manager — only when editing */}
      {isEdit && <ImageManager productId={product!.id} />}

      {/* 360° frames manager — only when editing */}
      {isEdit && <Frames360Manager productId={product!.id} />}

      {/* Variants manager — only when editing */}
      {isEdit && <VariantsManager productId={product!.id} />}
    </div>
  );
}

const labelCls = "block text-sm text-[#F2F0EC]/60 mb-1.5";
const inputCls = "w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-4 py-2.5 text-[#F2F0EC] text-sm placeholder:text-[#F2F0EC]/20 focus:outline-none focus:border-[#9BA3AA]/60 transition-colors";
