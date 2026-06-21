import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "AI制图工具 - 流程图/ER图/UML在线生成",
  description:
    "AI驱动的制图工具集合：流程图生成器、ER图生成器、UML类图生成器，支持6种图表类型，AI自动生成Mermaid代码。",
};

const tools = [
  {
    emoji: "📊",
    title: "AI 流程图生成器",
    desc: "输入文字描述，AI 自动生成 Mermaid 流程图，支持下载 SVG。适配业务流程、算法逻辑等场景。",
    href: "/tools/tool",
    highlight: true,
  },
  {
    emoji: "🗄️",
    title: "ER 图生成器",
    desc: "数据库关系图在线生成，自动识别实体与关联关系，支持一对一/一对多/多对多。",
    href: "/tools/er",
  },
  {
    emoji: "📐",
    title: "UML 类图生成器",
    desc: "面向对象设计必备，自动生成类图和继承、聚合、组合关系。",
    href: "/tools/uml",
  },
  {
    emoji: "🔀",
    title: "流程图怎么画",
    desc: "流程图绘制完整教程，从基础符号到Mermaid代码，一步到位。",
    href: "/tools/flowchart",
  },
];

export default function ToolsHome() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "制图工具" },
        ]}
      />

      {/* 页面标题 */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">🧠 AI 制图工具</h1>
        <p className="text-gray-500 mt-2 text-lg">
          选择一种图表类型，AI 帮你自动生成专业结构图 — 支持 6 种图表类型
        </p>
      </section>

      {/* 工具卡片网格 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group block p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
              tool.highlight
                ? "border-blue-300 bg-gradient-to-br from-blue-50 to-white hover:border-blue-500"
                : "border-gray-200 bg-white hover:border-gray-400"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{tool.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                  {tool.highlight && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                      热门
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* 使用说明 */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          📖 使用说明
        </h2>
        <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
          <li>选择对应的图表工具</li>
          <li>输入你要转换的文字描述</li>
          <li>选择图表类型（流程图 / ER图 / UML / 时序图 / 甘特图 / 思维导图）</li>
          <li>点击生成，AI 自动输出 Mermaid 结构图</li>
          <li>可复制代码或下载 SVG 图片</li>
        </ol>
      </section>
    </div>
  );
}
