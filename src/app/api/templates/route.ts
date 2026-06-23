// ==========================================
// 模板库 API — V2: 含浏览/使用计数
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const trackView = searchParams.get("view"); // 记录浏览

    if (trackView) {
      await prisma.template.update({
        where: { id: trackView },
        data: { views: { increment: 1 } },
      }).catch(() => {});
    }

    const where = category ? { category } : {};
    const templates = await prisma.template.findMany({
      where,
      orderBy: { views: "desc" },
    });

    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

/** 记录模板使用 */
export async function POST(req: NextRequest) {
  try {
    const { templateId } = await req.json();
    if (templateId) {
      await prisma.template.update({
        where: { id: templateId },
        data: { uses: { increment: 1 } },
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
