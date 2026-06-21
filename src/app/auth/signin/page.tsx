// ==========================================
// 登录页面
// /auth/signin
// ==========================================

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("请输入有效的邮箱地址");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/tools/tool",
      });

      if (result?.error) {
        setError("发送失败，请稍后重试");
      } else {
        setSent(true);
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {sent ? "📧 邮件已发送" : "👋 登录 / 注册"}
          </h1>
          <p className="text-gray-500">
            {sent
              ? "请查看邮箱中的登录链接（注意检查垃圾箱）"
              : "输入邮箱，我们会发送一个魔法链接"}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="p-6 bg-green-50 rounded-2xl">
              <p className="text-green-700 text-sm">
                登录链接已发送至 <strong>{email}</strong>
              </p>
              <p className="text-green-500 text-xs mt-2">
                点击邮件中的链接即可完成登录
              </p>
            </div>

            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-blue-500 hover:text-blue-600 text-sm transition-colors"
            >
              ← 更换邮箱
            </button>

            <div className="text-xs text-gray-400 space-y-1">
              <p>没收到邮件？</p>
              <ul className="space-y-0.5">
                <li>• 检查垃圾邮件箱</li>
                <li>• 确认邮箱地址是否正确</li>
                <li>• 邮件服务器可能需要 1-2 分钟</li>
                <li>• 联系 webtools@example.com</li>
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-gray-800 placeholder:text-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "发送中..." : "发送登录链接"}
            </button>

            <div className="text-center text-xs text-gray-400">
              <p>
                没有账号？输入邮箱自动注册
              </p>
              <p className="mt-1">
                登录即表示同意{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  服务条款
                </a>{" "}
                和{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  隐私政策
                </a>
              </p>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-400">或者</span>
              </div>
            </div>

            <Link
              href="/"
              className="block text-center py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              ← 先逛逛，稍后注册
            </Link>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            查看会员方案 →
          </Link>
        </div>
      </div>
    </div>
  );
}
