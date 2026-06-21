// ==========================================
// 价格配置
// 后续对接支付时，此处为唯一价格入口
// ==========================================

export const pricing = {
  /** 次数包（一次性购买，不过期） */
  credits: [
    {
      id: "credits-20",
      name: "20 次 AI 生成",
      price: 1,        // 人民币（元）
      credits: 20,
      popular: false,
    },
    {
      id: "credits-100",
      name: "100 次 AI 生成",
      price: 3,
      credits: 100,
      popular: true,   // 推荐标签
    },
  ],

  /** Pro 会员订阅 */
  pro: {
    monthly: {
      id: "pro-monthly",
      name: "Pro 月费会员",
      price: 9.9,
      period: "month" as const,
    },
    yearly: {
      id: "pro-yearly",
      name: "Pro 年费会员",
      price: 59,
      period: "year" as const,
    },
  },
} as const;

/** 价格展示辅助 */
export function formatPrice(price: number): string {
  return `¥${price}`;
}
