// ==========================================
// 收藏夹页面
// /dashboard/favorites
// ==========================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FavoriteList } from "./FavoriteList";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = Object.fromEntries(
  Object.values(DIAGRAM_CONFIG).map((c) => [c.value, c.label])
);

export default async function FavoritesPage() {
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

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // 通过 favorite 中的 diagramId 获取对应图表
  const diagramIds = favorites.map((f) => f.diagramId);
  const diagrams =
    diagramIds.length > 0
      ? await prisma.diagram.findMany({
          where: { id: { in: diagramIds } },
          orderBy: { createdAt: "desc" },
        })
      : [];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">⭐ 收藏夹</h1>

      {diagrams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            还没有收藏
          </h2>
          <p className="text-gray-500 mb-6">
            在历史记录中点击收藏按钮，方便以后查看
          </p>
          <Link
            href="/dashboard/history"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            浏览历史记录
          </Link>
        </div>
      ) : (
        <FavoriteList
          initialFavorites={favorites}
          diagrams={diagrams}
          typeLabels={typeLabels}
        />
      )}
    </div>
  );
}
