import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ك</span>
              </div>
              <span className="text-xl font-extrabold text-white">كود ثون</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              مسابقة وطنية للبرمجة والابتكار التقني تستهدف طلاب المدارس لتنمية مهاراتهم التقنية وتشجيع الإبداع.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">الأخبار</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors">عن المسابقة</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">التسجيل</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">تسجيل الدخول</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@codethon.sa</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>920000000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} كود ثون. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
