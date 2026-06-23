// ==========================================
// 统一图表生成入口 — 规则引擎优先
// SQL/JSON/OpenAPI → 零成本直接转换
// 其他 → AI 生成
// ==========================================

import { detectInputType } from "@/lib/detect-input";
import { sqlToMermaid } from "@/lib/sql/sql-to-mermaid";
import { jsonToClassDiagram } from "@/lib/parsers/jsonToClassDiagram";
import { openapiToArchitecture } from "@/lib/parsers/openapiToArchitecture";
import { javaToUml } from "@/lib/parsers/javaToUml";
import { springBootArchitecture } from "@/lib/parsers/springBootArchitecture";
import { markdownToMindmap } from "@/lib/parsers/markdownToMindmap";

export interface GenerateResult {
  code: string;
  mode: "sql" | "json" | "openapi" | "java" | "spring" | "markdown" | "mermaid" | "ai";
  zeroCost: boolean;
  stats?: { tables?: number; classes?: number; endpoints?: number };
}

/** 统一生成入口：先规则匹配，未命中再用 AI */
export async function generateDiagram(
  input: string,
  aiGenerator?: (prompt: string) => Promise<string>,
): Promise<GenerateResult> {
  const inputType = detectInputType(input.trim());

  switch (inputType) {
    case "SQL": {
      const r = sqlToMermaid(input.trim());
      return { code: r.code, mode: "sql", zeroCost: true, stats: { tables: r.tables } };
    }
    case "JSON": {
      const r = jsonToClassDiagram(input.trim());
      return { code: r.code, mode: "json", zeroCost: true, stats: { classes: r.classes } };
    }
    case "OPENAPI": {
      const r = openapiToArchitecture(input.trim());
      return { code: r.code, mode: "openapi", zeroCost: true, stats: { endpoints: r.endpoints } };
    }
    case "JAVA": {
      const r = javaToUml(input.trim());
      return { code: r.code, mode: "java", zeroCost: true, stats: { classes: r.classes } };
    }
    case "SPRING": {
      const r = springBootArchitecture(input.trim());
      return { code: r.code, mode: "spring", zeroCost: true };
    }
    case "MARKDOWN": {
      const r = markdownToMindmap(input.trim());
      return { code: r.code, mode: "markdown", zeroCost: true };
    }
    case "MERMAID":
      return { code: input.trim(), mode: "mermaid", zeroCost: true };
    case "TEXT":
    default:
      if (aiGenerator) {
        const code = await aiGenerator(input.trim());
        return { code, mode: "ai", zeroCost: false };
      }
      throw new Error("AI 生成器未配置");
  }
}
