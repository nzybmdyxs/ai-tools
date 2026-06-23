// ==========================================
// 超级管理员 & 开发环境权限工具
// ==========================================

import type { Session } from "next-auth";

/** 检查邮箱是否为超级管理员 */
export function isSuperAdmin(email?: string | null): boolean {
  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/** 开发环境是否启用绕过登录模式 */
export function isDevBypass(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_BYPASS === "true"
  );
}

/** 是否拥有无限权限（超级管理员 或 开发绕过模式） */
export function hasUnlimitedAccess(session?: Session | null): boolean {
  if (isDevBypass()) return true;
  return isSuperAdmin(session?.user?.email);
}
