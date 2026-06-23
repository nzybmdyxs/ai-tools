// ==========================================
// 会员中心页面
// /dashboard/billing
// ==========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/pricing";
import { PLANS, getPlanName, type PlanType } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      plan: true,
      credits: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const planName = getPlanName(user.plan);
  const planData = PLANS[user.plan as PlanType] || PLANS.FREE;
  const creditsDisplay = planData.dailyLimit < 0 ? "无限" : `${planData.dailyLimit} 次/天`;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">💳 会员中心</h1>

      {/* 当前套餐卡片 */}
      <div className={`rounded-2xl p-8 mb-8 ${
        user.plan === "PRO"
          ? "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
          : "bg-white border border-gray-200"
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {planName}
            </h2>
            <p className="text-gray-500 text-sm">
              注册于 {new Date(user.createdAt).toLocaleDateString("zh-CN")}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            user.plan === "PRO"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}>
            {user.plan === "PRO" ? "👑 PRO" : "🆓 FREE"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">AI 生成次数</div>
            <div className="text-2xl font-bold text-gray-800">
              {creditsDisplay}
            </div>
          </div>
          <div className="bg-white/60 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">导出权限</div>
            <div className="text-2xl font-bold text-green-600">
              {planData.exportLimit < 0 ? "无限" : `${planData.exportLimit} 次`}
            </div>
          </div>
        </div>

        {user.plan !== "PRO" && (
          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
            >
              升级会员 →
            </Link>
          </div>
        )}
      </div>

      {/* 可选套餐 */}
      {user.plan !== "VIP" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 升级套餐</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {(["TRIAL", "PRO", "VIP"] as PlanType[])
              .filter((k) => k !== user.plan)
              .map((key) => {
                const plan = PLANS[key];
                return (
                  <div key={key} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <h4 className="font-semibold text-gray-800">{plan.name}</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{plan.priceLabel}</p>
                    <p className="text-xs text-gray-400 mb-4">{plan.dailyLimit_}</p>
                    <Link
                      href="/pricing"
                      className="block text-center py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      查看详情
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 订单记录 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🧾 订单记录
        </h3>

        {user.orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>暂无订单记录</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    订单号
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    类型
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    金额
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                    时间
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {user.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                      {order.id.slice(-8)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {order.type === "CREDITS"
                        ? "次数包"
                        : order.type === "MONTHLY"
                        ? "月费"
                        : order.type === "YEARLY"
                        ? "年费"
                        : order.type}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          order.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status === "PAID"
                          ? "已支付"
                          : order.status === "PENDING"
                          ? "待支付"
                          : "失败"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
