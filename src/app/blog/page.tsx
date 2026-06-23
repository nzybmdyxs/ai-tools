import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "SEO 文章中心 - 技术教程与工具指南（20+篇）",
  description:
    "AI工具集合站博客，涵盖 ER 图教程、UML 类图教程、流程图绘制、论文写作指南、SQL优化、系统架构等实用技术文章。",
};

const CATEGORY_LINKS = [
  { slug: "shu-ju-ku", label: "🗄️ 数据库", count: 3 },
  { slug: "xi-tong-she-ji", label: "🏗️ 系统设计", count: 3 },
  { slug: "xue-shu-xie-zuo", label: "📝 学术写作", count: 3 },
  { slug: "kai-fa-gong-ju", label: "🛠️ 开发工具", count: 3 },
  { slug: "xiao-lu-gong-ju", label: "⚡ 效率工具", count: 1 },
  { slug: "xiang-mu-guan-li", label: "📊 项目管理", count: 1 },
  { slug: "xue-xi-fang-fa", label: "🧠 学习方法", count: 1 },
  { slug: "dian-shang-xi-tong", label: "🛒 电商系统", count: 1 },
  { slug: "ku-cun-guan-li", label: "📦 库存管理", count: 1 },
  { slug: "yi-yuan-guan-li", label: "🏥 医院管理", count: 1 },
  { slug: "bo-ke-xi-tong", label: "📰 博客系统", count: 1 },
];

const tagColors: Record<string, string> = {
  "数据库": "bg-blue-100 text-blue-700", "系统设计": "bg-purple-100 text-purple-700",
  "学术写作": "bg-green-100 text-green-700", "开发工具": "bg-gray-100 text-gray-700",
  "电商系统": "bg-orange-100 text-orange-700", "库存管理": "bg-cyan-100 text-cyan-700",
  "医院管理": "bg-red-100 text-red-700", "博客系统": "bg-pink-100 text-pink-700",
  "效率工具": "bg-yellow-100 text-yellow-700", "项目管理": "bg-indigo-100 text-indigo-700",
  "学习方法": "bg-teal-100 text-teal-700",
};

export default function BlogPage() {
  const posts = Object.entries(BLOG_POSTS);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: "首页", href: "/" }, { label: "博客" }]} />

      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📝 SEO 文章中心</h1>
        <p className="text-gray-500 mt-2 text-lg">
          技术教程 · 工具指南 · 学术写作 — 共 {posts.length} 篇文章
        </p>
      </section>

      {/* 分类导航 */}
      <section className="flex flex-wrap gap-2 mb-10">
        {CATEGORY_LINKS.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </section>

      {/* 文章列表 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {posts.map(([slug, post]) => (
          <Link
            key={slug}
            href={`/blog/${slug}`}
            className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${tagColors[post.tag] || "bg-gray-100 text-gray-600"}`}>
              {post.tag}
            </span>
            <h3 className="text-lg font-bold text-gray-800 mt-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{post.desc}</p>
            <div className="mt-4 text-sm text-blue-600 font-medium group-hover:underline">
              阅读文章 →
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">🔍 关于本站</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          本文章中心为 SEO 优化而建，覆盖数据库设计、系统架构、学术写作、开发工具等高频搜索关键词。
          每篇文章都配有对应的 AI 工具入口，实现「教程引流 → 工具转化」的闭环。
        </p>
      </section>
    </div>
  );
}
