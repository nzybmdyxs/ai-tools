import Link from "next/link";
import ToolCard from "@/components/ToolCard";

interface ToolItem {
  title: string;
  href: string;
  desc: string;
  emoji: string;
  tag?: string;
}

interface CategorySectionProps {
  title: string;
  desc?: string;
  tools: ToolItem[];
  moreHref?: string;
  moreLabel?: string;
}

export default function CategorySection({
  title,
  desc,
  tools,
  moreHref,
  moreLabel = "查看更多 →",
}: CategorySectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {desc && <p className="text-gray-500 mt-1">{desc}</p>}
        </div>
        {moreHref && (
          <Link
            href={moreHref}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            {moreLabel}
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </section>
  );
}
