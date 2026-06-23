// ==========================================
// 导出 API - 游客次数追踪 & 登录用户放行
// POST /api/export
// Body: { deviceId?: string, userId?: string }
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GUEST_EXPORT_LIMIT } from "@/lib/plans";
import { hasUnlimitedAccess } from "@/lib/auth/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // ===== 超级管理员 / 开发绕过：无限导出 =====
    const session = await getServerSession(authOptions);
    if (hasUnlimitedAccess(session)) {
      return NextResponse.json({
        success: true,
        userType: "admin" as const,
        unlimited: true,
        message: "超级管理员，无限导出",
      });
    }

    const body = await req.json();
    const { deviceId, userId } = body;

    // ===== 登录用户：直接放行 =====
    if (userId) {
      // 可选：校验用户是否存在 & Pro/FREE 权限
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "用户不存在" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        userType: "member" as const,
        plan: user.plan,
        unlimited: true,
      });
    }

    // ===== 游客模式 =====
    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json(
        { success: false, error: "请提供设备标识" },
        { status: 400 }
      );
    }

    // 查找或创建游客记录
    let guest = await prisma.guestUsage.findUnique({
      where: { deviceId },
    });

    if (!guest) {
      guest = await prisma.guestUsage.create({
        data: { deviceId, exportCount: 0 },
      });
    }

    // 检查次数是否已用完
    if (guest.exportCount >= GUEST_EXPORT_LIMIT) {
      return NextResponse.json({
        success: false,
        needPay: true,
        userType: "guest" as const,
        message: "免费导出次数已用完，请注册或购买次数包",
      });
    }

    // 扣减次数
    await prisma.guestUsage.update({
      where: { deviceId },
      data: { exportCount: { increment: 1 } },
    });

    const remain = GUEST_EXPORT_LIMIT - guest.exportCount - 1;

    return NextResponse.json({
      success: true,
      userType: "guest" as const,
      remain,
      total: GUEST_EXPORT_LIMIT,
      message: `导出成功，剩余 ${remain} 次免费导出`,
    });
  } catch (error) {
    console.error("导出 API 错误:", error);
    return NextResponse.json(
      { success: false, error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}
