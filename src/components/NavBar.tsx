"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "🏠 首页" },
  { href: "/apps", label: "🧰 工具导航" },
  { href: "/tools", label: "🧠 制图工具" },
  { href: "/students", label: "🎓 学生工具" },
  { href: "/dev-tools", label: "👨‍💻 程序员工具" },
  { href: "/blog", label: "📝 博客" },
  { href: "/pricing", label: "👑 升级Pro" },
];

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 py-3">
        {/* 桌面端导航 */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            🧠 AI工具集
          </Link>

          {/* 桌面链接 */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="切换菜单"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        {mobileOpen && (
          <div className="md:hidden mt-3 border-t border-gray-100 pt-3 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
