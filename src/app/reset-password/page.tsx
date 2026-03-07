"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("رابط إعادة التعيين غير صالح");
    }
  }, [token]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    if (form.password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      setDone(true);
      toast.success("تم تغيير كلمة المرور بنجاح!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">رابط غير صالح</h2>
        <p className="text-gray-500 mb-6">هذا الرابط غير صالح أو منتهي الصلاحية.</p>
        <Link href="/forgot-password" className="btn-primary inline-block px-8 py-2.5">
          طلب رابط جديد
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">تم تغيير كلمة المرور!</h2>
        <p className="text-gray-500 mb-6">سيتم تحويلك لصفحة تسجيل الدخول خلال ثوانٍ...</p>
        <Link href="/login" className="btn-primary inline-block px-8 py-2.5">
          تسجيل الدخول الآن
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          كلمة المرور الجديدة
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
          required
          minLength={8}
          className="input-field"
        />
        <p className="text-xs text-gray-400 mt-1">8 أحرف على الأقل</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          تأكيد كلمة المرور
        </label>
        <input
          type="password"
          name="confirm"
          value={form.confirm}
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
            جارٍ الحفظ...
          </span>
        ) : "حفظ كلمة المرور الجديدة"}
      </button>

      <div className="text-center text-sm text-gray-500">
        <Link href="/forgot-password" className="text-blue-700 hover:underline">
          طلب رابط جديد
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900">إعادة تعيين كلمة المرور</h1>
            <p className="text-gray-500 mt-2">أدخل كلمة مرورك الجديدة أدناه</p>
          </div>

          <div className="card shadow-lg">
            <Suspense fallback={<div className="text-center py-8 text-gray-400">جارٍ التحميل...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
