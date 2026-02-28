import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [totalUsers, totalParticipants, totalNews, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.participant.count(),
      prisma.news.count(),
      prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    ]);

    return NextResponse.json({ totalUsers, totalParticipants, totalNews, recentUsers });
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
