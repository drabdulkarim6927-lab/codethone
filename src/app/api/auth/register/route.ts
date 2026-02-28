import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { generateToken } from "@/lib/helpers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "البريد الإلكتروني مسجل مسبقاً" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = generateToken();

    await prisma.user.create({
      data: { email, password: hashedPassword, verifyToken },
    });

    const baseUrl = req.headers.get("origin") || "http://localhost:3000";
    await sendVerificationEmail(email, verifyToken, baseUrl);

    return NextResponse.json({ message: "تم إنشاء الحساب. يُرجى تفعيل بريدك الإلكتروني." }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
