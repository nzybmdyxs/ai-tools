"use client";

import { useState, use } from "react";
import Link from "next/link";
import InputBox from "@/components/InputBox";
import DiagramBox from "@/components/DiagramBox";
import { cleanMermaidCode } from "@/lib/mermaid";
import type { DiagramType, ERNotation, GenerationMode } from "@/types/diagram";

/**
 * 工具配置表 — JSON 驱动，新增工具只需添加配置
 */
const TOOL_CONFIG: Record<
  string,
  {
    name: string;
    desc: string;
    placeholder: string;
    defaultType: string;
    showTypeSelector: boolean;
    category: string;
  }
> = {
  "essay-outline": {
    name: "论文大纲生成器",
    desc: "输入论文主题或研究方向，AI 自动生成完整的论文大纲和章节结构",
    placeholder: "例如：基于深度学习的图像识别算法研究",
    defaultType: "mindmap",
    showTypeSelector: false,
    category: "学生工具",
  },
  "essay-abstract": {
    name: "论文摘要生成器",
    desc: "输入论文主题或正文片段，AI 自动生成高质量摘要",
    placeholder: "例如：本文研究了...",
    defaultType: "mindmap",
    showTypeSelector: false,
    category: "学生工具",
  },
  "literature-review": {
    name: "文献综述生成器",
    desc: "输入研究方向，AI 帮你梳理研究现状并生成文献综述框架",
    placeholder: "例如：自然语言处理在医疗领域的应用研究",
    defaultType: "mindmap",
    showTypeSelector: false,
    category: "学生工具",
  },
  "json-formatter": {
    name: "JSON 格式化",
    desc: "粘贴 JSON 字符串，自动格式化和校验",
    placeholder: '例如：{"name":"张三","age":25}',
    defaultType: "mindmap",
    showTypeSelector: false,
    category: "程序员工具",
  },
  "sql-generator": {
    name: "SQL 生成器",
    desc: "用自然语言描述查询需求，AI 自动生成 SQL 语句",
    placeholder: "例如：查询所有年龄大于18岁的用户，按注册时间降序排列",
    defaultType: "mindmap",
    showTypeSelector: false,
    category: "程序员工具",
  },
  "uuid-generator": {
    name: "UUID 生成器",
    desc: "快速生成 UUID，支持 v1/v4 格式",
    placeholder: "点击生成按钮即可",
    defaultType: "mindmap",
    showTypeSelector: false,
    category: "程序员工具",
  },
  "er-diagram-generator": {
    name: "ER 图生成器",
    desc: "输入数据库需求描述，AI 自动生成 ER 图",
    placeholder: "例如：用户（id, 用户名, 邮箱） 订单（id, 用户id, 金额）",
    defaultType: "er",
    showTypeSelector: true,
    category: "制图工具",
  },
  "uml-generator": {
    name: "UML 生成器",
    desc: "输入类描述，AI 自动生成 UML 类图",
    placeholder: "例如：Animal 类有 name 属性和 eat 方法，Dog 继承 Animal",
    defaultType: "uml",
    showTypeSelector: true,
    category: "制图工具",
  },
};

export default function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const config = TOOL_CONFIG[slug];

  const [text, setText] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>(
    (config?.defaultType as DiagramType) || "flowchart"
  );
  const [erNotation, setERNotation] = useState<ERNotation>("crows-foot");
  const [generationMode, setGenerationMode] = useState<GenerationMode>("ai");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawCode, setRawCode] = useState("");

  // 未匹配到工具配置
  if (!config) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          工具未找到
        </h1>
        <p className="text-gray-500 mb-6">
          没有找到 &quot;{slug}&quot; 对应的工具
        </p>
        <Link
          href="/apps"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← 返回工具导航
        </Link>
      </div>
    );
  }

  const generate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), type: diagramType, generationMode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "请求失败");
      }

      const cleaned = cleanMermaidCode(data.result);
      setRawCode(data.result);
      setResult(cleaned);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "生成失败，请稍后重试";
      setError(message);
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    const codeToCopy = rawCode || result;
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy);
  };

  const downloadSVG = () => {
    const svgEl = document.querySelector(".diagram-container svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.name}-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* 面包屑 */}
      <nav className="text-sm text-gray-400">
        <Link href="/" className="hover:text-blue-600">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/apps" className="hover:text-blue-600">
          工具导航
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{config.name}</span>
      </nav>

      {/* 标题 */}
      <div>
        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mb-3">
          {config.category}
        </span>
        <h1 className="text-3xl font-bold text-gray-800">
          {config.name}
        </h1>
        <p className="text-gray-500 mt-2 text-lg">{config.desc}</p>
      </div>

      {/* 输入区域 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          ✏️ 输入内容
        </h2>
        <InputBox
          text={text}
          diagramType={diagramType}
          erNotation={erNotation}
          generationMode={generationMode}
          loading={loading}
          onTextChange={(t) => {
            setText(t);
            setError("");
          }}
          onDiagramTypeChange={setDiagramType}
          onERNotationChange={setERNotation}
          onGenerationModeChange={setGenerationMode}
          onGenerate={generate}
        />
      </section>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-red-700 font-medium">生成失败</p>
          </div>
          <p className="text-red-600 text-sm mt-1 ml-7">{error}</p>
        </div>
      )}

      {/* 结果展示 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            📈 生成结果
          </h2>
          {result && (
            <div className="flex gap-2">
              <button
                onClick={copyCode}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                📋 复制代码
              </button>
              <button
                onClick={downloadSVG}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                📥 下载 SVG
              </button>
            </div>
          )}
        </div>

        <div className="diagram-container">
          <DiagramBox code={result} />
        </div>

        {rawCode && (
          <details className="mt-4">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              📝 查看源代码
            </summary>
            <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-x-auto max-h-64 overflow-y-auto">
              {rawCode}
            </pre>
          </details>
        )}
      </section>
    </div>
  );
}
