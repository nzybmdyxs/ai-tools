// ==========================================
// 图表历史 CRUD API
// GET /api/diagrams — 获取用户的所有图表
// POST /api/diagrams — 保存新图表
// DELETE /api/diagrams?id=xxx — 删除图表
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** 获取用户的历史图表列表 */
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // 获取单个图表
    if (id) {
      const diagram = await prisma.diagram.findFirst({
        where: { id, userId: user.id },
      });

      if (!diagram) {
        return NextResponse.json({ error: "图表不存在" }, { status: 404 });
      }

      return NextResponse.json({ diagram });
    }

    // 获取列表
    const diagrams = await prisma.diagram.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ diagrams });
  } catch (error) {
    console.error("获取图表列表失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

/** 保存新图表 */
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

    const body = await req.json();
    const { title, type, prompt, result } = body;

    if (!title || !type || !result) {
      return NextResponse.json(
        { error: "缺少必填字段：title, type, result" },
        { status: 400 }
      );
    }

    const diagram = await prisma.diagram.create({
      data: {
        userId: user.id,
        title: title.slice(0, 200),
        type,
        prompt: prompt?.slice(0, 2000) || "",
        result,
      },
    });

    return NextResponse.json({ success: true, diagram });
  } catch (error) {
    console.error("保存图表失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

/** 删除图表 */
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少图表 ID" }, { status: 400 });
    }

    // 验证图表属于当前用户
    const diagram = await prisma.diagram.findFirst({
      where: { id, userId: user.id },
    });

    if (!diagram) {
      return NextResponse.json({ error: "图表不存在" }, { status: 404 });
    }

    // 同时删除关联的收藏
    await prisma.favorite.deleteMany({
      where: { diagramId: id },
    });

    await prisma.diagram.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除图表失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
