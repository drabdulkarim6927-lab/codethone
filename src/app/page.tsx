import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

async function getLatestNews() {
  try {
    return await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const news = await getLatestNews();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }} />
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              التسجيل مفتوح الآن!
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              كود <span className="text-orange-400">ثون</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 font-medium">
              مسابقة البرمجة والابتكار التقني الوطنية
            </p>
            <p className="text-base md:text-lg text-blue-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              أطلق إبداعك التقني، وشارك في أكبر مسابقة برمجية للطلاب على مستوى المملكة.
              فرصتك لتُثبت موهبتك وتفوز بجوائز قيّمة!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-accent text-lg py-4 px-10 shadow-xl shadow-orange-500/30">
                سجّل الآن مجاناً
              </Link>
              <Link href="#about" className="btn-secondary border-white/50 text-white hover:bg-white/10 text-lg py-4 px-10">
                اعرف أكثر
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-xl mx-auto">
              {[
                { label: "مشارك مسجل", value: "500+" },
                { label: "مدرسة", value: "50+" },
                { label: "جائزة نقدية", value: "100,000 ريال" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-blue-200 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-title">ما هو كود ثون؟</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                منصة وطنية تُتيح للطلاب الموهوبين إبراز مهاراتهم التقنية والإبداعية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "💻",
                  title: "البرمجة والتطوير",
                  desc: "أطوّر تطبيقاتك ومواقعك وحلولك البرمجية المبتكرة وقدّمها أمام لجنة متخصصة.",
                },
                {
                  icon: "🤖",
                  title: "الذكاء الاصطناعي",
                  desc: "استخدم تقنيات الذكاء الاصطناعي لحل مشكلات حقيقية تخدم المجتمع.",
                },
                {
                  icon: "🚀",
                  title: "الابتكار والريادة",
                  desc: "قدّم فكرتك الريادية وأثبت قدرتك على تحويل الأفكار إلى واقع ملموس.",
                },
              ].map((item) => (
                <div key={item.title} className="card hover:shadow-lg transition-shadow text-center group">
                  <div className="text-5xl mb-5 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to participate */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-title">كيف تشارك؟</h2>
              <p className="section-subtitle">أربع خطوات بسيطة للانضمام إلى المسابقة</p>
            </div>

            <div className="relative">
              <div className="absolute top-8 right-[30px] left-[30px] h-0.5 bg-blue-200 hidden md:block" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: "1", title: "إنشاء حساب", desc: "سجّل بريدك الإلكتروني وكلمة المرور" },
                  { step: "2", title: "تفعيل البريد", desc: "تحقق من بريدك وفعّل حسابك" },
                  { step: "3", title: "تعبئة النموذج", desc: "أدخل بياناتك وفكرتك أو مشروعك" },
                  { step: "4", title: "انتظر النتائج", desc: "سيتم التواصل معك من قِبل اللجنة" },
                ].map((item) => (
                  <div key={item.step} className="relative text-center">
                    <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg shadow-blue-200 relative z-10">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/register" className="btn-primary text-lg py-4 px-10">
                ابدأ التسجيل الآن
              </Link>
            </div>
          </div>
        </section>

        {/* Prizes Section */}
        <section id="prizes" className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-title">الجوائز</h2>
              <p className="section-subtitle">جوائز قيّمة تنتظر المتميزين</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { place: "🥇", rank: "المركز الأول", prize: "50,000 ريال", bg: "from-yellow-50 to-orange-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800" },
                { place: "🥈", rank: "المركز الثاني", prize: "30,000 ريال", bg: "from-gray-50 to-slate-50", border: "border-gray-200", badge: "bg-gray-200 text-gray-800" },
                { place: "🥉", rank: "المركز الثالث", prize: "20,000 ريال", bg: "from-orange-50 to-amber-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" },
              ].map((p) => (
                <div key={p.rank} className={`card bg-gradient-to-b ${p.bg} border ${p.border} text-center hover:shadow-xl transition-all`}>
                  <div className="text-6xl mb-4">{p.place}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{p.rank}</h3>
                  <div className={`inline-block px-5 py-2 rounded-full font-black text-2xl ${p.badge}`}>
                    {p.prize}
                  </div>
                  <p className="text-gray-500 text-sm mt-3">+ شهادة تقدير وميدالية</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        {news.length > 0 && (
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="section-title">آخر الأخبار</h2>
                  <p className="section-subtitle">تابع آخر مستجدات المسابقة</p>
                </div>
                <Link href="/news" className="text-blue-700 font-semibold hover:underline">عرض الكل ←</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.map((item) => (
                  <div key={item.id} className="card hover:shadow-lg transition-all group">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <span className="badge-blue text-xs mb-3">خبر</span>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.content}</p>
                    <p className="text-gray-400 text-xs mt-4">
                      {new Date(item.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="py-16 px-4 hero-gradient text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">جاهز للتحدي؟</h2>
            <p className="text-blue-200 mb-8 text-lg">سجّل الآن وكن جزءاً من أكبر مسابقة برمجية للطلاب!</p>
            <Link href="/register" className="btn-accent text-lg py-4 px-12 shadow-xl shadow-orange-500/30">
              سجّل مجاناً الآن
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
