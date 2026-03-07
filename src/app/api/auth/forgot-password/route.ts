import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateToken } from "@/lib/helpers";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    // Always return success to avoid user enumeration
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const resetToken = generateToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      await sendPasswordResetEmail(email, resetToken, baseUrl);
    }

    return NextResponse.json({
      message: "إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة لإعادة تعيين كلمة المرور خلال دقائق.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
