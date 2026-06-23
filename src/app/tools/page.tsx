// ==========================================
// 制图中心 — 左侧分类菜单 + 右侧工具入口
// /tools
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { DIAGRAM_CONFIG, DIAGRAM_CATEGORIES } from "@/config/diagram-types";

export const metadata: Metadata = {
  title: "AI制图中心 — 12种图表在线生成",
  description:
    "支持ER图、数据流图(DFD)、用例图、类图、状态图、流程图、时序图、甘特图、思维导图、技术架构图、微服务架构图、功能结构图，AI自动生成。",
  keywords: "AI制图,ER图,DFD,用例图,类图,状态图,架构图,流程图,时序图,在线生成",
};

const groups = DIAGRAM_CATEGORIES.map((cat) => ({
  title: cat.label,
  icon: cat.icon,
  items: Object.values(DIAGRAM_CONFIG).filter((t) => t.category === cat.key),
}));

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">制图中心</span>
      </div>

      {/* 标题 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">🤖 AI 制图中心</h1>
        <p className="text-gray-500 mt-2 text-lg">
          12 种图表类型，AI 自动生成 + SQL 转 ER + Mermaid 实时编辑
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧分类菜单 */}
        <aside className="md:w-56 flex-shrink-0">
          <nav className="space-y-6 md:sticky md:top-20">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {group.icon} {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.value}>
                      <Link
                        href={`/tools/${item.value}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 快捷入口 */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/tools/tool"
                className="block w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                🚀 开始生成
              </Link>
            </div>
          </nav>
        </aside>

        {/* 右侧内容 */}
        <main className="flex-1">
          {/* 工具卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(DIAGRAM_CONFIG).map((type) => (
              <Link
                key={type.value}
                href={`/tools/${type.value}`}
                className="group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
              >
                <span className="text-3xl flex-shrink-0 mt-0.5">{type.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                    {type.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{type.example}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                      {type.mermaidType}
                    </span>
                    <span className="text-xs text-blue-500 group-hover:underline">
                      去生成 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 底部说明 */}
          <div className="mt-10 bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-2">📖 使用方式</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>AI 生成</strong>：输入描述，AI 自动生成图表</li>
              <li>• <strong>SQL 生成</strong>：粘贴 CREATE TABLE 语句，自动转 ER 图</li>
              <li>• <strong>Mermaid 代码</strong>：直接编写代码，实时预览</li>
              <li>• <strong>模板库</strong>：30+ 预设模板，一键使用</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
