// ==========================================
// 图表类型定义 — V2: 12 种类型，配置驱动
// ==========================================

export type DiagramType =
  | "flowchart"
  | "er"
  | "dfd"
  | "usecase"
  | "class"
  | "sequence"
  | "state"
  | "function"
  | "architecture"
  | "microservice"
  | "gantt"
  | "mindmap";

export type GenerationMode = "ai" | "sql" | "mermaid";

export type ERNotation = "crows-foot" | "chen";
