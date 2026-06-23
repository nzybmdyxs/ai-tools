import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BLOG_POSTS } from "@/lib/blog-data";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.title,
    description: post.desc,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  // 未匹配到文章
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          文章未找到
        </h1>
        <p className="text-gray-500 mb-6">
          没有找到 &quot;{slug}&quot; 对应的文章
        </p>
        <Link
          href="/blog"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← 返回博客首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "博客", href: "/blog" },
          { label: post.title },
        ]}
      />

      {/* 文章头部 */}
      <header className="mb-10">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mb-3">
          {post.tag}
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">{post.desc}</p>
      </header>

      {/* 文章内容 */}
      <article className="prose prose-gray max-w-none space-y-8">
        {post.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {section.heading}
            </h2>
            {section.content.split("\n\n").map((paragraph, j) => (
              <p key={j} className="text-gray-600 leading-relaxed mb-3">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
        <p className="text-xl font-bold text-blue-800 mb-4">
          {post.ctaText}
        </p>
        <Link
          href={post.ctaHref}
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          {post.ctaText}
        </Link>
      </div>

      {/* 返回 */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="text-sm text-blue-600 hover:underline"
        >
          ← 返回博客首页
        </Link>
      </div>
    </div>
  );
}
