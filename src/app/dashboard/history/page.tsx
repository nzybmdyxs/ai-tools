// ==========================================
// 历史记录页面
// /dashboard/history
// ==========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HistoryList } from "./HistoryList";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = Object.fromEntries(
  Object.values(DIAGRAM_CONFIG).map((c) => [c.value, c.label])
);

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const diagrams = await prisma.diagram.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📋 历史记录</h1>
        <Link
          href="/tools/tool"
          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors"
        >
          + 新建图表
        </Link>
      </div>

      {diagrams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            暂无历史记录
          </h2>
          <p className="text-gray-500 mb-6">
            使用 AI 生成图表后会自动保存在这里
          </p>
          <Link
            href="/tools/tool"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            去生成第一个图表
          </Link>
        </div>
      ) : (
        <HistoryList diagrams={diagrams} typeLabels={typeLabels} />
      )}
    </div>
  );
}
