"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const { error } = await signIn.email({ email, password });
    if (error) {
      toast.error("بيانات خاطئة. تحقق من الإيميل وكلمة السر.");
      setLoading(false);
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#9BA3AA] tracking-widest">ELFADY</h1>
          <p className="text-[#F2F0EC]/40 text-sm mt-2">لوحة الإدارة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#F2F0EC]/60 mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@elfady.com"
              className="w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-4 py-3 text-[#F2F0EC] text-sm placeholder:text-[#F2F0EC]/20 focus:outline-none focus:border-[#9BA3AA]/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#F2F0EC]/60 mb-1.5">
              كلمة السر
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#111111] border border-[#9BA3AA]/20 rounded-lg px-4 py-3 text-[#F2F0EC] text-sm placeholder:text-[#F2F0EC]/20 focus:outline-none focus:border-[#9BA3AA]/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#9BA3AA] hover:bg-[#7d858c] disabled:opacity-50 text-[#0A0A0A] font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
