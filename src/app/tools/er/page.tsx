import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "ER图怎么画？数据库关系图完整教程",
  description:
    "ER图（实体关系图）数据库设计入门教程，覆盖实体、属性、关系、基数等核心概念。使用 AI ER图生成器，自动识别实体关系。",
};

export default function ERPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "制图工具", href: "/tools" },
          { label: "ER 图教程" },
        ]}
      />

      {/* 标题 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        🗄️ ER 图怎么画？数据库关系图完整教程
      </h1>
      <p className="text-gray-500 mb-8 text-lg leading-relaxed">
        ER 图（Entity-Relationship Diagram）是数据库设计的核心工具。本文从实体、属性、关系三大要素讲起，帮你快速上手数据库建模。
      </p>

      <article className="prose prose-gray max-w-none space-y-8">
        {/* 什么是 ER 图 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            一、什么是 ER 图？
          </h2>
          <p className="text-gray-600 leading-relaxed">
            ER 图全称 Entity-Relationship Diagram（实体关系图），用于描述数据库中的实体（表）、属性（字段）以及实体之间的关系。它是数据库设计阶段最重要的建模工具，能帮助开发者和 DBA 直观地理解数据结构。
          </p>
        </section>

        {/* ER 图三要素 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            二、ER 图三要素
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "📦 实体 (Entity)",
                desc: "数据对象，如用户、订单、商品，对应数据库中的表",
              },
              {
                name: "📋 属性 (Attribute)",
                desc: "实体的特征，如用户名、邮箱、价格，对应表中的列",
              },
              {
                name: "🔗 关系 (Relationship)",
                desc: "实体之间的联系：一对一、一对多、多对多",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="font-bold text-gray-800 mb-1">{item.name}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 关系类型 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            三、常见关系类型详解
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">
                    关系类型
                  </th>
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">
                    Mermaid 符号
                  </th>
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">
                    实际示例
                  </th>
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">
                    说明
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">一对一 (1:1)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">||--||</code>
                  </td>
                  <td className="border border-gray-200 p-3">用户 — 身份证</td>
                  <td className="border border-gray-200 p-3">一个用户只有一张身份证</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">一对多 (1:N)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">||--o{"{"}</code>
                  </td>
                  <td className="border border-gray-200 p-3">用户 — 订单</td>
                  <td className="border border-gray-200 p-3">一个用户可以有多个订单</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">多对多 (M:N)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">{"}"}o--o{"{"}</code>
                  </td>
                  <td className="border border-gray-200 p-3">学生 — 课程</td>
                  <td className="border border-gray-200 p-3">学生选多门课，课有多个学生</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">零或一 (0..1)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">||--o|</code>
                  </td>
                  <td className="border border-gray-200 p-3">用户 — 头像</td>
                  <td className="border border-gray-200 p-3">用户可能有也可能没有头像</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Mermaid 示例 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            四、Mermaid ER 图示例
          </h2>
          <p className="text-gray-600 mb-4">
            以下是一个电商系统的 ER 图示例，展示用户和订单之间的关系：
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`erDiagram
  USER ||--o{ ORDER : places
  USER {
    int id PK
    string username
    string email
    datetime created_at
  }
  ORDER {
    int id PK
    int user_id FK
    float amount
    string status
    datetime created_at
  }`}
          </pre>
          <p className="text-sm text-gray-400 mt-2">
            提示：PK 表示主键（Primary Key），FK 表示外键（Foreign Key）。
          </p>
        </section>

        {/* 设计步骤 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            五、ER 图设计步骤
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600">
            <li className="font-medium">识别实体 — 找出系统中的核心业务对象（用户、商品、订单等）</li>
            <li className="font-medium">定义属性 — 为每个实体列出需要存储的信息（字段）</li>
            <li className="font-medium">确定主键 — 为每个实体选择唯一标识（id、UUID 等）</li>
            <li className="font-medium">分析关系 — 梳理实体之间的联系类型和业务规则</li>
            <li className="font-medium">绘制 ER 图 — 使用工具绘制，检查是否满足业务需求</li>
          </ol>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
          <p className="text-xl font-bold text-blue-800 mb-3">
            🚀 用 AI 一键生成 ER 图！
          </p>
          <p className="text-blue-600 mb-4">
            输入数据库需求描述，AI 自动识别实体和关系，生成专业 ER 图
          </p>
          <Link
            href="/tools/tool"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            👉 使用 AI 生成 ER 图
          </Link>
        </div>
      </article>
    </div>
  );
}
