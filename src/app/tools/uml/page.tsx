import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "UML类图教程：面向对象设计必备技能",
  description:
    "UML类图完整教程，覆盖类、接口、继承、关联、聚合、组合等核心概念。使用 AI UML生成器，自动生成类图和关系。",
};

export default function UMLPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "制图工具", href: "/tools" },
          { label: "UML 类图教程" },
        ]}
      />

      {/* 标题 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📐 UML 类图教程：面向对象设计必备技能
      </h1>
      <p className="text-gray-500 mb-8 text-lg leading-relaxed">
        UML 类图是面向对象设计的核心工具，用于描述系统的静态结构。本文从类、接口、关系三大维度带你掌握类图设计。
      </p>

      <article className="prose prose-gray max-w-none space-y-8">
        {/* 什么是 UML 类图 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            一、什么是 UML 类图？
          </h2>
          <p className="text-gray-600 leading-relaxed">
            UML（Unified Modeling Language，统一建模语言）类图用于展示系统中的类、接口以及它们之间的静态关系。它是软件开发中设计阶段的重要产出物，帮助团队成员理解系统结构、进行代码生成和重构。
          </p>
        </section>

        {/* 类图基本元素 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            二、类图的基本元素
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "📛 类名 (Class Name)",
                desc: "类的名称，位于类图矩形的第一格。使用帕斯卡命名法（PascalCase）。",
              },
              {
                title: "📋 属性 (Attributes)",
                desc: "类的成员变量。格式：可见性 名称: 类型。可见性：+ public, - private, # protected。",
              },
              {
                title: "⚙️ 方法 (Methods)",
                desc: "类的成员函数。格式：可见性 名称(参数): 返回类型。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="font-bold text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 类之间的关系 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            三、类之间的关系
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">关系</th>
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">Mermaid 符号</th>
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">含义</th>
                  <th className="border border-gray-200 p-3 text-left text-sm font-semibold">示例</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">继承 (Inheritance)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">&lt;|--</code>
                  </td>
                  <td className="border border-gray-200 p-3">IS-A 关系，子类继承父类</td>
                  <td className="border border-gray-200 p-3">Dog 继承 Animal</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">关联 (Association)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">--</code>
                  </td>
                  <td className="border border-gray-200 p-3">类之间的基本关系</td>
                  <td className="border border-gray-200 p-3">Teacher 教授 Student</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">聚合 (Aggregation)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">o--</code>
                  </td>
                  <td className="border border-gray-200 p-3">整体-部分（弱拥有，部分可独立存在）</td>
                  <td className="border border-gray-200 p-3">Department 包含 Employee</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">组合 (Composition)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">*--</code>
                  </td>
                  <td className="border border-gray-200 p-3">整体-部分（强拥有，部分不可独立存在）</td>
                  <td className="border border-gray-200 p-3">House 包含 Room</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">依赖 (Dependency)</td>
                  <td className="border border-gray-200 p-3">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">..&gt;</code>
                  </td>
                  <td className="border border-gray-200 p-3">一个类使用另一个类</td>
                  <td className="border border-gray-200 p-3">Service 依赖 Repository</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Mermaid 示例 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            四、Mermaid 类图示例
          </h2>
          <p className="text-gray-600 mb-4">
            以下是一个动物类的继承关系示例，展示了类图的核心概念：
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`classDiagram
  class Animal {
    +String name
    +int age
    +eat() void
    +sleep() void
  }
  class Dog {
    +String breed
    +bark() void
    +fetch() void
  }
  class Cat {
    +String color
    +meow() void
  }
  class Owner {
    +String name
    +feed(Animal) void
  }
  Animal <|-- Dog
  Animal <|-- Cat
  Owner --> Animal : owns`}
          </pre>
          <p className="text-sm text-gray-400 mt-2">
            提示：{"<|--"} 表示继承关系，{"-->"} 表示关联关系。
          </p>
        </section>

        {/* 设计原则 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            五、UML 类图设计原则
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "单一职责",
                desc: "每个类只负责一件事，避免「上帝类」",
              },
              {
                title: "开闭原则",
                desc: "对扩展开放，对修改关闭",
              },
              {
                title: "依赖倒置",
                desc: "依赖抽象而非具体实现",
              },
              {
                title: "接口隔离",
                desc: "使用小而专的接口，而非大而全的接口",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-800 text-sm">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
          <p className="text-xl font-bold text-blue-800 mb-3">
            🚀 用 AI 一键生成 UML 类图！
          </p>
          <p className="text-blue-600 mb-4">
            输入类描述，AI 自动生成类图代码和关系，支持导出 SVG
          </p>
          <Link
            href="/tools/tool"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            👉 使用 AI 生成 UML 类图
          </Link>
        </div>
      </article>
    </div>
  );
}
