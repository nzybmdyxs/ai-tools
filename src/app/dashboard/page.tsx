// ==========================================
// Dashboard 首页 — 用户总览
// /dashboard
// ==========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasUnlimitedAccess } from "@/lib/auth/admin";
import { getPlanName, getDailyLimit } from "@/lib/plans";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = hasUnlimitedAccess(session);

  if (!session?.user?.email && !isAdmin) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || process.env.SUPER_ADMIN_EMAIL || "" },
    select: {
      id: true,
      plan: true,
      credits: true,
      createdAt: true,
      _count: {
        select: {
          diagrams: true,
          favorites: true,
          invitees: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // 获取今日使用次数
  const today = new Date().toISOString().slice(0, 10);
  const todayUsage = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });

  // 获取总 Token 消耗
  const tokenStats = await prisma.usage.aggregate({
    where: { userId: user.id },
    _sum: { totalTokens: true, cost: true },
  });

  const dailyLimit = getDailyLimit(user.plan);
  const todayCount = todayUsage?.count || 0;

  const stats = [
    {
      label: "当前套餐",
      value: isAdmin ? "🔧 超级管理员" : getPlanName(user.plan),
      icon: "💎",
      color: isAdmin ? "bg-green-50 text-green-700" : user.plan === "PRO" ? "bg-purple-50 text-purple-700" : "bg-gray-50 text-gray-700",
    },
    {
      label: "今日已用 / 限额",
      value: isAdmin ? "∞" : dailyLimit < 0 ? "无限" : `${todayCount} / ${dailyLimit}`,
      icon: "🎯",
      color: dailyLimit > 0 && todayCount >= dailyLimit ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700",
    },
    {
      label: "Token 消耗",
      value: tokenStats._sum.totalTokens ? `${(tokenStats._sum.totalTokens / 1000).toFixed(1)}K` : "0",
      icon: "⚡",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "历史图表",
      value: `${user._count.diagrams}`,
      icon: "📋",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "收藏图表",
      value: `${user._count.favorites}`,
      icon: "⭐",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "已邀请",
      value: `${user._count.invitees}`,
      icon: "🎁",
      color: "bg-pink-50 text-pink-700",
    },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">👋 用户中心</h1>
        {isAdmin && (
          <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
            ⚡ 超级管理员
          </span>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-6 ${stat.color}`}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/tools/tool"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <span className="text-3xl">🤖</span>
          <div>
            <div className="font-semibold text-gray-800">AI 生成图表</div>
            <div className="text-sm text-gray-500">开始创建新的结构图</div>
          </div>
        </Link>

        <Link
          href="/tools/templates"
          className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <span className="text-3xl">📦</span>
          <div>
            <div className="font-semibold text-gray-800">模板库</div>
            <div className="text-sm text-gray-500">一键使用优质模板</div>
          </div>
        </Link>
      </div>

      {/* 最近记录 */}
      <RecentDiagrams userId={user.id} />
    </div>
  );
}

/** 最近 5 条生成记录 */
async function RecentDiagrams({ userId }: { userId: string }) {
  const diagrams = await prisma.diagram.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, type: true, createdAt: true },
  });

  if (diagrams.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 最近生成</h2>
        <div className="text-center py-10 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>还没有生成记录</p>
          <Link
            href="/tools/tool"
            className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block"
          >
            去生成第一个图表 →
          </Link>
        </div>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    flow: "流程图",
    er: "ER 图",
    uml: "UML 类图",
    sequence: "时序图",
    gantt: "甘特图",
    mindmap: "思维导图",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">📋 最近生成</h2>
        <Link
          href="/dashboard/history"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          查看全部 →
        </Link>
      </div>

      <div className="space-y-2">
        {diagrams.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg flex-shrink-0">
                {typeLabels[d.type] === "流程图" ? "🔄" :
                 typeLabels[d.type] === "ER 图" ? "🗄️" :
                 typeLabels[d.type] === "UML 类图" ? "🏗️" :
                 typeLabels[d.type] === "时序图" ? "⏱️" :
                 typeLabels[d.type] === "甘特图" ? "📊" : "🧠"}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {d.title}
                </div>
                <div className="text-xs text-gray-400">
                  {typeLabels[d.type] || d.type} · {new Date(d.createdAt).toLocaleDateString("zh-CN")}
                </div>
              </div>
            </div>
            <Link
              href={`/dashboard/history?id=${d.id}`}
              className="text-xs text-blue-500 hover:text-blue-600 flex-shrink-0 ml-4"
            >
              查看
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
