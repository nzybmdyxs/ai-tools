import Link from "next/link";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI工具集合站 — AI制图·学生工具·程序员工具",
  description:
    "免费在线AI制图平台：支持ER图、数据流图、用例图、类图、状态图、流程图、时序图、架构图等12种图表类型。SQL转ER图、AI自动生成、模板库一键使用。",
  keywords: "AI制图,ER图生成,流程图,数据流图,用例图,类图,状态图,架构图,学生工具",
};

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
      {/* ===== Hero ===== */}
      <section className="text-center space-y-5 py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          🚀 AI 工具集合站
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
          AI 制图 + 学生工具 + 程序员工具 — 论文/作业/编程/架构一站式平台
        </p>
        <Link
          href="/tools/tool"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
        >
          免费开始使用 →
        </Link>
      </section>

      {/* ===== AI制图中心入口：12种图类型网格 ===== */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🤖 AI 制图中心</h2>
          <Link href="/tools" className="text-sm text-blue-600 hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Object.values(DIAGRAM_CONFIG).map((t) => (
            <Link
              key={t.value}
              href={`/tools/${t.value}`}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 text-center">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 模板中心入口 ===== */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📦 模板中心</h2>
          <Link href="/templates" className="text-sm text-blue-600 hover:underline">
            查看全部 30+ →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <TemplatePreview
            icon="🎓" title="学生管理系统 ER 图"
            desc="学生、课程、教师、成绩 — 教务系统数据库设计"
            href="/templates/student-management"
          />
          <TemplatePreview
            icon="🛒" title="电商系统 ER 图"
            desc="用户、商品、订单、支付 — 商城数据库设计"
            href="/templates/ecommerce"
          />
          <TemplatePreview
            icon="🏥" title="医院挂号系统 ER 图"
            desc="患者、医生、科室、挂号 — 医疗系统设计"
            href="/templates/hospital"
          />
          <TemplatePreview
            icon="📦" title="库存管理系统 ER 图"
            desc="仓库、商品、出入库 — 供应链管理"
            href="/templates/inventory"
          />
          <TemplatePreview
            icon="💼" title="HR 人力资源系统 ER 图"
            desc="员工、部门、考勤、薪资 — 企业管理"
            href="/templates/hr"
          />
          <TemplatePreview
            icon="📝" title="博客系统 ER 图"
            desc="用户、文章、评论、标签 — CMS 设计"
            href="/templates/blog"
          />
        </div>
      </section>

      {/* ===== 三大模块卡片 ===== */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🧰 更多工具</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard emoji="🎓" title="学生工具" desc="论文大纲·开题报告·文献综述·毕设辅助" href="/students" color="green" />
          <ModuleCard emoji="👨‍💻" title="程序员工具" desc="JSON格式化·SQL生成·架构设计·API文档" href="/dev-tools" color="purple" />
          <ModuleCard emoji="📝" title="博客教程" desc="20+篇SEO文章·数据库·系统设计·学术写作" href="/blog" color="orange" />
        </div>
      </section>

      {/* ===== 如何使用 ===== */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 三步开始</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-600">
          <Step num="1" text="选择图表类型或模板" />
          <Arrow />
          <Step num="2" text="输入描述或粘贴 SQL" />
          <Arrow />
          <Step num="3" text="AI 生成 → 导出使用" />
        </div>
      </section>

      {/* ===== 最新文章 ===== */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📚 最新教程</h2>
          <Link href="/blog" className="text-sm text-blue-600 hover:underline">
            全部 20+ →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ArticleCard title="ER 图怎么画？数据库设计入门" tag="数据库" href="/blog/er-diagram-guide" />
          <ArticleCard title="UML 类图教程：面向对象必备" tag="系统设计" href="/blog/uml-guide" />
          <ArticleCard title="流程图绘制完全指南" tag="效率工具" href="/blog/flowchart-guide" />
          <ArticleCard title="电商数据库设计实战" tag="电商系统" href="/blog/ecommerce-db-design" />
        </div>
      </section>
    </div>
  );
}

/* ========== 子组件 ========== */

function TemplatePreview({ icon, title, desc, href }: { icon: string; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{desc}</p>
      </div>
    </Link>
  );
}

function ModuleCard({ emoji, title, desc, href, color }: { emoji: string; title: string; desc: string; href: string; color: "green" | "purple" | "orange" }) {
  const borders: Record<string, string> = {
    green: "border-green-200 hover:border-green-400 hover:shadow-green-100",
    purple: "border-purple-200 hover:border-purple-400 hover:shadow-purple-100",
    orange: "border-orange-200 hover:border-orange-400 hover:shadow-orange-100",
  };
  return (
    <Link href={href} className={`block p-6 border-2 rounded-xl transition-all hover:shadow-lg ${borders[color]} bg-white group`}>
      <div className="text-4xl mb-3">{emoji}</div>
      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">{title}</h2>
      <p className="text-gray-500 mt-1 text-sm">{desc}</p>
    </Link>
  );
}

function Step({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">{num}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Arrow() {
  return <span className="text-gray-400 text-xl hidden md:block">→</span>;
}

function ArticleCard({ title, tag, href }: { title: string; tag: string; href: string }) {
  const colors: Record<string, string> = { "数据库": "bg-blue-100 text-blue-700", "系统设计": "bg-purple-100 text-purple-700", "效率工具": "bg-green-100 text-green-700", "电商系统": "bg-orange-100 text-orange-700" };
  return (
    <Link href={href} className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group">
      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2 ${colors[tag] || "bg-gray-100 text-gray-600"}`}>{tag}</span>
      <h3 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 line-clamp-2">{title}</h3>
    </Link>
  );
}
