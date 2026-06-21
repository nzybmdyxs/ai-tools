import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Providers } from "@/components/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "AI工具集合站 - 论文/作业/编程/系统设计一站式工具",
    template: "%s - AI工具集合站",
  },
  description:
    "免费在线AI工具集合，支持流程图、ER图、UML类图生成，学生论文工具，程序员开发工具，SEO教程博客",
  keywords: "AI工具,流程图生成,ER图,UML,学生工具,程序员工具,在线制图",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <NavBar />

          {/* 主内容 */}
          <main className="flex-1">{children}</main>

          {/* 底部 */}
          <footer className="border-t border-gray-200 bg-white py-10 text-center text-sm text-gray-400">
            <div className="max-w-6xl mx-auto px-4 space-y-2">
              <p className="text-gray-500 font-medium">
                🧠 AI 工具集合站 — 一站式论文 / 作业 / 编程 / 系统设计工具
              </p>
              <p>
                Powered by DeepSeek + Next.js + Mermaid
              </p>
              <div className="flex justify-center gap-6 pt-2">
                <a href="/tools" className="hover:text-blue-600 transition-colors">制图工具</a>
                <a href="/students" className="hover:text-blue-600 transition-colors">学生工具</a>
                <a href="/dev-tools" className="hover:text-blue-600 transition-colors">程序员工具</a>
                <a href="/blog" className="hover:text-blue-600 transition-colors">博客</a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
