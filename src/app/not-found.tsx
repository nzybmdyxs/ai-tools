import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 — 页面未找到
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        你访问的页面不存在，可能已被移动或删除。
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
        >
          🏠 返回首页
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors border border-gray-200"
        >
          🧠 浏览工具
        </Link>
      </div>

      {/* 你可能在找 */}
      <div className="mt-16">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">你可能在找：</h2>
        <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto">
          <Link href="/tools/tool" className="text-sm text-blue-600 hover:underline">
            → AI 结构图生成器
          </Link>
          <Link href="/tools/flowchart" className="text-sm text-blue-600 hover:underline">
            → 流程图教程
          </Link>
          <Link href="/tools/er" className="text-sm text-blue-600 hover:underline">
            → ER 图教程
          </Link>
          <Link href="/tools/uml" className="text-sm text-blue-600 hover:underline">
            → UML 类图教程
          </Link>
          <Link href="/students" className="text-sm text-blue-600 hover:underline">
            → 学生工具
          </Link>
          <Link href="/dev-tools" className="text-sm text-blue-600 hover:underline">
            → 程序员工具
          </Link>
        </div>
      </div>
    </div>
  );
}
