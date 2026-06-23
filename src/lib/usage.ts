// ==========================================
// Token 用量日志 + 每日次数控制
// ==========================================

import { prisma } from "@/lib/prisma";
import { getDailyLimit } from "@/lib/plans";

/** 记录 AI Token 消耗 */
export async function logUsage(params: {
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}) {
  await prisma.usage.create({
    data: {
      userId: params.userId,
      model: params.model,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      totalTokens: params.inputTokens + params.outputTokens,
      cost: params.cost,
    },
  });
}

/** 检查用户每日限制 */
export async function checkDailyLimit(userId: string, plan: string): Promise<void> {
  const limit = getDailyLimit(plan);
  if (limit <= 0) return; // -1 = 无限

  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const usage = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (usage && usage.count >= limit) {
    throw new Error(`今日次数已用完（${limit}次/天），请升级会员或明天再来`);
  }
}

/** 记录每日使用次数 */
export async function incrementDailyUsage(userId: string): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);

  await prisma.dailyUsage.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, count: 1 },
    update: { count: { increment: 1 } },
  });
}

/** AI 模型成本估算（美元 / 1K tokens） */
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "deepseek-v4-flash": { input: 0.00014, output: 0.00028 },
  "deepseek-v4-pro":   { input: 0.00014, output: 0.00028 },
  "deepseek-chat":     { input: 0.00014, output: 0.00028 },
  "gpt-4o-mini":       { input: 0.00015, output: 0.0006 },
  "gpt-4o":            { input: 0.0025,  output: 0.01 },
};

/** 估算成本 */
export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const rates = MODEL_COSTS[model] || { input: 0.00014, output: 0.00028 };
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}
