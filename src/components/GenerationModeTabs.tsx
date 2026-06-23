"use client";

// ==========================================
// 生成模式 Tab 选择器
// AI 生成 / SQL 生成 / Mermaid 代码
// ==========================================

import type { GenerationMode } from "@/types/diagram";

const modes: { value: GenerationMode; label: string; icon: string; desc: string }[] = [
  { value: "ai", label: "AI 生成", icon: "🤖", desc: "输入描述自动生成" },
  { value: "sql", label: "SQL 生成", icon: "🗃️", desc: "粘贴 CREATE TABLE 语句" },
  { value: "mermaid", label: "Mermaid 代码", icon: "📝", desc: "直接编写 Mermaid 代码" },
];

interface Props {
  value: GenerationMode;
  onChange: (value: GenerationMode) => void;
}

export function GenerationModeTabs({ value, onChange }: Props) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600 mb-2">生成方式</div>
      <div className="flex gap-2">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            title={mode.desc}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === mode.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {mode.icon} {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
