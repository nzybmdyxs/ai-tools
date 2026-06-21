// ==========================================
// NextAuth 邮件验证等待页面
// /auth/verify
// ==========================================

import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">📧 检查你的邮箱</h1>

        <div className="p-6 bg-blue-50 rounded-2xl">
          <p className="text-blue-700">
            登录链接已发送到你的邮箱，请点击邮件中的链接完成登录。
          </p>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>没收到邮件？</p>
          <ul className="space-y-0.5">
            <li>• 检查垃圾邮件箱</li>
            <li>• 确认邮箱地址是否正确</li>
            <li>• 邮件可能需要 1-2 分钟送达</li>
          </ul>
        </div>

        <Link
          href="/auth/signin"
          className="inline-block text-blue-500 hover:text-blue-600 text-sm transition-colors"
        >
          ← 返回登录
        </Link>
      </div>
    </div>
  );
}
