import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import CategorySection from "@/components/CategorySection";

export const metadata: Metadata = {
  title: "工具导航 - 全部AI在线工具",
  description:
    "AI工具集合站全部工具导航，涵盖制图工具、学生工具、程序员工具三大分类。流程图、ER图、UML、论文大纲、JSON格式化等在线工具。",
};

const allTools = {
  diagram: {
    title: "🧠 AI 制图工具",
    desc: "AI 驱动的专业图表生成：流程图、ER图、UML类图、时序图、甘特图、思维导图",
    tools: [
      {
        emoji: "🤖",
        title: "AI 结构图生成器",
        desc: "输入文字描述，AI 自动生成 Mermaid 结构图，支持 6 种图表类型",
        href: "/tools/tool",
        tag: "热门",
      },
      {
        emoji: "📊",
        title: "流程图怎么画",
        desc: "流程图绘制完整教程，从基础符号到 Mermaid 代码",
        href: "/tools/flowchart",
      },
      {
        emoji: "🗄️",
        title: "ER 图生成器",
        desc: "数据库关系图在线生成，自动识别实体与关联关系",
        href: "/tools/er",
      },
      {
        emoji: "📐",
        title: "UML 类图生成器",
        desc: "面向对象设计必备，自动生成类图和继承关系",
        href: "/tools/uml",
      },
    ],
    moreHref: "/tools",
    moreLabel: "全部制图工具 →",
  },
  student: {
    title: "🎓 学生工具",
    desc: "论文写作、作业辅导、毕业设计一站式 AI 辅助",
    tools: [
      {
        emoji: "📝",
        title: "论文大纲生成器",
        desc: "输入论文主题，AI 自动生成完整论文大纲和章节结构",
        href: "/apps/essay-outline",
      },
      {
        emoji: "📄",
        title: "论文摘要生成器",
        desc: "从论文正文提取或生成高质量摘要",
        href: "/apps/essay-abstract",
      },
      {
        emoji: "📚",
        title: "文献综述生成器",
        desc: "整理研究现状，自动生成文献综述框架",
        href: "/apps/literature-review",
      },
    ],
    moreHref: "/students",
    moreLabel: "全部学生工具 →",
  },
  dev: {
    title: "👨‍💻 程序员工具",
    desc: "JSON、SQL、编码转换 — 开发者必备在线工具箱",
    tools: [
      {
        emoji: "📋",
        title: "JSON 格式化",
        desc: "在线 JSON 格式化、压缩、校验工具",
        href: "/apps/json-formatter",
      },
      {
        emoji: "🗃️",
        title: "SQL 生成器",
        desc: "用自然语言描述需求，AI 自动生成 SQL 语句",
        href: "/apps/sql-generator",
      },
      {
        emoji: "🆔",
        title: "UUID 生成器",
        desc: "快速生成 UUID v4，支持批量生成",
        href: "/apps/uuid-generator",
      },
    ],
    moreHref: "/dev-tools",
    moreLabel: "全部程序员工具 →",
  },
};

export default function AppsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "工具导航" },
        ]}
      />

      {/* 页面标题 */}
      <section>
        <h1 className="text-3xl font-bold text-gray-800">🧰 全部工具</h1>
        <p className="text-gray-500 mt-2 text-lg">
          按分类浏览所有 AI 在线工具，找到你需要的
        </p>
      </section>

      {/* 分类展示 */}
      <CategorySection {...allTools.diagram} />
      <div className="border-t border-gray-100" />
      <CategorySection {...allTools.student} />
      <div className="border-t border-gray-100" />
      <CategorySection {...allTools.dev} />
    </div>
  );
}
