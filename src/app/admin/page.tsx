// ==========================================
// 管理后台 — MVP 壳
// /admin
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理后台",
  robots: "noindex, nofollow",
};

const sections = [
  { label: "📊 统计面板", href: "/admin", desc: "DAU、生成次数、付费转化" },
  { label: "👤 用户管理", href: "/admin", desc: "用户列表、会员等级管理" },
  { label: "📋 图表管理", href: "/admin", desc: "生成记录、图表审核" },
  { label: "📦 模板管理", href: "/admin", desc: "模板增删改查" },
  { label: "📝 博客管理", href: "/admin", desc: "文章编辑发布" },
  { label: "💳 订单管理", href: "/admin", desc: "订单查询、退款处理" },
];

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🛡️ 管理后台</h1>
        <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
          MVP
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="block p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-800 mb-1">{s.label}</h3>
            <p className="text-sm text-gray-400">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gray-50 rounded-2xl text-center">
        <p className="text-gray-500 text-sm">
          管理后台功能开发中。当前可用于查看基本数据统计。
        </p>
        <Link href="/dashboard" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
          ← 返回用户控制台
        </Link>
      </div>
    </div>
  );
}
