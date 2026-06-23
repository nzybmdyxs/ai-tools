// ==========================================
// ER 图表示法配置
// 仅在 diagramType=er 时显示
// ==========================================

import type { ERNotation } from "@/types/diagram";

export interface ERNotationConfig {
  value: ERNotation;
  label: string;
  description: string;
  recommended: boolean;
}

export const ER_NOTATIONS: ERNotationConfig[] = [
  {
    value: "crows-foot",
    label: "Crow's Foot",
    description: "数据库设计标准，程序员推荐",
    recommended: true,
  },
  {
    value: "chen",
    label: "Chen 表示法",
    description: "教学与学术论文常用",
    recommended: false,
  },
];
