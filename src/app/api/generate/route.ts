import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PROMPT_MAP } from "@/lib/prompt";
import { prisma } from "@/lib/prisma";

/**
 * AI 结构图生成 API
 * POST /api/generate
 *
 * Body: {
 *   text: string,
 *   type: "flow" | "er" | "uml" | "sequence" | "gantt" | "mindmap",
 *   userId?: string   // 登录用户 ID（可选，游客不传）
 * }
 *
 * 权限控制：
 *   - Pro 会员：无限生成
 *   - FREE 用户：消耗 credits（默认 30 次）
 *   - 游客：不可使用（需要注册）
 */

export async function POST(req: NextRequest) {
  try {
    const { text, type, userId } = await req.json();

    // ===== 参数校验 =====
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "请输入要转换的内容" },
        { status: 400 }
      );
    }

    const validTypes = Object.keys(PROMPT_MAP);
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        { error: `无效的图表类型，支持的类型：${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // ===== 用户权限校验 =====
    if (!userId) {
      // 游客不可使用 AI 生成
      return NextResponse.json(
        {
          error: "请先登录后使用 AI 生成功能",
          needLogin: true,
        },
        { status: 401 }
      );
    }

    // 查询用户
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, plan: true, credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // Pro 会员：无限使用
    if (user.plan === "PRO") {
      // 直接生成，不扣次数
    } else {
      // FREE 用户：检查剩余次数
      if (user.credits <= 0) {
        return NextResponse.json({
          error: "AI 生成次数已用完",
          needUpgrade: true,
          message: "请购买次数包或升级 Pro 会员",
        });
      }

      // 扣减次数
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      });
    }

    // ===== 调用 AI 生成 =====
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE;
    const modelName =
      process.env.AI_MODEL || process.env.OPENAI_MODEL || "deepseek-v4-pro";

    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置 AI API Key，请在 .env.local 中设置 OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
      baseURL: apiBase || undefined,
    });

    const systemPrompt = PROMPT_MAP[type];

    const res = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的技术图表生成助手。只输出 Mermaid 代码，不要加任何解释、说明或 markdown 代码块标记。",
        },
        {
          role: "user",
          content: `${systemPrompt}\n\n内容：\n${text.trim()}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    const result = res.choices[0]?.message?.content || "";

    return NextResponse.json({
      result,
      creditsRemain: user.plan === "PRO" ? -1 : Math.max(0, user.credits - 1),
      plan: user.plan,
    });
  } catch (error: unknown) {
    console.error("AI 生成失败:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `AI 服务错误：${error.message}` },
        { status: error.status || 500 }
      );
    }

    const errMsg =
      error instanceof Error ? error.message : "未知错误，请稍后重试";
    return NextResponse.json({ error: `生成失败：${errMsg}` }, { status: 500 });
  }
}
