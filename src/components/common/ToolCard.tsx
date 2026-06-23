// ==========================================
// 通用工具卡片 — V2 升级版
// ==========================================

import Link from "next/link";

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  highlight?: boolean;
}

export function ToolCard({ icon, title, description, href, badge, highlight }: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`group block h-full rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        highlight
          ? "border-blue-300 bg-gradient-to-br from-blue-50 to-white hover:border-blue-500"
          : "border-gray-200 bg-white hover:border-gray-400"
      }`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
        {title}
        {badge && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full align-middle">
            {badge}
          </span>
        )}
      </h3>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
        {description}
      </p>
      <div className="mt-4 text-sm text-blue-600 font-medium group-hover:underline">
        开始使用 →
      </div>
    </Link>
  );
}
