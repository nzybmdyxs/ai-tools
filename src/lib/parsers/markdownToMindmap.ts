// ==========================================
// Markdown → 思维导图（零 AI 成本）
// ==========================================

/** Markdown 标题层级 → Mermaid mindmap */
export function markdownToMindmap(md: string): { code: string } {
  const lines = md.split("\n");
  let mermaid = "mindmap\n";
  let root = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      root = trimmed.replace(/^#\s+/, "");
      mermaid += `  ${root}\n`;
    } else if (trimmed.startsWith("## ") && root) {
      mermaid += `    ${trimmed.replace(/^##\s+/, "")}\n`;
    } else if (trimmed.startsWith("### ") && root) {
      mermaid += `      ${trimmed.replace(/^###\s+/, "")}\n`;
    } else if (trimmed.startsWith("#### ") && root) {
      mermaid += `        ${trimmed.replace(/^####\s+/, "")}\n`;
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      mermaid += `      ${trimmed.replace(/^[-*]\s+/, "")}\n`;
    }
  }

  if (!root) {
    return { code: "mindmap\n  % 未找到 Markdown 标题" };
  }

  return { code: mermaid.trim() };
}
