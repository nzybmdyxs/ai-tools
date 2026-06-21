"use client";

import { TYPE_LABELS, TYPE_EXAMPLES } from "@/lib/prompt";

interface InputBoxProps {
  text: string;
  type: string;
  loading: boolean;
  onTextChange: (text: string) => void;
  onTypeChange: (type: string) => void;
  onGenerate: () => void;
}

export default function InputBox({
  text,
  type,
  loading,
  onTextChange,
  onTypeChange,
  onGenerate,
}: InputBoxProps) {
  return (
    <div className="space-y-4">
      {/* 图表类型选择 */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onTypeChange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              type === key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 输入区域 */}
      <div>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`例如：${TYPE_EXAMPLES[type] || "请输入内容..."}`}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-gray-800 placeholder-gray-400"
          disabled={loading}
        />
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
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            AI 正在生成...
          </span>
        ) : (
          "🚀 生成结构图"
        )}
      </button>
    </div>
  );
}
