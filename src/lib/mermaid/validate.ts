// ==========================================
// Mermaid 语法校验器
// 使用 mermaid.parse() 服务端验证代码合法性
// ==========================================

import mermaid from "mermaid";

let initialized = false;

function initMermaid() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
  });
  initialized = true;
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

/** 校验 Mermaid 代码语法 */
export async function validateMermaid(code: string): Promise<ValidationResult> {
  try {
    initMermaid();
    await mermaid.parse(code);
    return { valid: true, error: null };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
