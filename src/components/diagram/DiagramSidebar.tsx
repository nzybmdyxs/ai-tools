"use client";

// ==========================================
// 制图工作台 — 左侧图类型选择栏
// ==========================================

import Link from "next/link";
import type { DiagramType } from "@/types/diagram";

const groups = [
  {
    title: "系统分析",
    items: [
      { id: "er", name: "ER 图", icon: "🗄️" },
      { id: "dfd", name: "数据流图", icon: "📊" },
      { id: "usecase", name: "用例图", icon: "👤" },
      { id: "flowchart", name: "流程图", icon: "🔀" },
    ],
  },
  {
    title: "软件设计",
    items: [
      { id: "class", name: "类图", icon: "📦" },
      { id: "sequence", name: "时序图", icon: "⏱️" },
      { id: "state", name: "状态图", icon: "🔄" },
    ],
  },
  {
    title: "架构设计",
    items: [
      { id: "architecture", name: "技术架构图", icon: "🏗️" },
      { id: "microservice", name: "微服务架构图", icon: "☁️" },
      { id: "function", name: "功能结构图", icon: "🌳" },
    ],
  },
  {
    title: "项目管理",
    items: [
      { id: "gantt", name: "甘特图", icon: "📅" },
      { id: "mindmap", name: "思维导图", icon: "🧠" },
    ],
  },
];

interface Props {
  active: DiagramType;
  onChange: (type: DiagramType) => void;
}

export function DiagramSidebar({ active, onChange }: Props) {
  return (
    <aside className="hidden lg:block w-full overflow-y-auto">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-1">
        图类型
      </div>
      <nav className="space-y-5">
        {groups.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs text-gray-400 mb-1.5 px-1">{group.title}</h4>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onChange(item.id as DiagramType)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active === item.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* 快捷入口 */}
      <div className="mt-6 pt-4 border-t border-gray-200 space-y-1">
        <Link
          href="/templates"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <span>📦</span> 模板库
        </Link>
        <Link
          href="/tools/editor"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <span>✏️</span> Mermaid 编辑器
        </Link>
      </div>
    </aside>
  );
}
