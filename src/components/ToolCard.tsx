import Link from "next/link";

interface ToolCardProps {
  title: string;
  href: string;
  desc?: string;
  emoji?: string;
  tag?: string;
}

export default function ToolCard({ title, href, desc, emoji, tag }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      {emoji && <span className="text-3xl block mb-3">{emoji}</span>}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        {tag && (
          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
            {tag}
          </span>
        )}
      </div>
      {desc && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>}
      <div className="mt-3 text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        立即使用 →
      </div>
    </Link>
  );
}
