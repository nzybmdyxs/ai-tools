import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl">
          🚀 AI 工具集合站
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          论文 / 作业 / 编程 / 系统设计 — 一站式 AI 工具平台
        </p>
      </section>

      {/* 三大模块卡片 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          emoji="🧠"
          title="制图工具"
          desc="流程图 · ER图 · UML类图"
          href="/tools"
          color="blue"
        />
        <Card
          emoji="🎓"
          title="学生工具"
          desc="论文大纲 · 作业思路 · 毕设辅助"
          href="/students"
          color="green"
        />
        <Card
          emoji="👨‍💻"
          title="程序员工具"
          desc="JSON格式化 · SQL生成 · 架构设计"
          href="/dev-tools"
          color="purple"
        />
      </section>

      {/* 流量转化说明 */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          💡 如何使用这个平台？
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-600">
          <Step num="1" text="浏览 SEO 教程学习" />
          <Arrow />
          <Step num="2" text="使用 AI 工具生成" />
          <Arrow />
          <Step num="3" text="导出结果直接用" />
        </div>
      </section>

      {/* 热门工具快速入口 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🔥 热门工具
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLink href="/tools/tool" label="AI 流程图生成器" />
          <QuickLink href="/tools/er" label="ER 图教程" />
          <QuickLink href="/tools/uml" label="UML 类图教程" />
          <QuickLink href="/tools/flowchart" label="流程图怎么画" />
        </div>
      </section>

      {/* SEO 文章推荐 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📚 最新教程
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArticleCard
            href="/blog"
            title="ER 图怎么画？数据库设计入门"
            desc="从零开始学习 ER 图，掌握数据库关系设计"
          />
          <ArticleCard
            href="/blog"
            title="UML 类图教程：面向对象设计必备"
            desc="理解类、继承、关联关系，提升系统设计能力"
          />
          <ArticleCard
            href="/blog"
            title="论文大纲怎么写？完整指南"
            desc="从选题到框架，帮你梳理论文写作思路"
          />
          <ArticleCard
            href="/blog"
            title="JSON 格式化工具推荐"
            desc="程序员必备的 JSON 处理技巧和工具"
          />
        </div>
      </section>
    </div>
  );
}

/* ========== 组件 ========== */

function Card({
  emoji,
  title,
  desc,
  href,
  color,
}: {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  color: "blue" | "green" | "purple";
}) {
  const borders: Record<string, string> = {
    blue: "border-blue-200 hover:border-blue-400 hover:shadow-blue-100",
    green: "border-green-200 hover:border-green-400 hover:shadow-green-100",
    purple:
      "border-purple-200 hover:border-purple-400 hover:shadow-purple-100",
  };

  return (
    <Link
      href={href}
      className={`block p-6 border-2 rounded-xl transition-all hover:shadow-lg ${borders[color]} bg-white group`}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
        {title}
      </h2>
      <p className="text-gray-500 mt-1">{desc}</p>
    </Link>
  );
}

function Step({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
        {num}
      </span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Arrow() {
  return <span className="text-gray-400 text-xl hidden md:block">→</span>;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block p-4 bg-white border border-gray-200 rounded-lg text-center text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all"
    >
      {label}
    </Link>
  );
}

function ArticleCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </Link>
  );
}
