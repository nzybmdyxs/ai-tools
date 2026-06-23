"use client";

// ==========================================
// 制图工作台 — 右侧预览面板
// ==========================================

import DiagramBox from "@/components/DiagramBox";
import { useState } from "react";

interface Props {
  code: string;
  rawCode?: string;
  loading: boolean;
  error: string;
  onCopy: () => void;
  onDownload: () => void;
  onRepair: () => void;
  onSave: () => void;
  saved: boolean;
  saving: boolean;
}

export function DiagramPreview({
  code, rawCode, loading, error,
  onCopy, onDownload, onRepair, onSave, saved, saving,
}: Props) {
  const [showSource, setShowSource] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-full min-h-0">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <span className="text-sm font-semibold text-gray-700">📈 实时预览</span>
        <div className="flex items-center gap-1">
          {code && (
            <>
              <ToolBtn label="复制" icon="📋" onClick={onCopy} />
              <ToolBtn label="SVG" icon="📥" onClick={onDownload} />
              <ToolBtn label="修复" icon="🔧" onClick={onRepair} />
              <ToolBtn label={saved ? "已保存" : "保存"} icon="💾" onClick={onSave} disabled={saving || saved} />
            </>
          )}
          <button
            onClick={() => setShowSource(!showSource)}
            className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showSource ? "隐藏源码" : "源码"}
          </button>
        </div>
      </div>

      {/* 预览区 */}
      <div className="flex-1 min-h-0 overflow-auto p-4">
        {loading && !code ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-400">AI 正在生成图表...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 max-w-sm">
              <div className="text-4xl">⚠️</div>
              <p className="text-sm text-red-600 font-medium">生成失败</p>
              <p className="text-xs text-red-500">{error}</p>
              <button
                onClick={onRepair}
                className="px-4 py-2 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-xl hover:bg-yellow-100 transition-colors"
              >
                🔧 自动修复
              </button>
            </div>
          </div>
        ) : code ? (
          <div className="diagram-container">
            <DiagramBox code={code} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-300">
              <div className="text-5xl mb-3">📐</div>
              <p className="text-sm">在左侧输入描述或代码</p>
              <p className="text-xs mt-1">按 Ctrl+Enter 生成</p>
            </div>
          </div>
        )}
      </div>

      {/* 源代码 */}
      {showSource && rawCode && (
        <div className="border-t border-gray-200 p-4 max-h-48 overflow-auto flex-shrink-0">
          <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto">
            {rawCode}
          </pre>
        </div>
      )}
    </div>
  );
}

function ToolBtn({ label, icon, onClick, disabled }: { label: string; icon: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-40"
      title={label}
    >
      {icon}
    </button>
  );
}
