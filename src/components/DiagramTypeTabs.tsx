"use client";

// ==========================================
// 图表类型选择器 — 配置驱动网格布局
// 新增图类型只需修改 config/diagram-types.ts
// ==========================================

import { DIAGRAM_CONFIG, DIAGRAM_CATEGORIES } from "@/config/diagram-types";
import type { DiagramType } from "@/types/diagram";

interface Props {
  value: DiagramType;
  onChange: (value: DiagramType) => void;
}

export function DiagramTypeTabs({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      {DIAGRAM_CATEGORIES.map((cat) => {
        const items = Object.values(DIAGRAM_CONFIG).filter(
          (t) => t.category === cat.key
        );
        if (items.length === 0) return null;

        return (
          <div key={cat.key}>
            <div className="text-xs text-gray-400 font-medium mb-1.5">
              {cat.icon} {cat.label}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {items.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onChange(item.value)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition-all ${
                    value === item.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
