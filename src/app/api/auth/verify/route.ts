import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "رمز التحقق مفقود" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { verifyToken: token } });

    if (!user) {
      return NextResponse.json({ message: "رابط التفعيل غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }

    if (user.isVerified) {
      // Already verified, just return a token
      const jwt = signToken({ userId: user.id, email: user.email, role: user.role, isVerified: true });
      return NextResponse.json({ token: jwt, message: "الحساب مفعّل بالفعل" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyToken: null },
    });

    const jwt = signToken({ userId: user.id, email: user.email, role: user.role, isVerified: true });

    return NextResponse.json({ token: jwt, message: "تم تفعيل الحساب بنجاح" });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
