// ==========================================
// NextAuth 错误页面
// /auth/error
// ==========================================

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || "未知错误";

  const errorMessages: Record<string, string> = {
    Configuration: "服务器配置错误，请联系管理员",
    AccessDenied: "访问被拒绝",
    Verification: "验证链接已过期或无效",
    Default: "登录过程中出现错误，请重试",
    EmailSignin: "发送邮件失败，请检查邮箱配置",
    OAuthSignin: "第三方登录失败",
    OAuthCallback: "第三方登录回调失败",
  };

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">⚠️ 登录失败</h1>

      <div className="p-6 bg-red-50 rounded-2xl">
        <p className="text-red-700">{message}</p>
        {error !== "Default" && (
          <p className="text-red-400 text-xs mt-2">错误代码：{error}</p>
        )}
      </div>

      <div className="space-y-3">
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
        >
          重新登录
        </Link>
        <br />
        <Link
          href="/"
          className="inline-block text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="text-center text-gray-400">加载中...</div>
          }
        >
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
