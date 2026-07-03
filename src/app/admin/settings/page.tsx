export const dynamic = "force-dynamic";
import { db } from "@/lib/db/drizzle/connection";
import { settings } from "@/lib/db/drizzle/schema";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const allSettings = await db.select().from(settings);
  const map = Object.fromEntries(allSettings.map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5EFE0]">الإعدادات</h1>
        <p className="text-[#F5EFE0]/40 text-sm mt-1">إعدادات المتجر العامة</p>
      </div>
      <SettingsForm settings={map} />
    </div>
  );
}
