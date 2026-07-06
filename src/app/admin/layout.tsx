"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "الداشبورد", icon: "📊" },
  { href: "/admin/home", label: "محتوى الرئيسية", icon: "🏠" },
  { href: "/admin/products", label: "السيارات المستعملة", icon: "🚗" },
  { href: "/admin/cars-catalog", label: "بوابة السيارات الجديدة", icon: "🆕" },
  { href: "/admin/orders", label: "طلبات الحجز", icon: "🧾" },
  { href: "/admin/reviews", label: "التقييمات", icon: "⭐" },
  { href: "/admin/categories", label: "الأقسام", icon: "🏷️" },
  { href: "/admin/discounts", label: "الخصومات", icon: "🎁" },
  { href: "/admin/banners", label: "البانرات", icon: "🖼️" },
  { href: "/admin/financing-partners", label: "التمويل والتقسيط", icon: "💳" },
  { href: "/admin/flash-deals", label: "عروض الفلاش", icon: "⚡" },
  { href: "/admin/customers", label: "العملاء", icon: "🧑‍💼" },
  { href: "/admin/admins", label: "الصلاحيات", icon: "👥" },
  { href: "/admin/settings", label: "الإعدادات", icon: "⚙️" },
  { href: "/admin/guide", label: "دليل الأدمن", icon: "📖" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login" || pathname === "/admin/guide/print") {
    return <>{children}</>;
  }

  async function handleSignOut() {
    await signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F2F0EC]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0A0A0A] border-l border-[#9BA3AA]/10 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#9BA3AA]/10 flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-400.png" alt="ELFADY" width={32} height={32} className="rounded-md object-cover" />
          <div>
            <span className="text-xl font-black text-[#9BA3AA] tracking-widest block">
              ELFADY
            </span>
            <p className="text-xs text-[#F2F0EC]/30">لوحة إدارة المعرض</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(({ href, label, icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[#9BA3AA]/15 text-[#9BA3AA]"
                    : "text-[#F2F0EC]/50 hover:bg-[#9BA3AA]/5 hover:text-[#F2F0EC]"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-[#9BA3AA]/10">
          <button
            onClick={handleSignOut}
            className="w-full text-sm text-[#F2F0EC]/40 hover:text-[#F2F0EC] py-2 transition-colors text-right"
          >
            تسجيل الخروج →
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
