"use client";

// ==========================================
// 输入区域 — 图类型 + ER表示法 + 生成模式 + 文本输入
// ==========================================

import { DiagramTypeTabs } from "@/components/DiagramTypeTabs";
import { ERNotationSelector } from "@/components/ERNotationSelector";
import { GenerationModeTabs } from "@/components/GenerationModeTabs";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";
import type { DiagramType, ERNotation, GenerationMode } from "@/types/diagram";

interface InputBoxProps {
  text: string;
  diagramType: DiagramType;
  erNotation: ERNotation;
  generationMode: GenerationMode;
  loading: boolean;
  onTextChange: (text: string) => void;
  onDiagramTypeChange: (type: DiagramType) => void;
  onERNotationChange: (notation: ERNotation) => void;
  onGenerationModeChange: (mode: GenerationMode) => void;
  onGenerate: () => void;
}

const PLACEHOLDERS: Record<GenerationMode, Record<string, string>> = {
  ai: {
    default: "例如：描述你想要生成的图表...",
  },
  sql: {
    default: `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,
  },
  mermaid: {
    default: `erDiagram
  USER {
    int id PK
    string name
  }
  ORDER {
    int id PK
    int userId FK
  }
  USER ||--o{ ORDER : places`,
  },
};

export default function InputBox(props: InputBoxProps) {
  const {
    text, diagramType, erNotation, generationMode, loading,
    onTextChange, onDiagramTypeChange, onERNotationChange,
    onGenerationModeChange, onGenerate,
  } = props;

  const placeholders = PLACEHOLDERS[generationMode];
  const config = DIAGRAM_CONFIG[diagramType];
  const placeholder = generationMode === "ai"
    ? `例如：${config?.example || "描述你想要生成的图表..."}`
    : placeholders.default;

  return (
    <div className="space-y-4">
      {/* 图类型 Tab */}
      <DiagramTypeTabs value={diagramType} onChange={onDiagramTypeChange} />

      {/* ER 表示法（仅 ER 图显示） */}
      {diagramType === "er" && generationMode === "ai" && (
        <ERNotationSelector value={erNotation} onChange={onERNotationChange} />
      )}

      {/* 生成模式 Tab */}
      <GenerationModeTabs value={generationMode} onChange={onGenerationModeChange} />

      {/* 输入区域 */}
      <div>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-gray-800 placeholder-gray-400 ${
            generationMode === "sql" || generationMode === "mermaid"
              ? "h-48 font-mono text-sm"
              : "h-32"
          }`}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              onGenerate();
            }
          }}
        />
        <p className="text-xs text-gray-400 mt-1">
          {generationMode === "sql" && "粘贴 CREATE TABLE 语句，自动生成 ER 图 · "}
          {generationMode === "mermaid" && "直接编写 Mermaid 代码，实时预览 · "}
          {generationMode === "ai" && "描述你想要的图表，AI 自动生成 · "}
          按 Ctrl+Enter 快速生成
        </p>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={onGenerate}
        disabled={loading || !text.trim()}
        className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all ${
          loading || !text.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg hover:shadow-xl"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {generationMode === "sql" ? "解析 SQL..." : generationMode === "mermaid" ? "渲染中..." : "AI 正在生成..."}
          </span>
        ) : (
          `🚀 ${generationMode === "sql" ? "解析 SQL" : generationMode === "mermaid" ? "渲染代码" : "生成结构图"}`
        )}
      </button>
    </div>
  );
}
