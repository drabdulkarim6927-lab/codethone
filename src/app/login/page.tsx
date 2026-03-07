"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");

      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 3600}`;

      if (!data.user.isVerified) {
        toast("تم تسجيل الدخول، لكن بريدك الإلكتروني لم يُفعَّل بعد. يُنصح بتفعيله لضمان استمرارية حسابك.", {
          icon: "⚠️",
          duration: 6000,
        });
      } else {
        toast.success("تم تسجيل الدخول بنجاح!");
      }

      const role = data.user.role;
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/compete");
      }
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <span className="text-white font-black text-2xl">ك</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900">تسجيل الدخول</h1>
            <p className="text-gray-500 mt-2">أهلاً بك مجدداً في كود ثون</p>
          </div>

          <div className="card shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="example@email.com"
                  required
                  className="input-field"
                  dir="ltr"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">كلمة المرور</label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-base py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جارٍ تسجيل الدخول...
                  </span>
                ) : "تسجيل الدخول"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-blue-700 font-semibold hover:underline">
                أنشئ حساباً مجانياً
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
