// ==========================================
// 邀请链接重定向处理
// GET /api/invite/redirect?code=XXX&callback=/tools/tool
//
// 用户通过邀请链接注册后，自动绑定邀请关系
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") || "";
  const callback = url.searchParams.get("callback") || "/tools/tool";

  // 未携带邀请码，直接跳转
  if (!code) {
    return NextResponse.redirect(new URL(callback, req.url));
  }

  // 尝试绑定邀请关系
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, inviterId: true },
      });

      if (user && !user.inviterId) {
        const inviter = await prisma.user.findUnique({
          where: { inviteCode: code.toUpperCase() },
          select: { id: true },
        });

        if (inviter && inviter.id !== user.id) {
          await prisma.user.update({
            where: { id: user.id },
            data: { inviterId: inviter.id },
          });

          await prisma.user.update({
            where: { id: inviter.id },
            data: { credits: { increment: 10 } },
          });
        }
      }
    }
  } catch {
    // 静默失败，不影响用户体验
  }

  return NextResponse.redirect(new URL(callback, req.url));
}
