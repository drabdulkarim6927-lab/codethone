import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, isAdmin } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { title, content, imageUrl } = await req.json();
    const news = await prisma.news.update({
      where: { id: Number(id) },
      data: { title, content, imageUrl: imageUrl || null },
    });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.news.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "تم الحذف" });
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
