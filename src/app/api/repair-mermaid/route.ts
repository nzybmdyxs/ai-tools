// ==========================================
// Mermaid 手动修复接口
// POST /api/repair-mermaid
// Body: { code: string, error?: string }
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { repairMermaid } from "@/lib/mermaid/repair";

export async function POST(req: NextRequest) {
  try {
    const { code, error } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "请提供 Mermaid 代码" }, { status: 400 });
    }

    const fixed = await repairMermaid(code, error || "语法错误");

    return NextResponse.json({ code: fixed, success: true });
  } catch {
    return NextResponse.json(
      { error: "修复失败，请手动调整代码" },
      { status: 500 }
    );
  }
}
