// ==========================================
// 学生工具中心
// /student
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { ToolCard } from "@/components/common/ToolCard";
import { SectionTitle } from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "学生工具中心 — 论文·开题·文献·答辩一站式辅助",
  description:
    "面向大学生的免费AI工具：论文大纲生成、开题报告辅助、文献综述整理、答辩PPT大纲、研究路线图。",
  keywords: "学生工具,论文助手,开题报告,文献综述,答辩PPT,毕业论文,AI辅助",
};

const STUDENT_TOOLS = [
  {
    icon: "📝",
    title: "论文助手",
    description: "输入论文主题，AI 自动生成完整论文大纲和章节结构",
    href: "/tools/tool?type=mindmap",
    badge: "热门",
  },
  {
    icon: "📚",
    title: "文献综述",
    description: "整理文献脉络，自动归纳研究方向和研究空白",
    href: "/tools/tool?type=mindmap",
  },
  {
    icon: "📋",
    title: "开题报告",
    description: "生成开题报告框架：背景·现状·方法·计划",
    href: "/tools/tool?type=flowchart",
  },
  {
    icon: "🎤",
    title: "答辩 PPT 大纲",
    description: "自动生成答辩PPT结构：背景→方法→结果→创新点",
    href: "/tools/tool?type=mindmap",
  },
  {
    icon: "🗺️",
    title: "研究路线图",
    description: "可视化研究技术路线：文献→理论→实验→分析→结论",
    href: "/tools/tool?type=flowchart",
  },
];

const REFERENCE_TOOLS = [
  {
    icon: "🗄️",
    title: "ER 图生成",
    description: "数据库课程设计必备，SQL 直接转 ER 图",
    href: "/tools/er",
  },
  {
    icon: "🔀",
    title: "流程图绘制",
    description: "毕业设计流程图：业务流程·算法·系统交互",
    href: "/tools/flowchart",
  },
  {
    icon: "📊",
    title: "甘特图",
    description: "毕业设计进度规划：选题→需求→开发→论文→答辩",
    href: "/tools/gantt",
  },
  {
    icon: "🧠",
    title: "思维导图",
    description: "期末复习知识梳理，学习笔记结构化",
    href: "/tools/mindmap",
  },
];

export default function StudentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <PageHeader
        title="🎓 学生工具中心"
        description="论文·开题·文献·答辩 — 一站式 AI 辅助学习平台"
        breadcrumbs={[{ label: "首页", href: "/" }, { label: "学生工具" }]}
      />

      {/* 核心工具 */}
      <section className="mb-14">
        <SectionTitle title="论文 & 学术工具" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STUDENT_TOOLS.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      {/* 辅助制图工具 */}
      <section className="mb-14">
        <SectionTitle title="课程设计 & 毕业设计" description="数据库设计、流程图、甘特图等制图工具" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REFERENCE_TOOLS.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
        <p className="text-xl font-bold text-green-800 mb-3">
          🤖 用 AI 辅助你的学习，效率翻倍
        </p>
        <p className="text-green-600 mb-6">所有工具免费用，注册再送 30 次 AI 生成</p>
        <Link
          href="/tools/tool"
          className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
        >
          开始使用 →
        </Link>
      </div>
    </div>
  );
}
