// ==========================================
// NextAuth 共享配置
// 从 route handler 中分离，避免 Next.js App Router 类型检查问题
// ==========================================

import type { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/** 生成 8 位邀请码（去掉易混淆字符 0/O/1/I） */
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || "",
      from: process.env.EMAIL_FROM || "AI工具集 <noreply@aitools.com>",
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id?: string }).id = user.id;
      }
      return session;
    },
  },

  events: {
    /** 新用户注册时自动生成邀请码 */
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { inviteCode: generateInviteCode() },
      });
    },
  },
};
