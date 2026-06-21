import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "程序员工具 - JSON/SQL/架构设计在线工具",
  description:
    "程序员必备在线工具：JSON 格式化、SQL 生成器、ER 图/UML 工具、API 文档生成，提升开发效率。",
};

const devTools = [
  {
    emoji: "📋",
    title: "JSON 格式化",
    desc: "在线 JSON 格式化、压缩、校验工具，支持树形查看和错误定位",
    status: "即将上线",
    available: false,
  },
  {
    emoji: "🗃️",
    title: "SQL 生成器",
    desc: "用自然语言描述需求，AI 自动生成 SQL 语句，支持多种数据库方言",
    status: "即将上线",
    available: false,
  },
  {
    emoji: "🗄️",
    title: "ER 图 / UML 工具",
    desc: "系统设计必备，AI 生成数据库 ER 图和 UML 类图，支持导出 SVG",
    href: "/tools/tool",
    available: true,
  },
  {
    emoji: "🔌",
    title: "API 文档生成",
    desc: "从代码注释自动生成 API 文档，支持 OpenAPI/Swagger 格式",
    status: "即将上线",
    available: false,
  },
  {
    emoji: "🧪",
    title: "正则表达式测试",
    desc: "在线正则测试和生成工具，实时匹配高亮，支持多种语言",
    status: "即将上线",
    available: false,
  },
  {
    emoji: "🎨",
    title: "代码格式化",
    desc: "支持 JavaScript/TypeScript/Python/SQL 等语言的代码美化",
    status: "即将上线",
    available: false,
  },
];

export default function DevToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "程序员工具" },
        ]}
      />

      {/* 标题 */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          👨‍💻 程序员工具
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          JSON / SQL / 架构设计 — 开发者必备在线工具箱
        </p>
      </section>

      {/* 工具网格 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {devTools.map((tool) => (
          <div
            key={tool.title}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow"
          >
            <span className="text-3xl mb-3">{tool.emoji}</span>
            <h3 className="text-lg font-bold text-gray-800">{tool.title}</h3>
            <p className="text-sm text-gray-500 mt-1 flex-1">{tool.desc}</p>
            <div className="mt-4">
              {tool.available && tool.href ? (
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 px-4 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  立即使用 <span className="text-xs">→</span>
                </Link>
              ) : (
                <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-400 text-sm rounded-lg">
                  🚧 {tool.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* 开发工具推荐 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🛠️ 推荐开发工作流
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3">💡 系统设计流程</h3>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>用 ER 图工具设计数据库结构</li>
              <li>用 UML 类图工具设计类关系</li>
              <li>用流程图工具梳理业务逻辑</li>
              <li>导出图表，放入设计文档</li>
            </ol>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3">⚡ 效率提升技巧</h3>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>自然语言描述需求 → AI 生成代码</li>
              <li>JSON 格式化 → 快速定位数据问题</li>
              <li>正则测试 → 不用反复调试</li>
              <li>代码格式化 → 统一团队代码风格</li>
            </ol>
          </div>
        </div>
      </section>

      {/* 提示 */}
      <section className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-purple-800 mb-2">
          🔨 更多工具开发中
        </h2>
        <p className="text-sm text-purple-700">
          我们正在持续添加更多开发者常用工具：Base64
          编解码、时间戳转换、颜色转换、Diff 对比等。欢迎提出需求！
        </p>
      </section>
    </div>
  );
}
