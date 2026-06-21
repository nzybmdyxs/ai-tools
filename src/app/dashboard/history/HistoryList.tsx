"use client";

// ==========================================
// 历史记录列表 — 客户端组件（支持删除操作）
// ==========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Diagram {
  id: string;
  title: string;
  type: string;
  prompt: string;
  result: string;
  createdAt: Date | string;
}

export function HistoryList({
  diagrams,
  typeLabels,
}: {
  diagrams: Diagram[];
  typeLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [items, setItems] = useState(diagrams);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条记录吗？此操作不可撤销。")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/diagrams?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems(items.filter((d) => d.id !== id));
      }
    } catch {
      alert("删除失败，请稍后重试");
    } finally {
      setDeleting(null);
      router.refresh();
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    alert("代码已复制到剪贴板");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 桌面端表格 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                名称
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                类型
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                时间
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((diagram) => (
              <tr
                key={diagram.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === diagram.id ? null : diagram.id
                      )
                    }
                    className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors text-left"
                  >
                    {diagram.title}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                    {typeLabels[diagram.type] || diagram.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(diagram.createdAt).toLocaleString("zh-CN")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === diagram.id ? null : diagram.id
                        )
                      }
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => handleDelete(diagram.id)}
                      disabled={deleting === diagram.id}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      {deleting === diagram.id ? "删除中..." : "删除"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 移动端卡片列表 */}
      <div className="md:hidden divide-y divide-gray-100">
        {items.map((diagram) => (
          <div key={diagram.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {diagram.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {typeLabels[diagram.type] || diagram.type} · {new Date(diagram.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === diagram.id ? null : diagram.id
                  )
                }
                className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                查看
              </button>
              <button
                onClick={() => handleDelete(diagram.id)}
                disabled={deleting === diagram.id}
                className="flex-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                {deleting === diagram.id ? "删除中..." : "删除"}
              </button>
            </div>

            {/* 展开详情 */}
            {expandedId === diagram.id && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-3 animate-fade-in">
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    输入内容
                  </div>
                  <p className="text-sm text-gray-700">{diagram.prompt}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      Mermaid 代码
                    </span>
                    <button
                      onClick={() => copyCode(diagram.result)}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      📋 复制
                    </button>
                  </div>
                  <pre className="text-xs text-gray-700 bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto max-h-48 overflow-y-auto">
                    {diagram.result}
                  </pre>
                </div>
                <Link
                  href={`/tools/tool?load=${diagram.id}`}
                  className="block text-center py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  在编辑器中打开
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
