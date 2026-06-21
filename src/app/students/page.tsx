import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "学生工具 - 论文/作业/毕设一站式辅助",
  description:
    "专为学生打造的 AI 工具集合：论文大纲生成、作业思路辅助、毕业设计 ER 图生成，帮你高效完成学业任务。",
};

const studentTools = [
  {
    emoji: "📝",
    title: "论文大纲生成器",
    desc: "输入论文主题，AI 自动生成完整论文大纲和章节结构，帮你快速搭建论文框架",
    status: "即将上线",
    available: false,
  },
  {
    emoji: "💡",
    title: "作业思路生成器",
    desc: "遇到难题不会做？AI 帮你梳理解题思路和知识点，理解而非抄袭",
    status: "即将上线",
    available: false,
  },
  {
    emoji: "🎓",
    title: "毕业设计 ER 图",
    desc: "毕设数据库设计不用愁，用 AI 一键生成专业 ER 图，支持下载 SVG",
    href: "/tools/er",
    available: true,
  },
  {
    emoji: "📊",
    title: "毕设流程图",
    desc: "论文需要画流程图？AI 自动生成，支持流程图、时序图等多种类型",
    href: "/tools/tool",
    available: true,
  },
  {
    emoji: "📐",
    title: "毕设 UML 类图",
    desc: "系统设计类图一键生成，面向对象毕设必备，自动识别类和关系",
    href: "/tools/uml",
    available: true,
  },
];

const tips = [
  {
    emoji: "📖",
    title: "论文写作",
    desc: "先确定选题方向，再用大纲生成器搭建框架，最后逐章填充内容",
  },
  {
    emoji: "🗄️",
    title: "数据库设计",
    desc: "用 ER 图工具可视化你的数据库结构，清晰展示表与表之间的关系",
  },
  {
    emoji: "📐",
    title: "系统设计",
    desc: "用 UML 类图展示你的类结构，让答辩老师一目了然",
  },
];

export default function StudentsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "学生工具" },
        ]}
      />

      {/* 标题 */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          🎓 学生工具
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          论文 / 作业 / 毕设 — AI 辅助，让学业更轻松
        </p>
      </section>

      {/* 工具列表 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {studentTools.map((tool) => (
          <div
            key={tool.title}
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">{tool.emoji}</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{tool.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
              <div className="mt-3">
                {tool.available && tool.href ? (
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
          </div>
        ))}
      </section>

      {/* 学习指南 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📚 学业工具使用指南
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6"
            >
              <span className="text-3xl block mb-3">{tip.emoji}</span>
              <h3 className="font-bold text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 提示 */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          💡 开发计划
        </h2>
        <p className="text-sm text-yellow-700">
          更多学生工具正在开发中，包括论文查重辅助、文献综述生成、答辩 PPT
          大纲等。敬请期待！
        </p>
      </section>
    </div>
  );
}
