import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin@123456", 12);

  const admin = await prisma.user.upsert({ // eslint-disable-line
    where: { email: "admin@codethon.sa" },
    update: {},
    create: {
      email: "admin@codethon.sa",
      password,
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  console.log("✅ تم إنشاء حساب المدير العام:");
  console.log(`   البريد: admin@codethon.sa`);
  console.log(`   كلمة المرور: Admin@123456`);
  console.log(`   الدور: SUPER_ADMIN`);

  // Sample news (SQLite does not support skipDuplicates)
  const newsTitles = await prisma.news.findMany({ select: { title: true } });
  const existingTitles = new Set(newsTitles.map((n) => n.title));
  const newsData = [
    { title: "افتتاح باب التسجيل في مسابقة كود ثون 2025", content: "يسعدنا الإعلان عن فتح باب التسجيل في مسابقة كود ثون للعام 2025." },
    { title: "موعد إغلاق التسجيل", content: "آخر موعد لتقديم طلبات التسجيل هو 30 مارس 2025." },
    { title: "ورشة عمل تحضيرية", content: "سيتم تنظيم ورشة عمل تحضيرية لجميع المشاركين المسجلين." },
  ];
  for (const news of newsData) {
    if (!existingTitles.has(news.title)) {
      await prisma.news.create({ data: news });
    }
  }

  console.log("✅ تم إضافة أخبار تجريبية");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
