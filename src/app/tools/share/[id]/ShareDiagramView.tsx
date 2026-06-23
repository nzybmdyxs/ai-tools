"use client";

// ==========================================
// 分享页图表渲染（客户端组件）
// ==========================================

import DiagramBox from "@/components/DiagramBox";
import { useState } from "react";

export function ShareDiagramView({ code }: { code: string }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">📈 图表预览</h2>
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          {showCode ? "隐藏代码" : "📝 查看代码"}
        </button>
      </div>

      <div className="diagram-container">
        <DiagramBox code={code} />
      </div>

      {showCode && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Mermaid 源代码</p>
          <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-x-auto max-h-64 overflow-y-auto">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
}
