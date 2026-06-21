import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "SEO 文章中心 - 技术教程与工具指南",
  description:
    "AI工具集合站博客，涵盖 ER 图教程、UML 类图教程、流程图绘制、论文写作指南、JSON 格式化等实用技术文章。",
};

const articles = [
  {
    title: "ER 图怎么画？数据库设计入门指南",
    desc: "从零开始学习 ER 图，掌握实体、属性、关系三要素，快速上手数据库设计。",
    href: "/tools/er",
    tag: "数据库",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "UML 类图教程：面向对象设计必备技能",
    desc: "理解类、接口、继承、关联、聚合、组合关系，提升系统设计能力。",
    href: "/tools/uml",
    tag: "系统设计",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    title: "流程图怎么画？从入门到精通",
    desc: "流程图基础符号、绘制规范、常见模板，以及 AI 自动生成流程图的方法。",
    href: "/tools/flowchart",
    tag: "效率工具",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    title: "论文大纲怎么写？完整写作指南",
    desc: "从选题到框架搭建，帮你梳理论文写作思路，高效完成学术论文。",
    href: "/students",
    tag: "学术写作",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    title: "JSON 格式化工具推荐与使用技巧",
    desc: "程序员必备的 JSON 处理技巧，在线格式化、压缩、校验工具推荐。",
    href: "/dev-tools",
    tag: "开发工具",
    tagColor: "bg-red-100 text-red-700",
  },
  {
    title: "数据库 ER 图设计最佳实践",
    desc: "深入理解数据库建模，掌握 ER 图设计规范和常见设计模式。",
    href: "/tools/er",
    tag: "数据库",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    title: "面向对象设计：从 UML 到代码",
    desc: "如何用 UML 类图指导实际编码，设计模式和 SOLID 原则实战。",
    href: "/tools/uml",
    tag: "系统设计",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    title: "毕业设计全流程指南",
    desc: "毕设选题、开题报告、系统设计、论文撰写一站式指南。",
    href: "/students",
    tag: "学术写作",
    tagColor: "bg-orange-100 text-orange-700",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "博客" },
        ]}
      />

      {/* 标题 */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">📝 SEO 文章中心</h1>
        <p className="text-gray-500 mt-2 text-lg">
          技术教程 · 工具指南 · 学术写作 — 持续更新中
        </p>
      </section>

      {/* 文章列表 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {articles.map((article) => (
          <Link
            key={article.title}
            href={article.href}
            className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${article.tagColor}`}>
                {article.tag}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{article.desc}</p>
            <div className="mt-4 text-sm text-blue-600 font-medium group-hover:underline">
              阅读文章 →
            </div>
          </Link>
        ))}
      </section>

      {/* SEO 说明 */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          🔍 关于本站
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          本文章中心为 SEO 优化而建，覆盖数据库设计、系统架构、学术写作、开发工具等高频搜索关键词。
          每篇文章都配有对应的 AI 工具入口，实现「教程引流 → 工具转化」的闭环。
        </p>
      </section>
    </div>
  );
}
