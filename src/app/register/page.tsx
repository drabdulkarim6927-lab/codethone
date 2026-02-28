"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    if (form.password.length < 8) {
      toast.error("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      setSuccess(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4 bg-gray-50">
          <div className="card max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">تحقق من بريدك الإلكتروني</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              تم إرسال رابط التفعيل إلى <strong className="text-blue-700">{form.email}</strong>.
              يُرجى فتح بريدك الإلكتروني والضغط على الرابط لتفعيل حسابك.
            </p>
            <p className="text-sm text-gray-400 bg-gray-50 p-3 rounded-lg">
              لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
            </p>
            <Link href="/login" className="btn-primary mt-6 block text-center">
              انتقل لتسجيل الدخول
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
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
            <h1 className="text-3xl font-black text-gray-900">إنشاء حساب</h1>
            <p className="text-gray-500 mt-2">انضم إلى منصة كود ثون مجاناً</p>
          </div>

          <div className="card shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني <span className="text-red-500">*</span>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="8 أحرف على الأقل"
                  required
                  minLength={8}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  placeholder="أعد كتابة كلمة المرور"
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
                    جارٍ إنشاء الحساب...
                  </span>
                ) : "إنشاء الحساب"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-blue-700 font-semibold hover:underline">
                سجّل الدخول
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            بإنشاء حساب، فأنت توافق على شروط الاستخدام وسياسة الخصوصية
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
