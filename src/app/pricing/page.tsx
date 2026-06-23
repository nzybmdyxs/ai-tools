// ==========================================
// 价格页面 — V2 升级版
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import BuyButton from "@/components/BuyButton";
import { PLANS, type PlanType } from "@/lib/plans";

export const metadata: Metadata = {
  title: "升级会员 — 解锁无限AI生成",
  description: "选择适合你的方案：免费版 3次/天、体验包 10次 ¥1、标准会员 10次/天 ¥19/月、Pro会员 50次/天 ¥39/月。",
};

const planKeys: PlanType[] = ["FREE", "TRIAL", "PRO", "VIP"];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
      {/* 标题 */}
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          💎 选择你的方案
        </h1>
        <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto">
          从免费开始，随需求升级。次数包永不过期，Pro 会员无限使用。
        </p>
      </div>

      {/* 四栏方案 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {planKeys.map((key) => {
          const plan = PLANS[key];
          const isHighlight = key === "PRO";
          return (
            <div
              key={key}
              className={`rounded-2xl p-6 flex flex-col ${
                isHighlight
                  ? "border-2 border-purple-500 bg-white shadow-xl ring-1 ring-purple-500/20"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-800">{plan.name}</h2>
                <div className="mt-2 flex items-baseline gap-0.5">
                  <span className="text-3xl font-extrabold text-gray-800">{plan.priceLabel}</span>
                  {plan.price > 0 && <span className="text-sm text-gray-400">/月</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">{plan.dailyLimit_}</p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {key === "FREE" ? (
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center py-2.5 rounded-xl font-medium text-sm border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    免费注册
                  </Link>
                ) : (
                  <BuyButton
                    productId={`plan-${key.toLowerCase()}`}
                    label={key === "TRIAL" ? "立即购买" : "升级"}
                    className={`block w-full text-center py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isHighlight
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部 */}
      <div className="text-center mt-12 text-sm text-gray-400 space-y-1">
        <p>💡 次数包购买后永不过期，Pro 会员支持月付/年付</p>
        <p>📧 问题联系 webtools@example.com · *支付渠道即将上线</p>
      </div>
    </div>
  );
}
