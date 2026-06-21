import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "流程图怎么画？从零入门流程图绘制教程",
  description:
    "流程图绘制完整教程，涵盖基础符号、绘制规范、常见模板。使用 AI 流程图生成器，输入文字即可自动生成 Mermaid 流程图。",
};

export default function FlowchartPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "制图工具", href: "/tools" },
          { label: "流程图怎么画" },
        ]}
      />

      {/* 文章标题 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📊 流程图怎么画？从零入门流程图绘制教程
      </h1>
      <p className="text-gray-500 mb-8 text-lg leading-relaxed">
        流程图是描述业务流程、算法逻辑最直观的方式。本文介绍流程图的基础符号、绘制规范、常见模板，以及如何用 AI 自动生成专业流程图。
      </p>

      {/* 内容 */}
      <article className="prose prose-gray max-w-none space-y-8">
        {/* 什么是流程图 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            一、什么是流程图？
          </h2>
          <p className="text-gray-600 leading-relaxed">
            流程图（Flowchart）是用图形符号表示算法或工作流程的图表。它用不同的几何图形代表不同类型的操作步骤，用箭头表示流程方向。流程图广泛应用于软件开发、业务流程管理、教学演示等领域。
          </p>
        </section>

        {/* 常用符号 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            二、常用流程图符号
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { shape: "⏹ 矩形", meaning: "处理步骤" },
              { shape: "💎 菱形", meaning: "判断条件" },
              { shape: "🔵 圆角矩形", meaning: "开始/结束" },
              { shape: "📐 平行四边形", meaning: "输入/输出" },
            ].map((s) => (
              <div
                key={s.shape}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors"
              >
                <div className="font-bold text-gray-800">{s.shape}</div>
                <div className="text-sm text-gray-500 mt-1">{s.meaning}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 流程图类型 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            三、常见的流程图类型
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "业务流程图",
                desc: "描述业务操作的流程，如订单处理流程、审批流程",
              },
              {
                title: "程序流程图",
                desc: "描述程序执行的逻辑，如算法流程、函数调用流程",
              },
              {
                title: "工作流程图",
                desc: "描述工作中的步骤和决策，如项目开发流程",
              },
              {
                title: "数据流程图",
                desc: "描述数据的流动和处理过程，如数据采集处理流程",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mermaid 示例 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            四、Mermaid 流程图示例
          </h2>
          <p className="text-gray-600 mb-4">
            使用 Mermaid 语法可以快速绘制流程图，以下是一个用户注册流程的示例：
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`flowchart TD
  A[用户注册] --> B{验证邮箱格式}
  B -->|格式正确| C[发送验证邮件]
  B -->|格式错误| D[提示重新输入]
  C --> E{用户点击验证链接}
  E -->|已验证| F[填写个人资料]
  E -->|未验证| G[等待验证]
  F --> H[注册成功]
  G --> C`}
          </pre>
          <p className="text-sm text-gray-400 mt-2">
            提示：TD 表示从上到下（Top-Down），你也可以使用 LR（Left-Right）从左到右。
          </p>
        </section>

        {/* 绘制步骤 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            五、绘制流程图的步骤
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600">
            <li className="font-medium">明确流程的起点和终点 — 你想描述什么流程？从哪里开始，到哪里结束？</li>
            <li className="font-medium">列出所有中间步骤 — 把每个操作步骤按顺序写下来</li>
            <li className="font-medium">确定判断节点和分支 — 找出需要做选择/判断的地方</li>
            <li className="font-medium">用箭头连接各个节点 — 按逻辑顺序连接，形成完整路径</li>
            <li className="font-medium">检查逻辑是否完整 — 确保没有死循环、没有遗漏的分支</li>
          </ol>
        </section>

        {/* 常见模板 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            六、常用流程图模板
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "用户登录流程", desc: "输入账号 → 验证 → 登录成功/失败" },
              { name: "订单处理流程", desc: "下单 → 支付 → 确认 → 发货 → 签收" },
              { name: "请假审批流程", desc: "提交申请 → 上级审批 → 人事备案" },
              { name: "API 调用流程", desc: "请求 → 鉴权 → 处理 → 响应" },
            ].map((tpl) => (
              <div
                key={tpl.name}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-800 text-sm">
                  {tpl.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{tpl.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
          <p className="text-xl font-bold text-blue-800 mb-3">
            🚀 不想手动画？试试 AI 自动生成！
          </p>
          <p className="text-blue-600 mb-4">
            输入文字描述，AI 自动生成专业的 Mermaid 流程图，支持下载 SVG
          </p>
          <Link
            href="/tools/tool"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            👉 使用 AI 生成流程图
          </Link>
        </div>
      </article>
    </div>
  );
}
