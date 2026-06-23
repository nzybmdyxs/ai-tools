// ==========================================
// 博客分类页
// /blog/category/[slug]
// 按标签/分类筛选博客文章
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog-data";

/** slug 到标签名的映射 */
const CATEGORY_SLUG_MAP: Record<string, { name: string; icon: string }> = {
  "shu-ju-ku": { name: "数据库", icon: "🗄️" },
  "xi-tong-she-ji": { name: "系统设计", icon: "🏗️" },
  "xue-shu-xie-zuo": { name: "学术写作", icon: "📝" },
  "kai-fa-gong-ju": { name: "开发工具", icon: "🛠️" },
  "dian-shang-xi-tong": { name: "电商系统", icon: "🛒" },
  "ku-cun-guan-li": { name: "库存管理", icon: "📦" },
  "yi-yuan-guan-li": { name: "医院管理", icon: "🏥" },
  "bo-ke-xi-tong": { name: "博客系统", icon: "📰" },
  "xiao-lu-gong-ju": { name: "效率工具", icon: "⚡" },
  "xiang-mu-guan-li": { name: "项目管理", icon: "📊" },
  "xue-xi-fang-fa": { name: "学习方法", icon: "🧠" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_SLUG_MAP[slug];
  return {
    title: cat ? `${cat.name} — 博客分类` : "博客分类",
    description: cat ? `浏览 ${cat.name} 相关的所有文章和教程` : "按分类浏览博客文章",
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORY_SLUG_MAP[slug];

  // 筛选匹配的文章
  const posts = Object.entries(BLOG_POSTS).filter(
    ([, post]) => cat && post.tag === cat.name
  );

  const tagColors: Record<string, string> = {
    "数据库": "bg-blue-100 text-blue-700",
    "系统设计": "bg-purple-100 text-purple-700",
    "学术写作": "bg-green-100 text-green-700",
    "开发工具": "bg-gray-100 text-gray-700",
    "电商系统": "bg-orange-100 text-orange-700",
    "库存管理": "bg-cyan-100 text-cyan-700",
    "医院管理": "bg-red-100 text-red-700",
    "博客系统": "bg-pink-100 text-pink-700",
    "效率工具": "bg-yellow-100 text-yellow-700",
    "项目管理": "bg-indigo-100 text-indigo-700",
    "学习方法": "bg-teal-100 text-teal-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600">博客</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{cat?.name || slug}</span>
      </div>

      {/* 标题 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {cat?.icon} {cat?.name || "分类"} 相关文章
        </h1>
        <p className="text-gray-500">
          {posts.length > 0
            ? `共 ${posts.length} 篇文章`
            : "暂未找到相关文章"}
        </p>
      </div>

      {/* 文章列表 */}
      {posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {posts.map(([postSlug, post]) => (
            <Link
              key={postSlug}
              href={`/blog/${postSlug}`}
              className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <span
                className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-3 ${tagColors[post.tag] || "bg-gray-100 text-gray-600"}`}
              >
                {post.tag}
              </span>
              <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">{post.desc}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p>该分类暂无文章</p>
          <Link href="/blog" className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block">
            ← 返回博客首页
          </Link>
        </div>
      )}

      {/* 分类导航 */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📂 全部分类</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_SLUG_MAP).map(([catSlug, catInfo]) => (
            <Link
              key={catSlug}
              href={`/blog/category/${catSlug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                slug === catSlug
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {catInfo.icon} {catInfo.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
