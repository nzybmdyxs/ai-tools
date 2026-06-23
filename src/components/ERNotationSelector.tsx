"use client";

// ==========================================
// ER 图表示法选择器（仅 ER 图时显示）
// ==========================================

import { ER_NOTATIONS } from "@/config/er-notations";
import type { ERNotation } from "@/types/diagram";

interface Props {
  value: ERNotation;
  onChange: (value: ERNotation) => void;
}

export function ERNotationSelector({ value, onChange }: Props) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600 mb-2">
        ER 表示法
      </div>
      <div className="flex gap-2">
        {ER_NOTATIONS.map((item) => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              value === item.value
                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {item.label}
            {item.recommended && (
              <span className="ml-1.5 text-xs text-blue-400">推荐</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
