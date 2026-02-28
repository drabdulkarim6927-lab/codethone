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
    return NextResponse.json(participants);
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
