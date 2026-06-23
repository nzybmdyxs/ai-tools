// ==========================================
// V2 会员体系 — 4 级套餐 + 每日限额
// ==========================================

export type PlanType = "FREE" | "TRIAL" | "PRO" | "VIP";

export interface PlanConfig {
  name: string;
  price: number;           // 价格（元）/ 月
  exportLimit: number;     // -1 = 无限
  dailyLimit: number;      // 每日 AI 生成上限
  dailyLimit_: string;     // 显示文本
  priceLabel: string;      // 价格标签
  features: string[];
  color: string;
}

export const PLANS: Record<PlanType, PlanConfig> = {
  FREE: {
    name: "免费版",
    price: 0,
    exportLimit: 3,
    dailyLimit: 3,
    dailyLimit_: "3 次/天",
    priceLabel: "¥0",
    features: ["3 次免费生成", "3 次导出", "基础图表类型"],
    color: "gray",
  },
  TRIAL: {
    name: "体验包",
    price: 1,
    exportLimit: -1,
    dailyLimit: 10,
    dailyLimit_: "10 次/天",
    priceLabel: "¥1",
    features: ["10 次 AI 生成", "无限导出", "所有图表类型", "永不过期"],
    color: "blue",
  },
  PRO: {
    name: "标准会员",
    price: 19,
    exportLimit: -1,
    dailyLimit: 10,
    dailyLimit_: "每天 10 次",
    priceLabel: "¥19/月",
    features: ["每天 10 次 AI 生成", "无限导出", "所有图表类型", "优先体验新功能"],
    color: "purple",
  },
  VIP: {
    name: "Pro 会员",
    price: 39,
    exportLimit: -1,
    dailyLimit: 50,
    dailyLimit_: "每天 50 次",
    priceLabel: "¥39/月",
    features: ["每天 50 次 AI 生成", "无限导出", "所有图表类型", "高清无水印导出", "优先体验新功能", "专属技术支持"],
    color: "amber",
  },
};

// ===== 游客配置（保持不变） =====
export const GUEST_CONFIG = {
  exportLimit: 1,
  aiCredits: 3,
} as const;

export const GUEST_EXPORT_LIMIT = GUEST_CONFIG.exportLimit;

/** 获取套餐每日限制 */
export function getDailyLimit(plan: string): number {
  const p = PLANS[plan as PlanType];
  return p ? p.dailyLimit : PLANS.FREE.dailyLimit;
}

/** 获取套餐名称 */
export function getPlanName(plan: string): string {
  const p = PLANS[plan as PlanType];
  return p ? p.name : "免费版";
}
