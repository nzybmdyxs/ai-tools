// ==========================================
// V2 导航配置 — 全局导航栏
// ==========================================

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/", icon: "🏠" },
  { label: "AI 制图", href: "/tools", icon: "🤖" },
  { label: "学生工具", href: "/student", icon: "🎓" },
  { label: "程序员工具", href: "/developer", icon: "👨‍💻" },
  { label: "模板中心", href: "/templates", icon: "📦" },
  { label: "排行榜", href: "/ranking", icon: "🔥" },
  { label: "博客", href: "/blog", icon: "📝" },
  { label: "价格", href: "/pricing", icon: "💎" },
];
