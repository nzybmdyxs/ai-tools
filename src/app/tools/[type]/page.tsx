// ==========================================
// 独立 SEO 工具页 — 每种图类型一个落地页
// /tools/[type]  如 /tools/er /tools/dfd /tools/class
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";
import type { DiagramType } from "@/types/diagram";

interface Props {
  params: Promise<{ type: string }>;
}

/** 动态生成 SEO metadata */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const config = DIAGRAM_CONFIG[type as DiagramType];

  if (!config) {
    return { title: "图表工具未找到" };
  }

  return {
    title: `${config.label}在线生成器 — AI自动生成${config.label}`,
    description: `免费${config.label}在线生成工具。支持AI生成、SQL转换、Mermaid代码三种方式。${config.example}`,
    keywords: `${config.label},${config.label}生成器,${config.label}在线,AI${config.label},Mermaid${config.label}`,
  };
}

/** 功能亮点配置 */
const HIGHLIGHTS: Partial<Record<DiagramType, string[]>> = {
  er: ["支持 SQL 转 ER 图", "Crow's Foot / Chen 两种表示法", "自动识别主键外键"],
  dfd: ["实体/过程/数据存储三要素", "支持多层嵌套", "业务流程可视化"],
  usecase: ["Actor 与 UseCase 建模", "系统边界清晰", "适合需求文档"],
  class: ["类名/属性/方法三栏", "继承/聚合/组合关系", "SOLID 设计原则"],
  state: ["状态转换自动生成", "初始态/终态标注", "适合订单/审批流程"],
  sequence: ["参与者生命线", "同步/异步消息", "适合API/登录流程"],
  flowchart: ["步骤/判断/分支", "从上到下/从左到右", "业务/算法流程"],
  architecture: ["Client→CDN→Frontend→API→DB 全链路", "缓存/消息队列层", "从上到下分层架构"],
  microservice: ["Gateway + 服务拆分", "Redis/MQ/MySQL 组件", "服务间调用关系"],
  function: ["系统→模块→子功能 三级结构", "思维导图形式", "适合功能设计"],
  gantt: ["任务+时间线+依赖", "项目进度规划", "毕业设计/敏捷开发"],
  mindmap: ["中心主题+分支", "层级展开", "学习/头脑风暴"],
};

export default async function ToolTypePage({ params }: Props) {
  const { type } = await params;
  const config = DIAGRAM_CONFIG[type as DiagramType];

  if (!config) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">图表类型未找到</h1>
        <p className="text-gray-500 mb-6">没有 &quot;{type}&quot; 对应的图表类型</p>
        <Link href="/tools" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          查看全部图表类型 →
        </Link>
      </div>
    );
  }

  const highlights = HIGHLIGHTS[type as DiagramType] || ["AI 自动生成", "多种生成模式", "实时预览"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-blue-600">制图中心</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{config.label}</span>
      </div>

      {/* 标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{config.icon}</span>
          <h1 className="text-3xl font-bold text-gray-800">
            {config.label}在线生成器
          </h1>
        </div>
        <p className="text-lg text-gray-500">
          AI 自动生成 {config.label} · 支持 AI/SQL/Mermaid 三种模式 · {config.example}
        </p>
      </div>

      {/* 功能亮点 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {highlights.map((h) => (
          <div key={h} className="flex items-center gap-2 p-4 bg-green-50 border border-green-100 rounded-xl">
            <span className="text-green-500">✓</span>
            <span className="text-sm font-medium text-green-800">{h}</span>
          </div>
        ))}
      </div>

      {/* CTA 按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link
          href={`/tools/tool?type=${type}`}
          className="flex-1 px-6 py-4 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 shadow-lg transition-all"
        >
          🚀 在线生成 {config.label}
        </Link>
        <Link
          href="/tools/tool"
          className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 text-center font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all"
        >
          📝 用 Mermaid 代码编辑
        </Link>
      </div>

      {/* 相关模板 */}
      <RelatedTemplates type={type as DiagramType} />

      {/* 相关教程 */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📚 相关教程
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/tools/${type}`}
            className="text-sm text-blue-600 hover:underline py-1"
          >
            {config.label}怎么画？从入门到精通
          </Link>
          <Link
            href="/blog/er-diagram-guide"
            className="text-sm text-blue-600 hover:underline py-1"
          >
            ER 图设计教程
          </Link>
          <Link
            href="/blog/flowchart-guide"
            className="text-sm text-blue-600 hover:underline py-1"
          >
            流程图绘制完全指南
          </Link>
          <Link
            href="/blog/sequence-diagram-guide"
            className="text-sm text-blue-600 hover:underline py-1"
          >
            时序图怎么画？
          </Link>
        </div>
      </div>
    </div>
  );
}

/** 显示该类型相关的模板 */
async function RelatedTemplates({ type }: { type: DiagramType }) {
  const { prisma } = await import("@/lib/prisma");
  const templates = await prisma.template.findMany({
    where: {}, // 后续可按 category 匹配
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  if (templates.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📦 相关模板</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <Link
            key={tpl.id}
            href={`/templates?load=${tpl.id}`}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">{DIAGRAM_CONFIG[type]?.icon || "📄"}</span>
            <div className="min-w-0">
              <h3 className="font-medium text-gray-800 text-sm truncate">{tpl.title}</h3>
              <p className="text-xs text-gray-400">{tpl.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
