// ==========================================
// NextAuth 类型扩展
// 为 session.user 添加 id 字段
// ==========================================

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
