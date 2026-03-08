// v2
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

async function getAllNews() {
  try {
    return await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const news = await getAllNews();

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="section-title">الأخبار والتحديثات</h1>
            <p className="section-subtitle">تابع آخر مستجدات مسابقة كود ثون</p>
          </div>

          {news.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">📰</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">لا توجد أخبار بعد</h2>
              <p className="text-gray-400">تابعنا قريباً للاطلاع على آخر المستجدات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div key={item.id} className="card hover:shadow-lg transition-all group">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-44 object-cover rounded-xl mb-4"
                    />
                  )}
                  <span className="badge-blue text-xs mb-3">تحديث</span>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.content}</p>
                  <p className="text-gray-400 text-xs mt-4">
                    {new Date(item.createdAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
