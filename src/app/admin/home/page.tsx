export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { settings } from "@/lib/db/drizzle/schema";
import HomeContentForm from "@/components/admin/HomeContentForm";

export default async function HomeContentPage() {
  const allSettings = await db.select().from(settings);
  const map = Object.fromEntries(allSettings.map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5EFE0]">محتوى الصفحة الرئيسية</h1>
        <p className="text-[#F5EFE0]/40 text-sm mt-1">
          كل نص وصورة وفيديو في الصفحة الرئيسية قابل للتعديل من هنا — بدون الحاجة لتعديل الكود
        </p>
      </div>
      <HomeContentForm settings={map} />
    </div>
  );
}
