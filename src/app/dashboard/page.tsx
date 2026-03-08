"use client";
// Dashboard v2
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ROLE_LABELS } from "@/lib/constants";

type Tab = "overview" | "users" | "participants" | "news";

interface Stats {
  totalUsers: number;
  totalParticipants: number;
  totalNews: number;
  recentUsers: number;
}

interface User {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  participant: { fullName: string } | null;
}

interface Participant {
  id: number;
  fullName: string;
  phone: string;
  nationalId: string;
  school: string;
  city: string;
  stage: string;
  ideaDesc: string;
  createdAt: string;
  user: { email: string };
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const [newsModal, setNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: "", content: "", imageUrl: "" });
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);

  const getToken = () => localStorage.getItem("token");

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  }), []);

  const loadStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats", { headers: authHeaders() });
    if (res.ok) setStats(await res.json());
  }, [authHeaders]);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users", { headers: authHeaders() });
    if (res.ok) setUsers(await res.json());
  }, [authHeaders]);

  const loadParticipants = useCallback(async () => {
    const res = await fetch("/api/admin/participants", { headers: authHeaders() });
    if (res.ok) setParticipants(await res.json());
  }, [authHeaders]);

  const loadNews = useCallback(async () => {
    const res = await fetch("/api/news");
    if (res.ok) setNewsList(await res.json());
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
        router.push("/");
        return;
      }
      setAdminUser({ email: payload.email, role: payload.role });
    } catch {
      router.push("/login");
      return;
    }
    loadStats();
  }, [router, loadStats]);

  useEffect(() => {
    if (tab === "users") loadUsers();
    else if (tab === "participants") loadParticipants();
    else if (tab === "news") loadNews();
  }, [tab, loadUsers, loadParticipants, loadNews]);

  async function changeRole(userId: number, role: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      toast.success("تم تحديث الصلاحية");
      loadUsers();
    } else {
      toast.error("حدث خطأ");
    }
  }

  async function handleNewsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const method = editingNewsId ? "PUT" : "POST";
    const url = editingNewsId ? `/api/news/${editingNewsId}` : "/api/news";
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(newsForm),
    });
    if (res.ok) {
      toast.success(editingNewsId ? "تم تحديث الخبر" : "تم إضافة الخبر");
      setNewsModal(false);
      setNewsForm({ title: "", content: "", imageUrl: "" });
      setEditingNewsId(null);
      loadNews();
    } else {
      toast.error("حدث خطأ");
    }
  }

  async function deleteNews(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا الخبر؟")) return;
    const res = await fetch(`/api/news/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      toast.success("تم حذف الخبر");
      loadNews();
    }
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: "نظرة عامة", icon: "📊" },
    { key: "users", label: "الأعضاء", icon: "👥" },
    { key: "participants", label: "المشاركون", icon: "🏆" },
    { key: "news", label: "الأخبار", icon: "📰" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-lg">ك</div>
            <div>
              <p className="font-bold">كود ثون</p>
              <p className="text-blue-300 text-xs">لوحة التحكم</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === t.key ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="text-xs text-blue-300">
            <p className="font-medium text-white truncate">{adminUser?.email}</p>
            <p className="mt-1">{ROLE_LABELS[adminUser?.role || ""] || adminUser?.role}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              router.push("/");
            }}
            className="mt-3 w-full text-right text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            تسجيل الخروج →
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Mobile tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto md:hidden">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.key ? "bg-blue-700 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-6">نظرة عامة</h1>
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                  { label: "إجمالي الأعضاء", value: stats.totalUsers, icon: "👥", color: "blue" },
                  { label: "المشاركون في المسابقة", value: stats.totalParticipants, icon: "🏆", color: "green" },
                  { label: "الأخبار والتحديثات", value: stats.totalNews, icon: "📰", color: "orange" },
                  { label: "أعضاء هذا الأسبوع", value: stats.recentUsers, icon: "🆕", color: "purple" },
                ].map((s) => (
                  <div key={s.label} className="card hover:shadow-lg transition-shadow">
                    <div className="text-3xl mb-3">{s.icon}</div>
                    <p className="text-3xl font-black text-gray-900">{s.value}</p>
                    <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">روابط سريعة</h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setTab("users")} className="btn-secondary text-sm py-3">إدارة الأعضاء</button>
                <button onClick={() => setTab("participants")} className="btn-secondary text-sm py-3">عرض المشاركين</button>
                <button onClick={() => { setTab("news"); setNewsModal(true); }} className="btn-primary text-sm py-3">إضافة خبر</button>
                <button onClick={() => setTab("news")} className="btn-secondary text-sm py-3">إدارة الأخبار</button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">الأعضاء المسجلون</h1>
              <span className="badge-blue">{users.length} عضو</span>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>البريد الإلكتروني</th>
                    <th>الحالة</th>
                    <th>الدور</th>
                    <th>مشارك؟</th>
                    <th>تاريخ التسجيل</th>
                    <th>تعديل الصلاحية</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="text-gray-400">{u.id}</td>
                      <td className="font-medium" dir="ltr">{u.email}</td>
                      <td>
                        <span className={u.isVerified ? "badge-green" : "badge-red"}>
                          {u.isVerified ? "مفعّل" : "غير مفعّل"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.role === "SUPER_ADMIN" ? "badge-purple" : u.role === "ADMIN" ? "badge-blue" : u.role === "MODERATOR" ? "badge-orange" : "badge-green"}`}>
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td>{u.participant ? <span className="badge-green">نعم</span> : <span className="text-gray-400 text-sm">لا</span>}</td>
                      <td className="text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString("ar-SA")}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="MEMBER">عضو</option>
                          <option value="MODERATOR">مشرف</option>
                          <option value="ADMIN">مدير</option>
                          <option value="SUPER_ADMIN">مدير عام</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12 text-gray-400">لا يوجد أعضاء بعد</div>
              )}
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {tab === "participants" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">المشاركون في المسابقة</h1>
              <div className="flex gap-3">
                <span className="badge-green">{participants.length} مشارك</span>
                <a
                  href="/api/admin/participants/export"
                  className="btn-secondary text-sm py-2 px-4"
                  download
                >
                  تصدير CSV
                </a>
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم الرباعي</th>
                    <th>البريد الإلكتروني</th>
                    <th>الجوال</th>
                    <th>رقم الهوية</th>
                    <th>المدرسة</th>
                    <th>المدينة</th>
                    <th>المرحلة</th>
                    <th>الفكرة / المشروع</th>
                    <th>تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.id}>
                      <td className="text-gray-400">{p.id}</td>
                      <td className="font-medium">{p.fullName}</td>
                      <td dir="ltr" className="text-sm">{p.user.email}</td>
                      <td dir="ltr">{p.phone}</td>
                      <td dir="ltr">{p.nationalId}</td>
                      <td>{p.school}</td>
                      <td>{p.city}</td>
                      <td><span className="badge-blue text-xs">{p.stage}</span></td>
                      <td className="max-w-xs">
                        <p className="truncate text-sm text-gray-600" title={p.ideaDesc}>{p.ideaDesc}</p>
                      </td>
                      <td className="text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString("ar-SA")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {participants.length === 0 && (
                <div className="text-center py-12 text-gray-400">لا يوجد مشاركون بعد</div>
              )}
            </div>
          </div>
        )}

        {/* News Tab */}
        {tab === "news" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">إدارة الأخبار</h1>
              <button
                onClick={() => { setNewsForm({ title: "", content: "", imageUrl: "" }); setEditingNewsId(null); setNewsModal(true); }}
                className="btn-primary text-sm py-2 px-5"
              >
                + إضافة خبر
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {newsList.map((n) => (
                <div key={n.id} className="card hover:shadow-lg transition-shadow">
                  {n.imageUrl && (
                    <img src={n.imageUrl} alt={n.title} className="w-full h-36 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="font-bold text-gray-900 mb-2">{n.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3">{n.content}</p>
                  <p className="text-gray-400 text-xs mt-3">{new Date(n.createdAt).toLocaleDateString("ar-SA")}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setNewsForm({ title: n.title, content: n.content, imageUrl: n.imageUrl || "" });
                        setEditingNewsId(n.id);
                        setNewsModal(true);
                      }}
                      className="btn-secondary text-xs py-2 px-3 flex-1"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => deleteNews(n.id)}
                      className="text-xs py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
              {newsList.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400">لا توجد أخبار بعد</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* News Modal */}
      {newsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingNewsId ? "تعديل خبر" : "إضافة خبر جديد"}</h2>
              <button onClick={() => setNewsModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleNewsSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان الخبر *</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="input-field"
                  placeholder="عنوان الخبر أو التحديث"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">المحتوى *</label>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm((p) => ({ ...p, content: e.target.value }))}
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="محتوى الخبر أو التحديث"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رابط الصورة (اختياري)</label>
                <input
                  type="url"
                  value={newsForm.imageUrl}
                  onChange={(e) => setNewsForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                  dir="ltr"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 py-3">
                  {editingNewsId ? "حفظ التعديلات" : "نشر الخبر"}
                </button>
                <button type="button" onClick={() => setNewsModal(false)} className="btn-secondary py-3 px-5">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
