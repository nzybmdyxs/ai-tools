// ==========================================
// 价格页面
// /pricing
// ==========================================

import Link from "next/link";
import { pricing, formatPrice } from "@/lib/pricing";
import type { Metadata } from "next";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "升级会员",
  description: "解锁无限AI生成和导出，选择适合你的方案",
};

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🚀 升级会员
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          选择适合你的方案，解锁无限 AI 生成和导出功能
        </p>
      </div>

      {/* 三栏方案 */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {/* 免费版 */}
        <div className="border-2 border-gray-200 rounded-2xl p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🆓 免费版</h2>
            <p className="text-gray-500 text-sm">适合偶尔使用</p>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-800">¥0</span>
            <span className="text-gray-400 text-sm ml-1">/ 永久</span>
          </div>

          <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>免费导出 3 次</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>注册送 30 次 AI 生成</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-300 mt-0.5">✗</span>
              <span className="text-gray-400">无限导出</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-300 mt-0.5">✗</span>
              <span className="text-gray-400">无限 AI 生成</span>
            </li>
          </ul>

          <Link
            href="/auth/signin"
            className="block text-center py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            免费注册
          </Link>
        </div>

        {/* 次数包 */}
        <div className="border-2 border-blue-400 rounded-2xl p-8 flex flex-col relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            🔥 推荐
          </span>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">📦 次数包</h2>
            <p className="text-gray-500 text-sm">按需购买，永不过期</p>
          </div>

          {pricing.credits.map((pkg) => (
            <div
              key={pkg.id}
              className="mb-4 last:mb-6 p-4 bg-blue-50 rounded-xl"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-800">{pkg.name}</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(pkg.price)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                约 {pkg.price / pkg.credits > 0.05
                  ? formatPrice(pkg.price / pkg.credits)
                  : "< ¥0.05"}{" "}
                / 次
              </p>
            </div>
          ))}

          <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>AI 生成 +{pricing.credits[0].credits}~{pricing.credits[1].credits} 次</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>注册用户无限导出</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>次数永不过期</span>
            </li>
          </ul>

          <div className="flex flex-col gap-2">
            {pricing.credits.map((pkg) => (
              <BuyButton
                key={pkg.id}
                productId={pkg.id}
                label={`购买 ${pkg.name}`}
                className="block w-full text-center py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Pro 会员 */}
        <div className="border-2 border-purple-200 rounded-2xl p-8 flex flex-col bg-gradient-to-b from-purple-50/50 to-white">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">👑 Pro 会员</h2>
            <p className="text-gray-500 text-sm">重度用户首选</p>
          </div>

          <div className="mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-purple-600">
                {formatPrice(pricing.pro.monthly.price)}
              </span>
              <span className="text-gray-400 text-sm">/ 月</span>
            </div>
          </div>

          <div className="mb-6 p-3 bg-purple-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700 font-medium">年付更省</span>
              <span className="text-xl font-bold text-purple-600">
                {formatPrice(pricing.pro.yearly.price)}
                <span className="text-sm font-normal text-purple-400">/ 年</span>
              </span>
            </div>
            <p className="text-xs text-purple-400 mt-1">
              约 {formatPrice(pricing.pro.yearly.price / 12)} / 月，省{" "}
              {formatPrice(pricing.pro.monthly.price * 12 - pricing.pro.yearly.price)}
            </p>
          </div>

          <ul className="space-y-3 mb-8 flex-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>无限 AI 生成</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>无限导出</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>优先体验新功能</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>去水印 / 高清导出</span>
            </li>
          </ul>

          <div className="space-y-2">
            <BuyButton
              productId={pricing.pro.monthly.id}
              label={`${formatPrice(pricing.pro.monthly.price)}/月 开通 Pro`}
              className="block w-full text-center py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors"
            />
            <BuyButton
              productId={pricing.pro.yearly.id}
              label={`${formatPrice(pricing.pro.yearly.price)}/年 开通 Pro`}
              className="block w-full text-center py-3 rounded-xl border-2 border-purple-200 text-purple-600 font-semibold hover:bg-purple-50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 底部说明 */}
      <div className="text-center text-sm text-gray-400 space-y-2">
        <p>💡 所有方案均支持随时升级，次数包购买后永不过期</p>
        <p>📧 有任何问题？联系 webtools@example.com</p>
        <p className="text-xs text-gray-300 mt-4">
          * 支付接口已预留，即将接入微信支付 / 支付宝
        </p>
      </div>
    </div>
  );
}
