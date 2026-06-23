// ==========================================
// 分享页面 — 公开查看已分享的图表
// /tools/share/[id]
// ==========================================

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { ShareDiagramView } from "./ShareDiagramView";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const diagram = await prisma.diagram.findUnique({
    where: { id },
    select: { title: true, type: true, prompt: true },
  });

  if (!diagram) {
    return { title: "图表未找到" };
  }

  const typeLabels: Record<string, string> = Object.fromEntries(
    Object.values(DIAGRAM_CONFIG).map((c) => [c.value, c.label])
  );

  return {
    title: `${diagram.title} — 分享的${typeLabels[diagram.type] || "图表"}`,
    description: diagram.prompt?.slice(0, 160) || "查看分享的 AI 生成图表",
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const diagram = await prisma.diagram.findUnique({
    where: { id },
  });

  // 记录浏览
  if (diagram) {
    prisma.diagram.update({
      where: { id: diagram.id },
      data: { views: { increment: 1 } },
    }).catch(() => {});
  }

  if (!diagram) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">图表未找到</h1>
        <p className="text-gray-500 mb-6">该图表不存在或已被删除</p>
        <Link
          href="/tools/tool"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          创建你的图表 →
        </Link>
      </div>
    );
  }

  const typeLabels: Record<string, string> = Object.fromEntries(
    Object.values(DIAGRAM_CONFIG).map((c) => [c.value, c.label])
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/tools/tool" className="hover:text-blue-600">制图工具</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">分享图表</span>
      </div>

      {/* 图表信息 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{diagram.title}</h1>
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {typeLabels[diagram.type] || diagram.type}
          </span>
        </div>
        {diagram.prompt && (
          <p className="text-gray-500 text-sm mt-1">{diagram.prompt.slice(0, 200)}</p>
        )}
      </div>

      {/* 图表渲染 */}
      <ShareDiagramView code={diagram.result} />

      {/* CTA */}
      <div className="mt-10 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
        <p className="text-xl font-bold text-blue-800 mb-3">
          🤖 喜欢这个图表？用 AI 生成你自己的！
        </p>
        <p className="text-blue-600 mb-6 text-sm">
          输入描述，AI 自动生成流程图、ER 图、UML 等 6 种图表
        </p>
        <Link
          href="/tools/tool"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          免费开始生成 →
        </Link>
      </div>
    </div>
  );
}
