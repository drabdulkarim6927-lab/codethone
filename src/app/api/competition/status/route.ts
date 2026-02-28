import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ registered: false });

  const participant = await prisma.participant.findUnique({ where: { userId: user.userId } });
  return NextResponse.json({ registered: !!participant, participant });
}
