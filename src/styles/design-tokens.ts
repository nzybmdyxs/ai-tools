// ==========================================
// V2 设计令牌 — 全局排版 / 间距 / 容器
// ==========================================

export const typography = {
  hero: "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight",
  h1: "text-3xl sm:text-4xl font-bold tracking-tight",
  h2: "text-2xl sm:text-3xl font-bold",
  h3: "text-xl sm:text-2xl font-semibold",
  body: "text-base leading-7 text-gray-600",
  small: "text-sm text-gray-500",
  caption: "text-xs text-gray-400",
} as const;

export const spacing = {
  section: "py-14 md:py-20",
  container: "max-w-7xl mx-auto px-4 sm:px-6",
  card: "p-5 sm:p-6",
} as const;

export const radius = {
  card: "rounded-2xl",
  button: "rounded-xl",
  badge: "rounded-full",
} as const;

export const transitions = {
  card: "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
  button: "transition-all duration-150 active:scale-[0.98]",
} as const;
