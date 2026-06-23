// ==========================================
// 统一获取当前用户（自动处理开发绕过 / 超级管理员）
// 替代各处重复的 getServerSession + prisma.user.findUnique
// ==========================================

import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasUnlimitedAccess, isDevBypass } from "./admin";
import { getDevUser } from "./dev-user";

export interface CurrentUser {
  /** NextAuth session（开发模式为模拟值） */
  session: Session | null;
  /** 是否超级管理员 或 开发绕过模式 */
  isSuperAdmin: boolean;
  /** 用户邮箱 */
  email: string | null;
  /** 数据库用户 ID */
  dbId: string | null;
  /** 数据库用户完整记录 */
  dbUser: {
    id: string;
    plan: string;
    credits: number;
    email: string;
    createdAt: Date;
  } | null;
}

/** 统一获取当前用户（含权限信息 + 数据库记录） */
export async function getCurrentUser(): Promise<CurrentUser> {
  // 开发环境绕过模式
  if (isDevBypass()) {
    const devUser = getDevUser();

    // 尝试查找或创建开发用户
    let dbUser = await prisma.user.findUnique({
      where: { email: devUser.email },
      select: { id: true, plan: true, credits: true, email: true, createdAt: true },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: devUser.email,
          plan: "PRO",
          credits: -1,
          inviteCode: "DEVADMIN",
        },
        select: { id: true, plan: true, credits: true, email: true, createdAt: true },
      });
    }

    return {
      session: {
        user: { id: dbUser.id, email: devUser.email, name: devUser.name },
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      isSuperAdmin: true,
      email: devUser.email,
      dbId: dbUser.id,
      dbUser,
    };
  }

  // 正常鉴权
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      session: null,
      isSuperAdmin: false,
      email: null,
      dbId: null,
      dbUser: null,
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, plan: true, credits: true, email: true, createdAt: true },
  });

  return {
    session,
    isSuperAdmin: hasUnlimitedAccess(session),
    email: session.user.email,
    dbId: dbUser?.id ?? null,
    dbUser,
  };
}
