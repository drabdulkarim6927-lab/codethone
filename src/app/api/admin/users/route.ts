import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        participant: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
