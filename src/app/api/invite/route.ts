// ==========================================
// 邀请 API
// GET /api/invite — 获取当前用户的邀请信息
// POST /api/invite — 接受邀请（{ inviteCode }）
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** 获取当前用户的邀请码和已邀请的用户列表 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
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
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 获取被邀请的用户列表
    const invitees = await prisma.user.findMany({
      where: { inviterId: user.id },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 获取邀请人信息（如果我是被邀请的）
    let inviter: { email: string } | null = null;
    if (user.inviterId) {
      inviter = await prisma.user.findUnique({
        where: { id: user.inviterId },
        select: { email: true },
      });
    }

    return NextResponse.json({
      inviteCode: user.inviteCode,
      inviteUrl: `${process.env.NEXTAUTH_URL || ""}/auth/signin?invite=${user.inviteCode}`,
      invitedCount: user._count.invitees,
      invitees,
      inviter: inviter ? { email: inviter.email } : null,
      myCredits: user.credits,
    });
  } catch (error) {
    console.error("获取邀请信息失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

/** 接受邀请：当前登录用户输入他人的邀请码 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, inviterId: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 已经被人邀请过就不再处理
    if (currentUser.inviterId) {
      return NextResponse.json({
        success: false,
        message: "你已经绑定过邀请人了",
      });
    }

    const { inviteCode } = await req.json();

    if (!inviteCode || typeof inviteCode !== "string") {
      return NextResponse.json({ error: "请输入有效的邀请码" }, { status: 400 });
    }

    // 查找邀请人
    const inviter = await prisma.user.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
      select: { id: true },
    });

    if (!inviter) {
      return NextResponse.json({ error: "邀请码无效" }, { status: 404 });
    }

    // 不能邀请自己
    if (inviter.id === currentUser.id) {
      return NextResponse.json({ error: "不能邀请自己" }, { status: 400 });
    }

    // 更新当前用户的 inviterId
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { inviterId: inviter.id },
    });

    // 给邀请人 +10 次生成
    await prisma.user.update({
      where: { id: inviter.id },
      data: { credits: { increment: 10 } },
    });

    return NextResponse.json({
      success: true,
      message: "邀请绑定成功，邀请人已获得 10 次奖励！",
    });
  } catch (error) {
    console.error("接受邀请失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
