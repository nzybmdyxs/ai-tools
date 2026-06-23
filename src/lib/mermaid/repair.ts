// ==========================================
// Mermaid 代码自动修复器
// 将报错代码发给 AI，要求修复后返回
// ==========================================

/** 用 AI 修复 Mermaid 语法错误 */
export async function repairMermaid(
  code: string,
  error: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE;
  const modelName = process.env.AI_MODEL || "deepseek-v4-flash";

  if (!apiKey) {
    throw new Error("未配置 AI API Key，无法自动修复");
  }

  const prompt = `你是 Mermaid 专家。

下面 Mermaid 代码无法通过 mermaid.parse() 校验。

错误信息：
${error}

请修复代码。要求：
1. 必须符合 Mermaid 官方语法
2. 保持原有含义不变
3. 仅返回 Mermaid 代码
4. 不要任何解释、markdown 标记或代码块

原代码：
${code}`;

  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey, baseURL: apiBase || undefined });

  const res = await client.chat.completions.create({
    model: modelName,
    messages: [
      { role: "system", content: "Mermaid代码修复专家。只返回修复后的Mermaid代码。" },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    max_tokens: 2048,
  });

  const result = res.choices[0]?.message?.content || code;
  // 清理可能的 markdown 包裹
  return result
    .replace(/```mermaid\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();
}
