// ==========================================
// 模板库页面
// /tools/templates
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TEMPLATES } from "@/lib/templates-data";

export const metadata: Metadata = {
  title: "模板库 — AI 结构图模板中心（30+模板）",
  description:
    "精选 30+ ER 图、流程图、UML 类图等模板，覆盖电商、博客、学生管理、医院管理、库存、企业管理、SaaS 七大场景，一键使用。",
  keywords: "ER图模板,流程图模板,UML模板,数据库设计模板,系统架构模板",
};

/** 模板分类配置 */
const CATEGORIES: Record<string, { label: string; icon: string; desc: string }> = {
  学生管理: { label: "学生管理系统", icon: "🎓", desc: "学生、课程、成绩、图书、宿舍管理模板" },
  电商系统: { label: "电商系统", icon: "🛒", desc: "商城、订单、支付、购物车相关模板" },
  库存管理: { label: "库存管理系统", icon: "📦", desc: "出入库、盘点、多仓库、供应链模板" },
  医院管理: { label: "医院管理系统", icon: "🏥", desc: "挂号、病历、药房、住院管理模板" },
  博客系统: { label: "博客系统", icon: "📝", desc: "CMS、博客、论坛、内容管理模板" },
  企业管理: { label: "企业管理", icon: "🏢", desc: "HR、CRM、项目管理、审批流程模板" },
  SaaS: { label: "SaaS 平台", icon: "☁️", desc: "多租户、RBAC、API网关、微服务模板" },
};

export default async function TemplatesPage() {
  // 从数据库加载模板
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 如果数据库为空，使用预设模板数据
  const displayTemplates =
    templates.length > 0 ? templates : DEFAULT_TEMPLATES;

  // 按分类分组
  const grouped: Record<string, typeof displayTemplates> = {};
  for (const t of displayTemplates) {
    const cat = t.category || "其他";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-blue-600">
          制图工具
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">模板库</span>
      </div>

      {/* 标题 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          📦 模板库
        </h1>
        <p className="text-gray-500 text-lg">
          精选优质模板，一键加载使用 — 覆盖 {Object.keys(CATEGORIES).length} 大业务场景
        </p>
      </div>

      {/* 模板数量统计 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count =
            displayTemplates.filter((t) => t.category === key).length ||
            (key === "电商系统" ? 2 : key === "学生管理" ? 2 : key === "库存管理" ? 1 : key === "医院管理" ? 1 : 1);
          return (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-200 transition-colors"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-lg font-bold text-gray-800">{count}</div>
              <div className="text-xs text-gray-400">{cat.label}</div>
            </div>
          );
        })}
      </div>

      {/* 模板列表（按分类） */}
      {Object.keys(CATEGORIES).map((categoryKey) => {
        const categoryTemplates = displayTemplates.filter(
          (t) => t.category === categoryKey
        );
        if (categoryTemplates.length === 0) return null;

        return (
          <section key={categoryKey} className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>{CATEGORIES[categoryKey]?.icon}</span>
              {CATEGORIES[categoryKey]?.label || categoryKey}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* 没有模板时 */}
      {displayTemplates.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg">模板库正在建设中</p>
          <p className="text-sm mt-1">敬请期待更多优质模板...</p>
        </div>
      )}

      {/* 底部 CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
        <p className="text-xl font-bold text-blue-800 mb-3">
          🚀 用 AI 一键生成你的专属图表
        </p>
        <p className="text-blue-600 mb-6">
          没有找到合适的模板？试试 AI 免费生成！
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

/** 模板卡片 */
function TemplateCard({
  template,
}: {
  template: { id: string; title: string; description: string; preview: string; code: string; category: string };
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col">
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
        {template.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
        {template.description}
      </p>

      {template.preview && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <pre className="text-xs text-gray-600 overflow-x-auto max-h-24 overflow-y-auto line-clamp-4">
            {template.preview.slice(0, 200)}
          </pre>
        </div>
      )}

      <Link
        href={`/tools/tool?template=${template.id}`}
        className="block text-center py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors mt-auto"
      >
        🚀 一键使用
      </Link>
    </div>
  );
}

