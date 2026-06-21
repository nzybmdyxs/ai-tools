"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InputBox from "@/components/InputBox";
import DiagramBox from "@/components/DiagramBox";
import { TYPE_LABELS } from "@/lib/prompt";
import { cleanMermaidCode } from "@/lib/mermaid";
import Link from "next/link";
import { useSession } from "next-auth/react";

function ToolContent() {
  const searchParams = useSearchParams();
  const loadId = searchParams?.get("load") || "";
  const templateId = searchParams?.get("template") || "";

  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id || "";

  const [text, setText] = useState("");
  const [type, setType] = useState("flow");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawCode, setRawCode] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // 加载已有图表或模板
  useEffect(() => {
    if (loadId) {
      loadDiagram(loadId);
    } else if (templateId) {
      loadTemplate(templateId);
    }
  }, [loadId, templateId]);

  const loadDiagram = async (id: string) => {
    try {
      const res = await fetch(`/api/diagrams?id=${id}`);
      const data = await res.json();
      if (data.diagram) {
        setText(data.diagram.prompt || "");
        setType(data.diagram.type);
        setResult(data.diagram.result);
        setRawCode(data.diagram.result);
        setSavedId(data.diagram.id);
      }
    } catch {
      // 静默忽略加载错误
    }
  };

  const loadTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/templates`);
      const data = await res.json();
      const template = data.templates?.find((t: { id: string }) => t.id === id);
      if (template) {
        setText(template.description || "");
        setResult(template.code || "");
        setRawCode(template.code || "");
        // 根据模板内容推断类型
        if (template.code?.startsWith("erDiagram")) setType("er");
        else if (template.code?.startsWith("graph")) setType("flow");
        else if (template.code?.startsWith("classDiagram")) setType("uml");
        else if (template.code?.startsWith("sequenceDiagram")) setType("sequence");
        else if (template.code?.startsWith("gantt")) setType("gantt");
        else if (template.code?.startsWith("mindmap")) setType("mindmap");
      }
    } catch {
      // 静默忽略
    }
  };

  const generate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult("");
    setSavedId(null);
    setFavorited(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), type, userId: userId || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needUpgrade) {
          throw new Error("AI 生成次数已用完，请购买次数包或升级 Pro 会员");
        }
        if (data.needLogin) {
          throw new Error("请先登录后使用 AI 生成功能");
        }
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

  /** 保存到历史记录 */
  const saveToHistory = async () => {
    if (!userId || !result) return;

    setSaving(true);
    setSaveMsg("");

    try {
      // 自动生成标题：使用输入文本的前 30 个字符
      const title =
        text.trim().slice(0, 30) + (text.trim().length > 30 ? "..." : "");

      const res = await fetch("/api/diagrams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `未命名${TYPE_LABELS[type]}`,
          type,
          prompt: text.trim(),
          result: rawCode || result,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSavedId(data.diagram.id);
        setSaveMsg("✅ 已保存到历史记录");
        setTimeout(() => setSaveMsg(""), 3000);
      } else {
        setSaveMsg("⚠️ 保存失败，请重试");
      }
    } catch {
      setSaveMsg("⚠️ 保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  /** 添加/取消收藏 */
  const toggleFavorite = async () => {
    if (!userId || !savedId) return;

    try {
      if (favorited) {
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diagramId: savedId }),
        });
        setFavorited(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ diagramId: savedId }),
        });
        setFavorited(true);
      }
    } catch {
      // 静默忽略
    }
  };

  const copyCode = () => {
    const codeToCopy = rawCode || result;
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      const btn = document.getElementById("copy-btn");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = "✅ 已复制";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1500);
      }
    });
  };

  const downloadSVG = () => {
    const svgEl = document.querySelector(".diagram-container svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `结构图-${TYPE_LABELS[type]}-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400">
        <Link href="/" className="hover:text-blue-600">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-blue-600">
          制图工具
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">AI 结构图生成器</span>
      </div>

      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          🤖 AI 结构图生成器
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          输入文字描述，AI 自动生成专业的 Mermaid 结构图 — 支持{" "}
          {Object.keys(TYPE_LABELS).length} 种图表类型
        </p>
      </div>

      {/* 输入区域 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          ✏️ 输入内容
        </h2>
        <InputBox
          text={text}
          type={type}
          loading={loading}
          onTextChange={(t) => {
            setText(t);
            setError("");
          }}
          onTypeChange={setType}
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
          {error.includes("登录") && (
            <div className="mt-3 ml-7">
              <Link
                href="/auth/signin"
                className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
              >
                去登录 →
              </Link>
            </div>
          )}
          {error.includes("次数已用完") && (
            <div className="mt-3 ml-7">
              <Link
                href="/pricing"
                className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
              >
                升级会员 →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 结果展示 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            📈 生成结果
            {result && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                - {TYPE_LABELS[type]}
              </span>
            )}
          </h2>
          {result && (
            <div className="flex gap-2">
              <button
                id="copy-btn"
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
              {userId && (
                <>
                  <button
                    onClick={saveToHistory}
                    disabled={saving}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  >
                    {saving ? "保存中..." : savedId ? "✅ 已保存" : "💾 保存"}
                  </button>
                  {savedId && (
                    <button
                      onClick={toggleFavorite}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        favorited
                          ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                          : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {favorited ? "⭐ 已收藏" : "☆ 收藏"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 保存状态提示 */}
        {saveMsg && (
          <div
            className={`mb-3 text-xs px-3 py-1.5 rounded-lg ${
              saveMsg.startsWith("✅")
                ? "bg-green-50 text-green-600"
                : "bg-yellow-50 text-yellow-600"
            }`}
          >
            {saveMsg}
          </div>
        )}

        <div className="diagram-container">
          <DiagramBox code={result} />
        </div>

        {rawCode && (
          <details className="mt-4">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              📝 查看 Mermaid 源代码
            </summary>
            <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-sm overflow-x-auto max-h-64 overflow-y-auto">
              {rawCode}
            </pre>
          </details>
        )}
      </section>

      {/* 未登录提示 */}
      {!userId && result && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center animate-fade-in">
          <p className="text-blue-700 font-medium mb-2">
            💡 登录后可保存图表到历史记录
          </p>
          <p className="text-blue-500 text-sm mb-4">
            支持收藏、分类管理、随时回看
          </p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            免费注册 / 登录
          </Link>
        </div>
      )}

      {/* 相关链接 */}
      <section className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">📚 相关教程</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tools/flowchart"
            className="text-sm text-blue-600 hover:underline"
          >
            流程图怎么画？
          </Link>
          <Link
            href="/tools/er"
            className="text-sm text-blue-600 hover:underline"
          >
            ER 图教程
          </Link>
          <Link
            href="/tools/uml"
            className="text-sm text-blue-600 hover:underline"
          >
            UML 类图教程
          </Link>
          <Link
            href="/tools/templates"
            className="text-sm text-blue-600 hover:underline"
          >
            📦 模板库
          </Link>
        </div>
      </section>
    </div>
  );
}

/** 用 Suspense 包裹以支持 useSearchParams */
export default function ToolPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-24 text-center text-gray-400">
          <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          加载中...
        </div>
      }
    >
      <ToolContent />
    </Suspense>
  );
}
