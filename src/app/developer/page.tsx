// ==========================================
// 程序员工具中心
// /developer
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { ToolCard } from "@/components/common/ToolCard";
import { SectionTitle } from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "程序员工具中心 — SQL·JSON·OpenAPI·架构设计",
  description:
    "面向程序员的免费在线工具：SQL转ER图、JSON转TypeScript/Java、OpenAPI转时序图、Markdown转思维导图、架构图在线生成。",
  keywords: "程序员工具,SQL转ER图,JSON转TypeScript,OpenAPI转Mermaid,架构图,API文档",
};

const DEV_TOOLS = [
  {
    icon: "🗃️",
    title: "SQL 转 ER 图",
    description: "粘贴 CREATE TABLE 语句，自动生成数据库 ER 图，支持主键外键识别",
    href: "/tools/tool?type=er&mode=sql",
    badge: "推荐",
  },
  {
    icon: "📋",
    title: "JSON 转 TypeScript",
    description: "JSON 数据自动生成 TypeScript interface 类型定义",
    href: "/dev-tools",
  },
  {
    icon: "☕",
    title: "JSON 转 Java",
    description: "JSON 数据自动生成 Java POJO 类定义",
    href: "/dev-tools",
  },
  {
    icon: "🔌",
    title: "OpenAPI 转时序图",
    description: "Swagger/OpenAPI 文档自动生成 API 调用时序图",
    href: "/tools/tool?type=sequence",
  },
  {
    icon: "📝",
    title: "Markdown 转思维导图",
    description: "Markdown 大纲自动转换为可视化思维导图",
    href: "/tools/tool?type=mindmap",
  },
  {
    icon: "🏗️",
    title: "架构图生成器",
    description: "描述系统架构，AI 自动生成分层架构图",
    href: "/tools/architecture",
    badge: "热门",
  },
];

const DIAGRAM_TOOLS = [
  {
    icon: "☁️",
    title: "微服务架构图",
    description: "Gateway + 服务 + MQ + DB 全链路",
    href: "/tools/microservice",
  },
  {
    icon: "📦",
    title: "UML 类图",
    description: "面向对象建模，继承聚合组合关系",
    href: "/tools/class",
  },
  {
    icon: "⏱️",
    title: "时序图",
    description: "API调用流程、微服务间通信",
    href: "/tools/sequence",
  },
  {
    icon: "🔄",
    title: "状态图",
    description: "订单状态流转、审批流程状态机",
    href: "/tools/state",
  },
];

export default function DeveloperPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <PageHeader
        title="👨‍💻 程序员工具中心"
        description="SQL · JSON · OpenAPI · 架构设计 — 开发者效率工具集合"
        breadcrumbs={[{ label: "首页", href: "/" }, { label: "程序员工具" }]}
      />

      {/* 核心工具 */}
      <section className="mb-14">
        <SectionTitle title="开发工具" description="日常开发中的效率工具" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEV_TOOLS.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      {/* 架构设计工具 */}
      <section className="mb-14">
        <SectionTitle title="架构 & 设计" description="系统设计和技术文档工具" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DIAGRAM_TOOLS.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-8 text-center">
        <p className="text-xl font-bold text-purple-800 mb-3">
          🚀 用 AI 生成架构文档，节省 80% 时间
        </p>
        <p className="text-purple-600 mb-6">注册即送 30 次 AI 生成，Pro 会员无限使用</p>
        <Link
          href="/pricing"
          className="inline-block px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
        >
          查看方案 →
        </Link>
      </div>
    </div>
  );
}
