"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  userId: number;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">ك</span>
            </div>
            <span className="text-xl font-extrabold text-blue-800">كود ثون</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-700 font-medium transition-colors hover-underline">الرئيسية</Link>
            <Link href="/news" className="text-gray-600 hover:text-blue-700 font-medium transition-colors hover-underline">الأخبار</Link>
            <Link href="/#about" className="text-gray-600 hover:text-blue-700 font-medium transition-colors hover-underline">عن المسابقة</Link>
            <Link href="/#prizes" className="text-gray-600 hover:text-blue-700 font-medium transition-colors hover-underline">الجوائز</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
                    لوحة التحكم
                  </Link>
                )}
                <Link href="/compete" className="btn-primary text-sm py-2 px-4">
                  تسجيل في المسابقة
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
                  تسجيل الدخول
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">
                  انضم الآن
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
            <Link href="/news" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>الأخبار</Link>
            <Link href="/#about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>عن المسابقة</Link>
            <Link href="/#prizes" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>الجوائز</Link>
            <div className="pt-2 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/dashboard" className="block px-4 py-2 text-blue-700 font-medium hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>لوحة التحكم</Link>
                  )}
                  <Link href="/compete" className="block px-4 py-2 text-blue-700 font-medium hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>تسجيل في المسابقة</Link>
                  <button onClick={handleLogout} className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">تسجيل الخروج</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>تسجيل الدخول</Link>
                  <Link href="/register" className="block px-4 py-2 bg-blue-700 text-white rounded-lg text-center font-medium" onClick={() => setMenuOpen(false)}>انضم الآن</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
