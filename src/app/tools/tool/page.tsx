"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InputBox from "@/components/InputBox";
import { DiagramSidebar } from "@/components/diagram/DiagramSidebar";
import { DiagramPreview } from "@/components/diagram/DiagramPreview";
import { DIAGRAM_CONFIG } from "@/config/diagram-types";
import type { DiagramType, ERNotation, GenerationMode } from "@/types/diagram";
import { cleanMermaidCode } from "@/lib/mermaid";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getDeviceId } from "@/utils/device";

function ToolContent() {
  const searchParams = useSearchParams();
  const loadId = searchParams?.get("load") || "";
  const templateId = searchParams?.get("template") || "";

  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id || "";

  const [text, setText] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [erNotation, setERNotation] = useState<ERNotation>("crows-foot");
  const [generationMode, setGenerationMode] = useState<GenerationMode>("ai");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawCode, setRawCode] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [fromTemplate, setFromTemplate] = useState(false);
  const [repaired, setRepaired] = useState(false);
  const [detectedMode, setDetectedMode] = useState("");

  // Mermaid 预加载
  useEffect(() => {
    import("mermaid");
  }, []);

  // 加载草稿
  useEffect(() => {
    if (loadId || templateId) return;
    try {
      const draft = localStorage.getItem("diagram_draft");
      if (draft) {
        const d = JSON.parse(draft);
        if (d.text) setText(d.text);
        if (d.type) setDiagramType(d.type as DiagramType);
      }
    } catch { /* ignore */ }
  }, []);

  // 自动保存草稿（500ms 防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text.trim()) {
        localStorage.setItem("diagram_draft", JSON.stringify({ text, type: diagramType }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [text, diagramType]);

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
        setDiagramType(dbTypeToDiagramType(data.diagram.type));
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
        if (template.code?.startsWith("erDiagram")) setDiagramType("er");
        else if (template.code?.startsWith("graph")) setDiagramType("flowchart");
        else if (template.code?.startsWith("classDiagram")) setDiagramType("class");
        else if (template.code?.startsWith("sequenceDiagram")) setDiagramType("sequence");
        else if (template.code?.startsWith("stateDiagram")) setDiagramType("state");
        else if (template.code?.startsWith("gantt")) setDiagramType("gantt");
        else if (template.code?.startsWith("mindmap")) setDiagramType("mindmap");
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
    setRawCode("");
    setSavedId(null);
    setFromTemplate(false);
    setRepaired(false);
    setDetectedMode("");

    const deviceId = getDeviceId();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          type: diagramType,
          userId: userId || undefined,
          deviceId: deviceId || undefined,
          notation: diagramType === "er" ? erNotation : undefined,
          generationMode,
        }),
      });

      // 模板命中：直接 JSON 返回，不需要流式解析
      if (res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) {
          if (data.needUpgrade) throw new Error("AI 生成次数已用完，请购买次数包或升级 Pro 会员");
          if (data.needLogin) throw new Error("请先登录后使用 AI 生成功能");
          throw new Error(data.error || "请求失败");
        }
        const cleaned = cleanMermaidCode(data.result);
        setRawCode(data.result);
        setResult(cleaned);
        if (data.fromTemplate) setFromTemplate(true);
        if (data.repaired) setRepaired(true);
        if (data.mode) setDetectedMode(data.mode);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "生成失败，请稍后重试";
      setError(message);
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  /** 手动修复 Mermaid 代码 */
  const handleRepair = async () => {
    const codeToFix = rawCode || result;
    if (!codeToFix) return;

    setLoading(true);
    try {
      const res = await fetch("/api/repair-mermaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToFix }),
      });
      const data = await res.json();
      if (data.code) {
        setRawCode(data.code);
        setResult(cleanMermaidCode(data.code));
        setRepaired(true);
      }
    } catch {
      // 静默失败
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
          title: title || `未命名${DIAGRAM_CONFIG[diagramType]?.label}`,
          type: diagramTypeToDB(diagramType),
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
    a.download = `结构图-${DIAGRAM_CONFIG[diagramType]?.label || diagramType}-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** DiagramType → DB 存储值 */
function diagramTypeToDB(t: DiagramType): string {
  return t;
}

/** DB 存储值 → DiagramType */
function dbTypeToDiagramType(t: string): DiagramType {
  return (DIAGRAM_CONFIG[t as DiagramType] ? t : "flowchart") as DiagramType;
}

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-gray-400 hover:text-blue-600">首页</Link>
          <span className="text-gray-300">/</span>
          <Link href="/tools" className="text-gray-400 hover:text-blue-600">制图</Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-700">
            {DIAGRAM_CONFIG[diagramType]?.icon} {DIAGRAM_CONFIG[diagramType]?.label}
          </span>
          {detectedMode && detectedMode !== "ai" && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
              ⚡规则:{detectedMode}
            </span>
          )}
          {fromTemplate && <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">⚡模板</span>}
          {repaired && <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">🔧已修复</span>}
        </div>
        <div className="flex items-center gap-2">
          {!userId && (
            <Link href="/auth/signin" className="text-xs text-blue-600 hover:underline">
              登录保存历史
            </Link>
          )}
          {saveMsg && <span className="text-xs text-green-600">{saveMsg}</span>}
        </div>
      </div>

      {/* 三栏工作区 */}
      <div className="flex-1 flex min-h-0">
        {/* 左栏：图类型选择 */}
        <div className="w-56 border-r border-gray-200 bg-white p-4 overflow-y-auto flex-shrink-0 hidden lg:block">
          <DiagramSidebar active={diagramType} onChange={setDiagramType} />
        </div>

        {/* 中栏：输入区 */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
          {/* 移动端类型选择 */}
          <div className="lg:hidden px-4 pt-4">
            <select
              value={diagramType}
              onChange={(e) => setDiagramType(e.target.value as DiagramType)}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm"
            >
              {Object.values(DIAGRAM_CONFIG).map((t) => (
                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <InputBox
              text={text}
              diagramType={diagramType}
              erNotation={erNotation}
              generationMode={generationMode}
              loading={loading}
              onTextChange={(t) => { setText(t); setError(""); }}
              onDiagramTypeChange={setDiagramType}
              onERNotationChange={setERNotation}
              onGenerationModeChange={setGenerationMode}
              onGenerate={generate}
            />

            {/* 错误提示 */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
                {error.includes("登录") && (
                  <Link href="/auth/signin" className="inline-block mt-2 px-4 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg">去登录 →</Link>
                )}
                {error.includes("次数已用完") && (
                  <Link href="/pricing" className="inline-block mt-2 px-4 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg">升级会员 →</Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右栏：预览 */}
        <div className="w-full lg:w-[480px] flex-shrink-0">
          <DiagramPreview
            code={result}
            rawCode={rawCode}
            loading={loading}
            error={error}
            onCopy={copyCode}
            onDownload={downloadSVG}
            onRepair={handleRepair}
            onSave={saveToHistory}
            saved={!!savedId}
            saving={saving}
          />
        </div>
      </div>
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
