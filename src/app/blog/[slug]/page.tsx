import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

/**
 * 博客文章配置 — JSON 驱动，新增文章只需添加配置
 */
const BLOG_POSTS: Record<
  string,
  {
    title: string;
    desc: string;
    tag: string;
    sections: { heading: string; content: string }[];
    ctaText: string;
    ctaHref: string;
  }
> = {
  "er-diagram-guide": {
    title: "ER 图怎么画？数据库设计入门指南",
    desc: "从零开始学习 ER 图，掌握实体、属性、关系三要素，快速上手数据库设计。本文涵盖 ER 图基础概念、Mermaid 语法、设计步骤和最佳实践。",
    tag: "数据库",
    sections: [
      {
        heading: "什么是 ER 图？",
        content:
          "ER 图（Entity-Relationship Diagram，实体关系图）是数据库设计中最重要的建模工具之一。它用图形化的方式描述数据实体、实体属性以及实体之间的关系。ER 图帮助开发者和 DBA 在设计阶段就能清晰地看到数据结构，避免后期的重构成本。",
      },
      {
        heading: "ER 图的三要素",
        content:
          "实体（Entity）：代表数据对象，如「用户」「订单」「商品」，最终对应数据库中的表。\n\n属性（Attribute）：实体的特征，如「用户名」「邮箱」「价格」，对应表中的列（字段）。\n\n关系（Relationship）：实体之间的业务联系，主要有一对一（1:1）、一对多（1:N）、多对多（M:N）三种类型。",
      },
      {
        heading: "常见的关系类型",
        content:
          "一对一（1:1）：一个实体 A 对应唯一一个实体 B。例如：一个用户只有一张身份证。\n\n一对多（1:N）：一个实体 A 对应多个实体 B。例如：一个用户可以有多个订单。\n\n多对多（M:N）：多个实体 A 对应多个实体 B。例如：一个学生可以选多门课，一门课也可以有多个学生。多对多关系通常需要中间表来实现。",
      },
      {
        heading: "用 Mermaid 画 ER 图",
        content:
          "Mermaid 提供了简洁的语法来定义 ER 图。使用 erDiagram 关键字开始，用 ||--o{ 等符号表示关系。PK 表示主键，FK 表示外键。你可以在 AI 工具中输入你的数据库需求，让 AI 自动生成对应的 Mermaid ER 图代码。",
      },
      {
        heading: "ER 图设计最佳实践",
        content:
          "1. 先识别核心业务实体，再逐步扩展\n2. 为每个实体定义清晰的主键\n3. 使用规范化的命名（如 user_id 而非 uid）\n4. 避免过早优化 — 先保证逻辑正确\n5. 多对多关系一定要拆成两个一对多 + 中间表\n6. 设计完成后用实际业务场景验证",
      },
    ],
    ctaText: "👉 使用 AI 一键生成 ER 图",
    ctaHref: "/tools/tool",
  },
  "uml-guide": {
    title: "UML 类图教程：面向对象设计必备技能",
    desc: "UML 类图是面向对象分析与设计的核心工具。本文从基础概念讲到类之间的关系，帮你全面掌握 UML 类图。",
    tag: "系统设计",
    sections: [
      {
        heading: "UML 类图是什么？",
        content:
          "UML（Unified Modeling Language）类图是描述系统静态结构的图表。它展示系统中的类、接口以及它们之间的关系。类图是软件设计阶段最重要的产物之一，能帮助团队成员快速理解系统架构。",
      },
      {
        heading: "类图的基本元素",
        content:
          "一个标准的类图包含三个部分：\n\n1. 类名 — 位于最上方，使用帕斯卡命名法\n2. 属性 — 成员变量，格式为「可见性 名称: 类型」\n3. 方法 — 成员函数，格式为「可见性 名称(参数): 返回值」\n\n可见性符号：+ 表示 public，- 表示 private，# 表示 protected",
      },
      {
        heading: "类之间的六种关系",
        content:
          "1. 继承（Inheritance）：子类继承父类的属性和方法，用空心三角箭头表示\n2. 实现（Implementation）：类实现接口，用空心三角虚线箭头表示\n3. 关联（Association）：类之间的基本联系\n4. 聚合（Aggregation）：整体与部分的关系，部分可以独立存在\n5. 组合（Composition）：更强的整体-部分关系，部分不能独立存在\n6. 依赖（Dependency）：一个类使用另一个类，用虚线箭头表示",
      },
      {
        heading: "SOLID 设计原则",
        content:
          "在设计类图时，应遵循 SOLID 原则：\n\nS — 单一职责：一个类只负责一件事\nO — 开闭原则：对扩展开放，对修改关闭\nL — 里氏替换：子类可以替换父类\nI — 接口隔离：使用小而专的接口\nD — 依赖倒置：依赖抽象而非具体实现",
      },
    ],
    ctaText: "👉 使用 AI 一键生成 UML 类图",
    ctaHref: "/tools/tool",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.title,
    description: post.desc,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  // 未匹配到文章
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          文章未找到
        </h1>
        <p className="text-gray-500 mb-6">
          没有找到 &quot;{slug}&quot; 对应的文章
        </p>
        <Link
          href="/blog"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← 返回博客首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "博客", href: "/blog" },
          { label: post.title },
        ]}
      />

      {/* 文章头部 */}
      <header className="mb-10">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mb-3">
          {post.tag}
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">{post.desc}</p>
      </header>

      {/* 文章内容 */}
      <article className="prose prose-gray max-w-none space-y-8">
        {post.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              {section.heading}
            </h2>
            {section.content.split("\n\n").map((paragraph, j) => (
              <p key={j} className="text-gray-600 leading-relaxed mb-3">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
        <p className="text-xl font-bold text-blue-800 mb-4">
          {post.ctaText}
        </p>
        <Link
          href={post.ctaHref}
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          {post.ctaText}
        </Link>
      </div>

      {/* 返回 */}
      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="text-sm text-blue-600 hover:underline"
        >
          ← 返回博客首页
        </Link>
      </div>
    </div>
  );
}
