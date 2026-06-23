// ==========================================
// 用户权限配置
// 定义不同用户层级的导出/生成权限
// ==========================================

export const PLAN_CONFIG = {
  /** 游客（未登录，按设备 ID 追踪） */
  guest: {
    /** 免费导出次数上限 */
    exportLimit: 1,
    /** 游客可免费使用 AI 生成 3 次（先体验，再注册） */
    aiCredits: 3,
  },

  /** 免费注册用户 */
  free: {
    /** 注册即送 AI 生成次数 */
    aiCredits: 30,
    /** 注册用户无限导出 */
    exportUnlimited: true,
  },

  /** Pro 会员 */
  pro: {
    /** -1 表示无限 */
    aiCredits: -1,
    /** Pro 用户无限导出 */
    exportUnlimited: true,
  },
} as const;

/** 游客导出上限 */
export const GUEST_EXPORT_LIMIT = PLAN_CONFIG.guest.exportLimit;

/** 免费用户初始赠送次数 */
export const FREE_CREDITS = PLAN_CONFIG.free.aiCredits;
