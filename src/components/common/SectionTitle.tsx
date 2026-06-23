// ==========================================
// 通用区块标题
// ==========================================

import Link from "next/link";

interface SectionTitleProps {
  title: string;
  description?: string;
  moreHref?: string;
  moreLabel?: string;
}

export function SectionTitle({ title, description, moreHref, moreLabel }: SectionTitleProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
        {description && <p className="text-gray-500 mt-2">{description}</p>}
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="text-sm text-blue-600 hover:underline flex-shrink-0 ml-4"
        >
          {moreLabel || "查看全部"} →
        </Link>
      )}
    </div>
  );
}
