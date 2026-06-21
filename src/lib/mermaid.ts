import mermaid from "mermaid";

/**
 * Mermaid 初始化配置
 */
export function initMermaid() {
  mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
    fontFamily: "Arial, sans-serif",
  });
}

/**
 * 清理 Mermaid 代码块（去掉可能的 markdown 代码块标记）
 */
export function cleanMermaidCode(code: string): string {
  let cleaned = code.trim();

  // 去掉可能的 ```mermaid 和 ``` 标记
  const codeBlockMatch = cleaned.match(
    /```(?:mermaid)?\s*\n?([\s\S]*?)```/
  );
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  return cleaned;
}

/**
 * 重新渲染页面中的 Mermaid 图表
 */
export async function renderMermaid() {
  // 给浏览器一点时间渲染 DOM
  await new Promise((resolve) => setTimeout(resolve, 100));
  try {
    await mermaid.run({
      querySelector: ".mermaid",
    });
  } catch (e) {
    console.error("Mermaid 渲染失败:", e);
  }
}
