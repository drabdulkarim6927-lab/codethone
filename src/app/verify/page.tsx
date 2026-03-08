// v2
"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Status = "loading" | "success" | "error";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("رابط التفعيل غير صحيح أو منتهي الصلاحية.");
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 3600}`;
          setStatus("success");
          setTimeout(() => router.push("/compete"), 2500);
        } else {
          setStatus("error");
          setMessage(data.message || "حدث خطأ في التفعيل.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("حدث خطأ في الاتصال بالخادم.");
      });
  }, [token, router]);

  return (
    <div className="card max-w-md w-full text-center shadow-lg">
      {status === "loading" && (
        <>
          <div className="flex justify-center mb-6">
            <svg className="animate-spin w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">جارٍ التحقق من حسابك...</h2>
          <p className="text-gray-500 mt-2">يُرجى الانتظار</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">تم تفعيل حسابك بنجاح!</h2>
          <p className="text-gray-500 mb-2">
            سيتم تحويلك إلى نموذج التسجيل في المسابقة...
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
          <Link href="/compete" className="btn-primary mt-6 block">
            انتقل لتسجيل المسابقة الآن
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">فشل التفعيل</h2>
          <p className="text-gray-500 mb-6">{message}</p>
          <div className="flex flex-col gap-3">
            <Link href="/register" className="btn-primary">إنشاء حساب جديد</Link>
            <Link href="/login" className="btn-secondary">تسجيل الدخول</Link>
          </div>
        </>
      )}
    </div>
  );
}

const LoadingCard = () => (
  <div className="card max-w-md w-full text-center shadow-lg">
    <div className="flex justify-center mb-6">
      <svg className="animate-spin w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
    <p className="text-gray-500">جارٍ التحميل...</p>
  </div>
);

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-4 bg-gray-50">
        <Suspense fallback={<LoadingCard />}>
          <VerifyContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
