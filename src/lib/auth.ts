// ==========================================
// NextAuth 共享配置
// 从 route handler 中分离，避免 Next.js App Router 类型检查问题
// ==========================================

import type { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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
        // 将数据库用户 ID 注入 session
        (session.user as { id?: string }).id = user.id;
      }
      return session;
    },
  },
};
