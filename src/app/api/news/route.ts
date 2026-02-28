import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const { title, content, imageUrl } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ message: "العنوان والمحتوى مطلوبان" }, { status: 400 });
    }

    const news = await prisma.news.create({
      data: { title, content, imageUrl: imageUrl || null },
    });
    return NextResponse.json(news, { status: 201 });
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
