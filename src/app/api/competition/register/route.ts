import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ message: "يُرجى تسجيل الدخول أولاً" }, { status: 401 });
    }

    const { fullName, phone, nationalId, school, city, stage, ideaDesc } = await req.json();

    if (!fullName || !phone || !nationalId || !school || !city || !stage || !ideaDesc) {
      return NextResponse.json({ message: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    if (ideaDesc.length < 100) {
      return NextResponse.json({ message: "وصف الفكرة يجب أن يكون 100 حرف على الأقل" }, { status: 400 });
    }

    const existing = await prisma.participant.findUnique({ where: { userId: user.userId } });
    if (existing) {
      return NextResponse.json({ message: "أنت مسجل في المسابقة مسبقاً" }, { status: 409 });
    }

    const participant = await prisma.participant.create({
      data: { userId: user.userId, fullName, phone, nationalId, school, city, stage, ideaDesc },
    });

    return NextResponse.json({ message: "تم التسجيل في المسابقة بنجاح", participant }, { status: 201 });
  } catch (error) {
    console.error("Competition register error:", error);
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
