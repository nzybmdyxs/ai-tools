"use client";

// ==========================================
// App Providers — SessionProvider 等客户端包裹
// ==========================================

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
