// ==========================================
// 邀请好友页面
// /dashboard/invite
// ==========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InviteContent } from "./InviteContent";

export const dynamic = "force-dynamic";

export default async function InvitePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      inviteCode: true,
      inviterId: true,
      credits: true,
      _count: { select: { invitees: true } },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const invitees = await prisma.user.findMany({
    where: { inviterId: user.id },
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  let inviter: { email: string } | null = null;
  if (user.inviterId) {
    inviter = await prisma.user.findUnique({
      where: { id: user.inviterId },
      select: { email: true },
    });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/auth/signin?invite=${user.inviteCode}`;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🎁 邀请好友</h1>
      <p className="text-gray-500 mb-8">邀请好友使用 AI工具集，双方都能获得奖励</p>

      {/* 奖励规则 */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="text-lg font-bold text-green-800 mb-1">好友注册</h3>
          <p className="text-sm text-green-600 mb-2">
            每邀请 1 人注册，你获得
          </p>
          <span className="text-3xl font-bold text-green-600">+10</span>
          <span className="text-green-500 ml-1">次 AI 生成</span>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
          <div className="text-3xl mb-2">💎</div>
          <h3 className="text-lg font-bold text-purple-800 mb-1">好友付费</h3>
          <p className="text-sm text-purple-600 mb-2">
            每邀请 1 人付费，你获得
          </p>
          <span className="text-3xl font-bold text-purple-600">+50</span>
          <span className="text-purple-500 ml-1">次 AI 生成</span>
        </div>
      </div>

      {/* 邀请链接 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🔗 你的专属邀请链接
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <code className="flex-1 p-3 bg-gray-50 rounded-xl text-sm text-gray-700 break-all border border-gray-200">
            {inviteUrl}
          </code>
        </div>

        <InviteContent inviteUrl={inviteUrl} />

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">邀请码：</span>
            <span className="font-mono font-bold text-blue-600 text-lg tracking-wider">
              {user.inviteCode}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">已邀请：</span>
            <span className="font-bold text-gray-800">{user._count.invitees} 人</span>
          </div>
        </div>
      </div>

      {/* 我的邀请人 */}
      {inviter && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">👤 我的邀请人</h3>
          <p className="text-sm text-gray-600">
            你是通过 <span className="font-medium text-blue-600">{inviter.email}</span> 的邀请链接注册的
          </p>
        </div>
      )}

      {/* 已邀请用户列表 */}
      {invitees.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              👥 已邀请用户（{invitees.length} 人）
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">
                  邮箱
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">
                  注册时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invitees.map((invitee) => (
                <tr key={invitee.id}>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {invitee.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(invitee.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
