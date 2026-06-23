// ==========================================
// 输入类型检测 — 规则引擎优先（零 AI 成本）
// ==========================================

export type InputType = "SQL" | "JSON" | "OPENAPI" | "JAVA" | "SPRING" | "MARKDOWN" | "MERMAID" | "TEXT";

/** 检测用户输入类型 */
export function detectInputType(text: string): InputType {
  const upper = text.toUpperCase().trim();

  if (
    upper.includes("CREATE TABLE") ||
    upper.includes("ALTER TABLE") ||
    upper.includes("INSERT INTO") ||
    (upper.includes("PRIMARY KEY") && upper.includes("VARCHAR"))
  ) return "SQL";

  if (text.includes("openapi:") || text.includes("swagger:") || text.includes('"openapi"'))
    return "OPENAPI";

  if (
    (upper.includes("@RESTCONTROLLER") || upper.includes("@CONTROLLER")) &&
    (upper.includes("@SERVICE") || upper.includes("@REPOSITORY") || upper.includes("@COMPONENT"))
  ) return "SPRING";

  if (
    upper.includes("@ENTITY") ||
    upper.includes("@TABLE") ||
    (upper.includes("PUBLIC CLASS") && upper.includes("PRIVATE "))
  ) return "JAVA";

  if (text.trim().startsWith("# ") && text.includes("\n")) return "MARKDOWN";

  if (
    (text.includes("{") && text.includes("}") && text.includes(":")) ||
    text.trim().startsWith("{")
  ) return "JSON";

  if (
    upper.startsWith("ERDIAGRAM") || upper.startsWith("GRAPH ") ||
    upper.startsWith("CLASS") || upper.startsWith("SEQUENCE") ||
    upper.startsWith("GANTT") || upper.startsWith("MINDMAP") ||
    upper.startsWith("STATE") || upper.startsWith("FLOWCHART")
  ) return "MERMAID";

  return "TEXT";
}
