import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ message: "يُرجى تفعيل بريدك الإلكتروني أولاً" }, { status: 403 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
