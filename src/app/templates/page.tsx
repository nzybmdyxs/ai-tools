// ==========================================
// 模板中心 — 浏览所有模板
// /templates
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TEMPLATES } from "@/lib/templates-data";

export const metadata: Metadata = {
  title: "模板中心 — 30+免费图表模板",
  description:
    "精选 30+ ER图、流程图、架构图模板。覆盖学生管理、电商系统、医院管理、库存管理、企业管理等场景，一键使用。",
  keywords: "ER图模板,流程图模板,架构图模板,数据库设计模板,毕业设计模板",
};

export default async function TemplatesPage() {
  // 数据库模板
  const dbTemplates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } });
  const displayTemplates = dbTemplates.length > 0 ? dbTemplates : DEFAULT_TEMPLATES;

  // 按分类分组
  const grouped: Record<string, typeof displayTemplates> = {};
  for (const t of displayTemplates) {
    const cat = t.category || "其他";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">模板中心</span>
      </div>

      {/* 标题 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">📦 模板中心</h1>
        <p className="text-gray-500 mt-2 text-lg">
          {displayTemplates.length}+ 免费模板，覆盖 {Object.keys(grouped).length} 个场景。选择一个，一键使用。
        </p>
      </div>

      {/* 分类统计 */}
      <div className="flex flex-wrap gap-3 mb-10">
        {Object.entries(grouped).map(([cat, items]) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {cat} · {items.length}
          </a>
        ))}
      </div>

      {/* 按分类展示模板 */}
      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} id={cat} className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            {cat}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((tpl, idx) => (
              <Link
                key={tpl.id || idx}
                href={`/templates/${tpl.id}`}
                className="group block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 mb-2 line-clamp-1">
                  {tpl.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {tpl.description}
                </p>
                {tpl.preview && (
                  <div className="p-3 bg-gray-50 rounded-lg mb-3">
                    <pre className="text-xs text-gray-500 line-clamp-3 overflow-hidden">
                      {tpl.preview}
                    </pre>
                  </div>
                )}
                <span className="text-xs text-blue-500 group-hover:underline">
                  🚀 一键使用 →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
        <p className="text-xl font-bold text-blue-800 mb-3">
          🤖 没找到合适的？用 AI 自定义生成！
        </p>
        <Link
          href="/tools/tool"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          开始生成 →
        </Link>
      </div>
    </div>
  );
}
