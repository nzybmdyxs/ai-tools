import { NextRequest } from "next/server";
import OpenAI from "openai";
import { matchTemplate } from "@/lib/prompt";
import { buildPrompt } from "@/config/build-prompt";
import { sqlToMermaid } from "@/lib/sql/sql-to-mermaid";
import { fixAndValidate } from "@/lib/mermaid/fix-and-validate";
import type { DiagramType, ERNotation, GenerationMode } from "@/types/diagram";
import { prisma } from "@/lib/prisma";
import { hasUnlimitedAccess } from "@/lib/auth/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * AI 结构图生成 API — V3（三模式 + 自动校验修复）
 * POST /api/generate
 *
 * 生成模式：
 *   - ai: AI 生成 → 模板匹配 → 校验 → 修复（最多3次）
 *   - sql: SQL DDL → Mermaid ER 图转换
 *   - mermaid: 直接返回用户手写 Mermaid 代码（校验 + 修复）
 */

export async function POST(req: NextRequest) {
  try {
    const { text, type: rawType, userId, deviceId, notation, generationMode: mode } = await req.json();
    const diagramType: DiagramType = rawType || "flowchart";
    const erNotation: ERNotation = notation || "crows-foot";
    const generationMode: GenerationMode = mode || "ai";

    // ===== 参数校验 =====
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "请输入内容" }), { status: 400 });
    }

    // ===== 权限校验 =====
    const session = await getServerSession(authOptions);
    const isAdmin = hasUnlimitedAccess(session);
    if (!isAdmin) {
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, plan: true, credits: true } });
        if (!user) return new Response(JSON.stringify({ error: "用户不存在" }), { status: 404 });
        if (user.plan !== "PRO" && user.credits <= 0) {
          return new Response(JSON.stringify({ error: "次数已用完", needUpgrade: true }), { status: 402 });
        }
        if (user.plan !== "PRO") {
          await prisma.user.update({ where: { id: user.id }, data: { credits: { decrement: 1 } } });
        }
      } else if (deviceId && typeof deviceId === "string") {
        let guest = await prisma.guestUsage.findUnique({ where: { deviceId } });
        if (!guest) guest = await prisma.guestUsage.create({ data: { deviceId, exportCount: 0, aiCount: 0 } });
        if (guest.aiCount >= 3) return new Response(JSON.stringify({ error: "免费次数已用完", needLogin: true }), { status: 401 });
        await prisma.guestUsage.update({ where: { deviceId }, data: { aiCount: { increment: 1 } } });
      } else {
        return new Response(JSON.stringify({ error: "请先登录", needLogin: true }), { status: 401 });
      }
    }

    // ===== 按模式生成 Mermaid 代码 =====
    let mermaidCode: string;
    let fromTemplate = false;
    let repaired = false;

    switch (generationMode) {
      case "sql": {
        // SQL → Mermaid 直接转换（不需 AI）
        const result = sqlToMermaid(text.trim());
        mermaidCode = result.code;
        break;
      }

      case "mermaid": {
        // 直接使用用户输入的 Mermaid 代码
        mermaidCode = text.trim();
        // 清理 markdown 包裹
        mermaidCode = mermaidCode
          .replace(/```mermaid\n?/gi, "")
          .replace(/```\n?/g, "")
          .trim();
        // 仍然执行校验+修复
        break;
      }

      case "ai":
      default: {
        // AI 模式：先尝试模板匹配
        const templateCode = matchTemplate(diagramType, text.trim());
        if (templateCode) {
          mermaidCode = templateCode;
          fromTemplate = true;
        } else {
          // 调用 AI 生成
          const userPrompt = buildPrompt({ diagramType, notation: erNotation, prompt: text.trim() });
          mermaidCode = await callAI(userPrompt);
        }
        break;
      }
    }

    // ===== 自动校验 + 修复（所有模式） =====
    if (!fromTemplate) {
      const fixResult = await fixAndValidate(mermaidCode);
      mermaidCode = fixResult.code;
      repaired = fixResult.repaired;
    }

    return new Response(
      JSON.stringify({ result: mermaidCode, fromTemplate, repaired }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("生成失败:", error);
    if (error instanceof OpenAI.APIError) {
      return new Response(JSON.stringify({ error: "AI 服务错误" }), { status: error.status || 500 });
    }
    return new Response(JSON.stringify({ error: "生成失败，请稍后重试" }), { status: 500 });
  }
}

/** 调用 AI 生成（非流式，因为后面要校验修复） */
async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE;
  const modelName = process.env.AI_MODEL || "deepseek-v4-flash";

  if (!apiKey) throw new Error("未配置 AI API Key");

  const client = new OpenAI({ apiKey, baseURL: apiBase || undefined });
  const res = await client.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "system",
        content:
          "Mermaid代码专家。必须输出合法Mermaid语法。只输出代码，禁止markdown代码块、解释、注释。代码必须能通过 mermaid.parse() 校验。",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    max_tokens: 2048,
  });

  const result = res.choices[0]?.message?.content || "";
  return result
    .replace(/```mermaid\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();
}
