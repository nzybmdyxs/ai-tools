// ==========================================
// 图表加载骨架屏
// ==========================================

interface Props {
  step?: string;
}

const STEPS = [
  "正在分析需求...",
  "正在生成图表...",
  "正在校验语法...",
  "正在优化渲染...",
];

export function DiagramSkeleton({ step }: Props) {
  const displayStep = step || STEPS[0];

  return (
    <div className="animate-fade-in">
      {/* 步骤提示 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-blue-600 font-medium">{displayStep}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-6 rounded-full transition-all duration-500 ${
                STEPS.indexOf(displayStep) >= i
                  ? "bg-blue-400"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 骨架预览框 */}
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
        <div className="p-8 space-y-4">
          {/* 模拟图表内容 */}
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-4 mt-6">
              <div className="flex-1 space-y-2">
                <div className="h-20 bg-gray-200 rounded-lg" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-20 bg-gray-200 rounded-lg" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-20 bg-gray-200 rounded-lg" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
