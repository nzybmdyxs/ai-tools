// ==========================================
// 模板库 API
// GET /api/templates — 获取所有模板（可按分类筛选）
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where = category ? { category } : {};

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("获取模板列表失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
