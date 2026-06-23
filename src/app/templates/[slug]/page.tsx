// ==========================================
// 模板详情页 — 查看 + 一键使用
// /templates/[slug]
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TEMPLATES } from "@/lib/templates-data";
import { ShareDiagramView } from "@/app/tools/share/[id]/ShareDiagramView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = await findTemplate(slug);
  if (!template) return { title: "模板未找到" };
  return {
    title: `${template.title} — 免费模板`,
    description: template.description || `${template.title}，一键使用AI生成`,
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = await findTemplate(slug);

  // 记录浏览
  if (template?.id) {
    prisma.template.update({
      where: { id: template.id },
      data: { views: { increment: 1 } },
    }).catch(() => {});
  }

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">模板未找到</h1>
        <p className="text-gray-500 mb-6">该模板不存在或已被移除</p>
        <Link href="/templates" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          浏览全部模板 →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/templates" className="hover:text-blue-600">模板中心</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{template.title}</span>
      </div>

      {/* 标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {template.category}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{template.title}</h1>
        <p className="text-gray-500 mt-2 text-lg">{template.description}</p>
      </div>

      {/* 预览 */}
      {template.code && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">📈 图表预览</h2>
          <ShareDiagramView code={template.code} />
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          href={`/tools/tool?template=${template.id}`}
          className="flex-1 px-6 py-4 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 shadow-lg transition-all"
        >
          🚀 一键使用此模板
        </Link>
        <Link
          href="/tools/tool"
          className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 text-center font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all"
        >
          🤖 用 AI 自定义生成
        </Link>
      </div>

      {/* 相关模板 */}
      <RelatedTemplates currentId={template.id} category={template.category} />

      {/* Mermaid 源代码 */}
      {template.code && (
        <details className="mt-8">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            📝 查看 Mermaid 源代码
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-x-auto max-h-64 overflow-y-auto">
            {template.code}
          </pre>
        </details>
      )}
    </div>
  );
}

/** 查找模板（先查数据库，再查预设数据） */
async function findTemplate(slug: string) {
  const dbTemplate = await prisma.template.findFirst({ where: { id: slug } });
  if (dbTemplate) return dbTemplate;
  return DEFAULT_TEMPLATES.find((t) => t.id === slug) || null;
}

/** 同类模板推荐 */
async function RelatedTemplates({ currentId, category }: { currentId: string; category: string }) {
  const related = await prisma.template.findMany({
    where: { category, id: { not: currentId } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  if (related.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-800 mb-4">📦 {category} 更多模板</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((tpl) => (
          <Link
            key={tpl.id}
            href={`/templates/${tpl.id}`}
            className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all"
          >
            <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{tpl.title}</h4>
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{tpl.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
