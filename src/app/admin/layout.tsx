"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "الداشبورد", icon: "📊" },
  { href: "/admin/home", label: "محتوى الرئيسية", icon: "🏠" },
  { href: "/admin/products", label: "السيارات", icon: "🚗" },
  { href: "/admin/orders", label: "طلبات الحجز", icon: "🧾" },
  { href: "/admin/reviews", label: "التقييمات", icon: "⭐" },
  { href: "/admin/categories", label: "الأقسام", icon: "🏷️" },
  { href: "/admin/shipping", label: "الشحن", icon: "🚚" },
  { href: "/admin/discounts", label: "الخصومات", icon: "🎁" },
  { href: "/admin/banners", label: "البانرات", icon: "🖼️" },
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
    <div className="flex min-h-screen bg-[#0F0C0A] text-[#F5EFE0]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0A0806] border-l border-[#C9A84C]/10 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#C9A84C]/10">
          <span className="text-2xl font-black text-[#C9A84C] tracking-widest">
            ELFADY
          </span>
          <p className="text-xs text-[#F5EFE0]/30 mt-1">لوحة إدارة المعرض</p>
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
                    ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "text-[#F5EFE0]/50 hover:bg-[#C9A84C]/5 hover:text-[#F5EFE0]"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-[#C9A84C]/10">
          <button
            onClick={handleSignOut}
            className="w-full text-sm text-[#F5EFE0]/40 hover:text-[#F5EFE0] py-2 transition-colors text-right"
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
