"use client";

// ==========================================
// 收藏列表 — 客户端组件（支持取消收藏）
// ==========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Favorite {
  id: string;
  diagramId: string;
  createdAt: Date | string;
}

interface Diagram {
  id: string;
  title: string;
  type: string;
  prompt: string;
  result: string;
  createdAt: Date | string;
}

export function FavoriteList({
  initialFavorites,
  diagrams,
  typeLabels,
}: {
  initialFavorites: Favorite[];
  diagrams: Diagram[];
  typeLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleUnfavorite = async (diagramId: string) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagramId }),
      });
      if (res.ok) {
        setFavorites(favorites.filter((f) => f.diagramId !== diagramId));
      }
    } catch {
      alert("操作失败，请稍后重试");
    }
    router.refresh();
  };

  // Build a map of diagramId to diagram for quick lookup
  const diagramMap = new Map(diagrams.map((d) => [d.id, d]));

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    alert("代码已复制到剪贴板");
  };

  return (
    <div className="space-y-3">
      {favorites.map((fav) => {
        const d = diagramMap.get(fav.diagramId);
        if (!d) return null;

        return (
          <div
            key={fav.id}
            className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 hover:border-yellow-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-400">⭐</span>
                  <h3 className="font-medium text-gray-800 truncate">
                    {d.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 ml-6">
                  <span className="px-2 py-0.5 bg-gray-100 rounded-md">
                    {typeLabels[d.type] || d.type}
                  </span>
                  <span>
                    收藏于 {new Date(fav.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === d.id ? null : d.id)
                  }
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  查看
                </button>
                <button
                  onClick={() => handleUnfavorite(d.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  取消收藏
                </button>
              </div>
            </div>

            {/* 展开详情 */}
            {expandedId === d.id && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-3 animate-fade-in">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    输入内容
                  </div>
                  <p className="text-sm text-gray-700">{d.prompt}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      Mermaid 代码
                    </span>
                    <button
                      onClick={() => copyCode(d.result)}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      📋 复制
                    </button>
                  </div>
                  <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto max-h-48 overflow-y-auto">
                    {d.result}
                  </pre>
                </div>
                <Link
                  href={`/tools/tool?load=${d.id}`}
                  className="block text-center py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  在编辑器中打开
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
