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
    <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6 space-y-5">
      <h2 className="font-semibold text-[#F5EFE0] border-b border-[#C9A84C]/10 pb-3">
        صور المنتج
      </h2>

      {/* Existing images */}
      {images.length > 0 ? (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <div key={img.id} className="relative group" style={{ width: 100, height: 100 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt_ar ?? ""} className="w-full h-full object-cover rounded-lg border border-[#C9A84C]/15" />
              {i === 0 && (
                <span className="absolute top-1 right-1 text-[9px] font-bold bg-[#C9A84C] text-[#0A0806] px-1.5 py-0.5 rounded">
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
        <p className="text-sm text-[#F5EFE0]/30">لا توجد صور حتى الآن</p>
      )}

      {/* Add image section */}
      <div className="space-y-3 pt-2 border-t border-[#C9A84C]/10">
        <p className="text-xs text-[#F5EFE0]/40 font-semibold uppercase tracking-widest">إضافة صورة</p>

        {/* Upload file */}
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }}
          />
          <button type="button" disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-[#C9A84C]/25 text-[#C9A84C] rounded-lg hover:bg-[#C9A84C]/10 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <><span className="inline-block w-3 h-3 border border-[#C9A84C]/40 border-t-[#C9A84C] rounded-full animate-spin"/>جاري الرفع...</>
            ) : (
              <><span>↑</span> رفع صورة</>
            )}
          </button>
          <span className="text-xs text-[#F5EFE0]/25">أو</span>
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
            className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B89440] disabled:opacity-40 text-[#0A0806] font-bold text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            {adding ? "..." : "إضافة"}
          </button>
        </div>

        {/* Preview */}
        {urlInput.trim() && (
          <div className="flex items-center gap-3 mt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urlInput} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#C9A84C]/20"
              onError={e => (e.currentTarget.style.display = "none")}
              onLoad={e => (e.currentTarget.style.display = "block")}
              style={{ display: "none" }}
            />
            <p className="text-xs text-[#F5EFE0]/30">معاينة الصورة</p>
          </div>
        )}
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
    <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6 space-y-5">
      <h2 className="font-semibold text-[#F5EFE0] border-b border-[#C9A84C]/10 pb-3">
        متغيّرات المنتج
        <span className="ml-2 text-xs font-normal text-[#F5EFE0]/30">(مقاسات، ألوان، مخزون)</span>
      </h2>

      {/* Variants table */}
      {variants.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="text-[#F5EFE0]/40 text-xs uppercase tracking-widest border-b border-[#C9A84C]/10">
                <th className="pb-2 font-normal">اللون</th>
                <th className="pb-2 font-normal">المقاس</th>
                <th className="pb-2 font-normal">SKU</th>
                <th className="pb-2 font-normal">المخزون</th>
                <th className="pb-2 font-normal">سعر خاص</th>
                <th className="pb-2 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A84C]/05">
              {variants.map(v => (
                <tr key={v.id} className="text-[#F5EFE0]/80">
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
                        <button type="button" onClick={() => saveEdit(v.id)} className="text-xs text-[#C9A84C] hover:underline">حفظ</button>
                        <button type="button" onClick={() => { setEditId(null); setEditData({}) }} className="text-xs text-[#F5EFE0]/30 hover:text-[#F5EFE0]/60 mr-2">إلغاء</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2">{v.color_ar || <span className="text-[#F5EFE0]/20">—</span>}</td>
                      <td className="py-2 px-2">{v.size || <span className="text-[#F5EFE0]/20">—</span>}</td>
                      <td className="py-2 px-2 text-[#F5EFE0]/40 font-mono text-xs">{v.sku || "—"}</td>
                      <td className="py-2 px-2">
                        <span className={`font-bold ${v.stock === 0 ? "text-red-400" : v.stock < 5 ? "text-yellow-400" : "text-green-400"}`}>{v.stock}</span>
                      </td>
                      <td className="py-2 px-2">{v.price_override ? `${Number(v.price_override).toLocaleString("ar-EG")} ج` : <span className="text-[#F5EFE0]/20">السعر الأساسي</span>}</td>
                      <td className="py-2 text-left whitespace-nowrap space-x-2 space-x-reverse">
                        <button type="button" onClick={() => { setEditId(v.id); setEditData({}) }} className="text-xs text-[#C9A84C]/70 hover:text-[#C9A84C]">تعديل</button>
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
        <p className="text-sm text-[#F5EFE0]/30">لا توجد متغيّرات — أضف مقاسات أو ألوان أدناه</p>
      )}

      {/* Add variant row */}
      <div className="space-y-3 pt-3 border-t border-[#C9A84C]/10">
        <p className="text-xs text-[#F5EFE0]/40 font-semibold uppercase tracking-widest">إضافة متغيّر</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input placeholder="اللون" value={form.color_ar} onChange={e => setForm(f => ({ ...f, color_ar: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input placeholder="المقاس (M, XL…)" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input placeholder="SKU (اختياري)" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input type="number" min="0" placeholder="المخزون" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className={inputCls + " py-2 text-xs"} />
          <input type="number" min="0" step="0.01" placeholder="سعر خاص (اختياري)" value={form.price_override} onChange={e => setForm(f => ({ ...f, price_override: e.target.value }))} className={inputCls + " py-2 text-xs"} />
        </div>
        <button type="button" disabled={adding} onClick={addVariant}
          className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B89440] disabled:opacity-40 text-[#0A0806] font-bold text-sm rounded-lg transition-colors">
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
        <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-6 space-y-5">
          <h2 className="font-semibold text-[#F5EFE0] border-b border-[#C9A84C]/10 pb-3">المعلومات الأساسية</h2>

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
            <p className="text-xs text-[#F5EFE0]/25 mt-1">اكتب كل التفاصيل المهمة للعميل قبل الاتصال</p>
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
            <label htmlFor="is_featured" className="text-sm text-[#F5EFE0]/60">
              سيارة مميّزة (تظهر في الصفحة الرئيسية)
            </label>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl border border-[#9BA3AA]/10 p-6 space-y-5">
          <h2 className="font-semibold text-[#F5EFE0] border-b border-[#9BA3AA]/10 pb-3">مواصفات السيارة</h2>
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

        {!isEdit && (
          <div className="bg-[#0A0806] rounded-xl border border-[#C9A84C]/10 p-5">
            <p className="text-sm text-[#F5EFE0]/40">
              💡 بعد حفظ المنتج ستُنقل تلقائياً لصفحة التعديل حيث يمكنك إضافة الصور.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 text-sm text-[#F5EFE0]/50 hover:text-[#F5EFE0] border border-[#C9A84C]/20 rounded-lg transition-colors">
            إلغاء
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#B89440] disabled:opacity-50 text-[#0A0806] font-bold text-sm rounded-lg transition-colors">
            {loading ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
          </button>
        </div>
      </form>

      {/* Image manager — only when editing */}
      {isEdit && <ImageManager productId={product!.id} />}

      {/* Variants manager — only when editing */}
      {isEdit && <VariantsManager productId={product!.id} />}
    </div>
  );
}

const labelCls = "block text-sm text-[#F5EFE0]/60 mb-1.5";
const inputCls = "w-full bg-[#1A1310] border border-[#C9A84C]/20 rounded-lg px-4 py-2.5 text-[#F5EFE0] text-sm placeholder:text-[#F5EFE0]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors";
