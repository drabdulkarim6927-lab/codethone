import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "الرمز وكلمة المرور مطلوبان" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "الرابط غير صالح أو منتهي الصلاحية. يُرجى طلب رابط جديد." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
