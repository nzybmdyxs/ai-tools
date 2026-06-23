// ==========================================
// 热门排行榜
// /ranking
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";

export const metadata: Metadata = {
  title: "热门排行榜 — 最受欢迎的图表",
  description: "查看社区最受欢迎的公开图表，发现优质模板和设计灵感。",
};

export default async function RankingPage() {
  // 公开的热门图表
  const diagrams = await prisma.diagram.findMany({
    where: { public: true },
    orderBy: { views: "desc" },
    take: 50,
  });

  // 热门模板
  const templates = await prisma.template.findMany({
    orderBy: [{ uses: "desc" }, { views: "desc" }],
    take: 20,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🔥 热门排行榜</h1>
      <p className="text-gray-500 mb-10">最受欢迎的公开图表和模板</p>

      {/* 热门图表 */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-gray-800 mb-6">📊 热门公开图表</h2>
        {diagrams.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>暂无公开图表</p>
            <Link href="/tools/tool" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
              去创建第一个 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagrams.map((d, i) => (
              <Link
                key={d.id}
                href={`/tools/share/${d.id}`}
                className="group block p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                    {d.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {DIAGRAM_CONFIG[d.type as keyof typeof DIAGRAM_CONFIG]?.label || d.type}
                  </span>
                  <span>👁 {d.views}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 热门模板 */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-gray-800 mb-6">📦 热门模板</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((t, i) => (
            <Link
              key={t.id}
              href={`/templates/${t.id}`}
              className="group block p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{t.category}</span>
              </div>
              <h3 className="font-medium text-gray-800 group-hover:text-blue-600 text-sm line-clamp-1">
                {t.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span>👁 {t.views}</span>
                <span>🚀 {t.uses}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-10 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl">
        <p className="text-xl font-bold text-yellow-800 mb-3">🚀 创建你的图表，分享到排行榜！</p>
        <Link href="/tools/tool" className="inline-block px-8 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 shadow-lg transition-colors">
          开始创建 →
        </Link>
      </div>
    </div>
  );
}
