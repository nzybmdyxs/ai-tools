// ==========================================
// 自动校验 + 自动修复（最多 3 次重试）
// AI生成 → 校验 → 失败则AI修复 → 再校验 → 循环
// ==========================================

import { validateMermaid } from "./validate";
import { repairMermaid } from "./repair";

export interface FixResult {
  success: boolean;
  code: string;
  repaired: boolean;
  attempts: number;
  error?: string;
}

/**
 * 校验 + 自动修复 Mermaid 代码
 * 最多尝试 3 次修复
 */
export async function fixAndValidate(code: string): Promise<FixResult> {
  let current = code;
  let repaired = false;

  for (let i = 0; i < 3; i++) {
    const validation = await validateMermaid(current);

    if (validation.valid) {
      return {
        success: true,
        code: current,
        repaired,
        attempts: i + 1,
      };
    }

    // 尝试修复
    try {
      current = await repairMermaid(current, validation.error || "语法错误");
      repaired = true;
    } catch {
      // 修复失败，返回当前代码
      return {
        success: false,
        code: current,
        repaired,
        attempts: i + 1,
        error: validation.error || "修复失败",
      };
    }
  }

  // 3 次修复后仍失败
  const finalCheck = await validateMermaid(current);
  return {
    success: finalCheck.valid,
    code: current,
    repaired,
    attempts: 3,
    error: finalCheck.error || undefined,
  };
}
