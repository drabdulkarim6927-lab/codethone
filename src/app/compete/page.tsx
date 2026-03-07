"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface UserPayload {
  userId: number;
  email: string;
  role: string;
  isVerified: boolean;
}

export default function CompetePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    nationalId: "",
    school: "",
    city: "",
    stage: "",
    ideaDesc: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as UserPayload;
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    // Check if already registered
    fetch("/api/competition/status", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.registered) setAlreadyRegistered(true);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate national ID (10 digits)
    if (!/^\d{10}$/.test(form.nationalId)) {
      toast.error("رقم الهوية الوطنية يجب أن يتكون من 10 أرقام");
      return;
    }
    // Validate phone (starts with 05, 9 or 10 digits)
    if (!/^(05\d{8}|9665\d{8})$/.test(form.phone.replace(/\s/g, ""))) {
      toast.error("يُرجى إدخال رقم جوال صحيح (مثال: 0512345678)");
      return;
    }
    // Validate full name has at least 4 parts
    const nameParts = form.fullName.trim().split(/\s+/);
    if (nameParts.length < 4) {
      toast.error("يُرجى إدخال الاسم الرباعي كاملاً (الاسم، اسم الأب، اسم الجد، اسم العائلة)");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmitting(true);
    try {
      const res = await fetch("/api/competition/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");
      setAlreadyRegistered(true);
      toast.success("تم تسجيلك في المسابقة بنجاح!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24 bg-gray-50">
          <svg className="animate-spin w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </main>
        <Footer />
      </>
    );
  }

  if (alreadyRegistered) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4 bg-gray-50">
          <div className="card max-w-lg w-full text-center shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">أنت مسجّل في المسابقة!</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              تم تسجيلك بنجاح في مسابقة كود ثون. ستتلقى تحديثات على بريدك الإلكتروني <strong className="text-blue-700">{user?.email}</strong>.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">ما الذي سيحدث بعد ذلك؟</p>
              <p>ستقوم لجنة التحكيم بمراجعة طلبك والتواصل معك قريباً.</p>
            </div>
            <Link href="/" className="btn-primary mt-6 block">
              العودة للرئيسية
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
      <main className="flex-1 py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="badge-blue mb-4 text-sm">نموذج التسجيل في المسابقة</span>
            <h1 className="text-3xl font-black text-gray-900 mt-2">سجّل في كود ثون</h1>
            <p className="text-gray-500 mt-2">أدخل بياناتك الشخصية ووصف مشروعك أو فكرتك</p>
          </div>

          <div className="card shadow-lg">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 bg-green-50 border border-green-200 rounded-xl p-3">
              <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>تم تفعيل حسابك. أكمل بياناتك للتسجيل في المسابقة.</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الرباعي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  placeholder="الاسم الأول، اسم الأب، اسم الجد، اسم العائلة"
                  required
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">مثال: محمد عبدالله خالد الأحمد</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="05XXXXXXXX"
                    required
                    className="input-field"
                    dir="ltr"
                  />
                </div>

                {/* National ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهوية الوطنية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    value={form.nationalId}
                    onChange={onChange}
                    placeholder="10 أرقام"
                    required
                    maxLength={10}
                    pattern="\d{10}"
                    className="input-field"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم المدرسة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="school"
                  value={form.school}
                  onChange={onChange}
                  placeholder="اسم المدرسة التي تدرس فيها"
                  required
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={onChange}
                    placeholder="مثال: الرياض"
                    required
                    className="input-field"
                  />
                </div>

                {/* Stage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    المرحلة الدراسية <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}
                    required
                    className="input-field"
                  >
                    <option value="">اختر المرحلة</option>
                    <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
                    <option value="المرحلة المتوسطة">المرحلة المتوسطة</option>
                    <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                  </select>
                </div>
              </div>

              {/* Idea Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  وصف الفكرة أو المشروع <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="ideaDesc"
                  value={form.ideaDesc}
                  onChange={onChange}
                  placeholder="اشرح فكرتك أو مشروعك بإيجاز: ما المشكلة التي يحلها؟ كيف تعمل؟ ما التقنيات المستخدمة؟"
                  required
                  rows={5}
                  className="input-field resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.ideaDesc.length} حرف — الحد الأدنى 100 حرف</p>
              </div>

              <button
                type="submit"
                disabled={submitting || form.ideaDesc.length < 100}
                className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جارٍ التسجيل...
                  </span>
                ) : "تسجيل في المسابقة"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
