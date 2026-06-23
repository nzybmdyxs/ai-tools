// ==========================================
// 公开分享 API — 切换 Diagram.public
// POST /api/diagram/share { id, public }
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isDevBypass } from "@/lib/auth/admin";
import { getDevUser } from "@/lib/auth/dev-user";

export async function POST(req: NextRequest) {
  try {
    let email: string | null = null;
    if (isDevBypass()) {
      email = getDevUser().email;
    } else {
      const session = await getServerSession(authOptions);
      email = session?.user?.email || null;
    }
    if (!email) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

    const { id, public: isPublic } = await req.json();
    if (!id) return NextResponse.json({ error: "缺少图表ID" }, { status: 400 });

    // 验证所有权
    const diagram = await prisma.diagram.findFirst({ where: { id, userId: user.id } });
    if (!diagram) return NextResponse.json({ error: "图表不存在" }, { status: 404 });

    await prisma.diagram.update({
      where: { id },
      data: { public: isPublic ?? true },
    });

    const shareUrl = isPublic === false ? null : `${process.env.NEXTAUTH_URL || ""}/tools/share/${id}`;

    return NextResponse.json({ success: true, public: isPublic ?? true, shareUrl });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
