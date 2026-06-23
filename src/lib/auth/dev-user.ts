// ==========================================
// 开发环境模拟用户
// DEV_BYPASS=true 时，所有请求使用此身份
// ==========================================

export interface DevUser {
  id: string;
  email: string;
  name: string;
}

/** 获取开发环境模拟用户 */
export function getDevUser(): DevUser {
  return {
    id: "dev-user",
    email: process.env.SUPER_ADMIN_EMAIL || "dev@aitools.local",
    name: "Developer",
  };
}
