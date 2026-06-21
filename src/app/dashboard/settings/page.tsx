// ==========================================
// 账号设置页面
// /dashboard/settings
// ==========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      plan: true,
      credits: true,
      createdAt: true,
      _count: {
        select: {
          diagrams: true,
          favorites: true,
          orders: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">⚙️ 账号设置</h1>

      {/* 基本信息 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📧 基本信息
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              邮箱
            </label>
            <div className="flex items-center gap-3">
              <span className="text-gray-800 font-medium">{user.email}</span>
              <span className="text-xs text-gray-400">
                (当前通过邮件魔法链接登录，无需密码)
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">
                {user.plan === "PRO" ? "Pro" : "免费版"}
              </div>
              <div className="text-xs text-gray-500 mt-1">会员等级</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">
                {user._count.diagrams}
              </div>
              <div className="text-xs text-gray-500 mt-1">历史图表</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">
                {user._count.favorites}
              </div>
              <div className="text-xs text-gray-500 mt-1">收藏夹</div>
            </div>
          </div>
        </div>
      </div>

      {/* 账号信息 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📅 账号信息
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">注册时间</span>
            <span className="text-gray-800">
              {new Date(user.createdAt).toLocaleString("zh-CN")}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">会员等级</span>
            <span
              className={
                user.plan === "PRO"
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600"
              }
            >
              {user.plan === "PRO" ? "👑 Pro 会员" : "免费版"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">剩余 AI 次数</span>
            <span className="text-gray-800">
              {user.plan === "PRO" ? "无限" : `${user.credits} 次`}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">生成总数</span>
            <span className="text-gray-800">{user._count.diagrams} 个</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">订单总数</span>
            <span className="text-gray-800">{user._count.orders} 笔</span>
          </div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🔗 快捷入口
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/dashboard/billing"
            className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-sm"
          >
            <span className="font-medium text-gray-800">💳 会员中心</span>
            <p className="text-xs text-gray-400 mt-1">
              查看套餐和购买记录
            </p>
          </Link>
          <Link
            href="/pricing"
            className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-sm"
          >
            <span className="font-medium text-gray-800">🚀 升级会员</span>
            <p className="text-xs text-gray-400 mt-1">
              {user.plan === "PRO" ? "管理订阅" : "解锁更多功能"}
            </p>
          </Link>
          <Link
            href="/dashboard/history"
            className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-sm"
          >
            <span className="font-medium text-gray-800">📋 历史记录</span>
            <p className="text-xs text-gray-400 mt-1">
              查看已生成的图表
            </p>
          </Link>
          <Link
            href="/dashboard/favorites"
            className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-sm"
          >
            <span className="font-medium text-gray-800">⭐ 收藏夹</span>
            <p className="text-xs text-gray-400 mt-1">
              查看收藏的图表
            </p>
          </Link>
        </div>
      </div>

      {/* 页脚 */}
      <div className="text-center text-xs text-gray-400">
        <p>需要删除账号或其他帮助？</p>
        <p>
          请联系{" "}
          <a
            href="mailto:webtools@example.com"
            className="text-blue-500 hover:underline"
          >
            webtools@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
