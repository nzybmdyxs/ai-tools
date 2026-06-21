// ==========================================
// Dashboard 布局 — 左侧菜单 + 右侧内容
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "用户中心", template: "%s - 用户中心" },
};

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "🏠 首页",
    exact: true,
  },
  {
    href: "/dashboard/history",
    label: "📋 历史记录",
  },
  {
    href: "/dashboard/favorites",
    label: "⭐ 收藏夹",
  },
  {
    href: "/dashboard/billing",
    label: "💳 会员中心",
  },
  {
    href: "/dashboard/settings",
    label: "⚙️ 账号设置",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* 左侧菜单 */}
      <aside className="w-64 border-r border-gray-200 bg-white p-4 hidden md:block">
        <nav>
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 底部返回 */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-400 hover:text-blue-600 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </aside>

      {/* 移动端顶部 tab 导航 */}
      <div className="md:hidden w-full border-b border-gray-200 bg-white overflow-x-auto">
        <div className="flex gap-0 px-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 右侧内容 */}
      <main className="flex-1 p-6 md:p-10 bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
