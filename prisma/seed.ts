import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin@123456", 12);

  await prisma.user.upsert({
    where: { email: "admin@codethon.sa" },
    update: {},
    create: {
      email: "admin@codethon.sa",
      password,
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  console.log("✅ تم إنشاء حساب المدير العام: admin@codethon.sa / Admin@123456");

  await prisma.news.createMany({
    skipDuplicates: true,
    data: [
      { title: "افتتاح باب التسجيل في مسابقة كود ثون 2025", content: "يسعدنا الإعلان عن فتح باب التسجيل في مسابقة كود ثون للعام 2025. المسابقة متاحة لجميع طلاب المدارس المتوسطة والثانوية." },
      { title: "موعد إغلاق التسجيل", content: "آخر موعد لتقديم طلبات التسجيل هو 30 مارس 2025. يرجى التأكد من استيفاء جميع البيانات المطلوبة." },
      { title: "ورشة عمل تحضيرية", content: "سيتم تنظيم ورشة عمل تحضيرية لجميع المشاركين المسجلين في المسابقة." },
    ],
  });

  console.log("✅ تم إضافة أخبار تجريبية");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
