import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const participants = await prisma.participant.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });

    const header = "ID,الاسم الرباعي,البريد الإلكتروني,الجوال,رقم الهوية,المدرسة,المدينة,المرحلة,وصف الفكرة,تاريخ التسجيل\n";
    const rows = participants
      .map((p) =>
        [
          p.id,
          `"${p.fullName}"`,
          p.user.email,
          p.phone,
          p.nationalId,
          `"${p.school}"`,
          `"${p.city}"`,
          `"${p.stage}"`,
          `"${p.ideaDesc.replace(/"/g, '""')}"`,
          new Date(p.createdAt).toLocaleDateString("ar-SA"),
        ].join(",")
      )
      .join("\n");

    const csv = "\uFEFF" + header + rows; // BOM for Excel Arabic support

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="codethon-participants-${Date.now()}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
