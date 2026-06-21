// ==========================================
// 收藏 API
// POST /api/favorites — 添加收藏 { diagramId }
// DELETE /api/favorites — 取消收藏 { diagramId }
// GET /api/favorites — 获取收藏列表
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** 获取用户收藏列表 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // 获取关联的图表数据
    const diagramIds = favorites.map((f) => f.diagramId);
    const diagrams = await prisma.diagram.findMany({
      where: { id: { in: diagramIds } },
    });

    return NextResponse.json({ favorites, diagrams });
  } catch (error) {
    console.error("获取收藏列表失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

/** 添加收藏 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { diagramId } = await req.json();

    if (!diagramId) {
      return NextResponse.json({ error: "缺少 diagramId" }, { status: 400 });
    }

    // 检查图表是否存在
    const diagram = await prisma.diagram.findUnique({
      where: { id: diagramId },
    });

    if (!diagram) {
      return NextResponse.json({ error: "图表不存在" }, { status: 404 });
    }

    // 检查是否已收藏
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_diagramId: {
          userId: user.id,
          diagramId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, favorite: existing, message: "已收藏" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        diagramId,
      },
    });

    return NextResponse.json({ success: true, favorite });
  } catch (error) {
    console.error("添加收藏失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

/** 取消收藏 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { diagramId } = await req.json();

    if (!diagramId) {
      return NextResponse.json({ error: "缺少 diagramId" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        diagramId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("取消收藏失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
