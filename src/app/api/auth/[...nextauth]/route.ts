// ==========================================
// NextAuth 鉴权路由
// 使用 Email Provider（魔法链接登录）
// ==========================================

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
