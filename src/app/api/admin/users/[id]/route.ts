import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, isAdmin } from "@/lib/auth";

const VALID_ROLES = ["MEMBER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const user = getUserFromRequest(req);
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { role } = await req.json();

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ message: "الصلاحية غير صحيحة" }, { status: 400 });
    }

    // Only SUPER_ADMIN can create another SUPER_ADMIN
    if (role === "SUPER_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "غير مصرح بمنح صلاحية المدير العام" }, { status: 403 });
    }

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
