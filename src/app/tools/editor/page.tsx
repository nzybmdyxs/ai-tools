"use client";

// ==========================================
// Mermaid 在线编辑器
// /tools/editor
// 左侧 Monaco 编辑代码，右侧实时预览
// ==========================================

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import MonacoEditor from "@/components/MonacoEditor";
import DiagramBox from "@/components/DiagramBox";
import { cleanMermaidCode } from "@/lib/mermaid";
import { DIAGRAM_TYPES } from "@/config/diagram-types";
import Link from "next/link";

function EditorContent() {
  const searchParams = useSearchParams();
  const loadId = searchParams?.get("load") || "";
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id || "";

  const [code, setCode] = useState("graph TD\n  A[开始] --> B[处理]\n  B --> C[结束]");
  const [debouncedCode, setDebouncedCode] = useState(code);
  const [type, setType] = useState("flow");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // 从历史记录加载
  useEffect(() => {
    if (loadId) {
      fetch(`/api/diagrams?id=${loadId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.diagram) {
            setCode(data.diagram.result);
            setType(data.diagram.type);
          }
        })
        .catch(() => {});
    }
  }, [loadId]);

  // 500ms 防抖实时预览
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCode(code), 500);
    return () => clearTimeout(timer);
  }, [code]);

  const handleSave = useCallback(async () => {
    if (!userId || !code.trim()) return;
    setSaving(true);
    setSaveMsg("");

    try {
      const lines = code.trim().split("\n");
      const title = lines[0].replace(/^[#/\s]+/, "").slice(0, 30) || "未命名图表";

      const res = await fetch("/api/diagrams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          prompt: "",
          result: code,
        }),
      });

      if (res.ok) {
        setSaveMsg("✅ 已保存");
        setTimeout(() => setSaveMsg(""), 3000);
      } else {
        setSaveMsg("⚠️ 保存失败");
      }
    } catch {
      setSaveMsg("⚠️ 保存失败");
    } finally {
      setSaving(false);
    }
  }, [userId, code, type]);

  const downloadSVG = () => {
    const svgEl = document.querySelector(".diagram-container svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagram-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-blue-600">
            ← 制图工具
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-sm font-semibold text-gray-700">Mermaid 编辑器</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* 图表类型选择 */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600"
          >
            {DIAGRAM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {saveMsg && (
            <span className={`text-xs ${saveMsg.startsWith("✅") ? "text-green-500" : "text-yellow-500"}`}>
              {saveMsg}
            </span>
          )}

          {userId && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "保存中..." : "💾 保存"}
            </button>
          )}

          <button
            onClick={downloadSVG}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            📥 SVG
          </button>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* 左侧：代码编辑器 */}
        <div className="flex-1 border-r border-gray-200">
          <MonacoEditor
            code={code}
            onChange={setCode}
            language="markdown"
          />
        </div>

        {/* 右侧：实时预览 */}
        <div className="flex-1 p-4 bg-white overflow-auto">
          <div className="mb-2 text-xs text-gray-400 flex items-center justify-between">
            <span>实时预览</span>
            <span className="text-gray-300">{DIAGRAM_TYPES.find(t => t.value === type)?.label}</span>
          </div>
          <div className="diagram-container">
            <DiagramBox code={cleanMermaidCode(debouncedCode)} />
          </div>
        </div>
      </div>

      {/* 未登录提示 */}
      {!userId && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 text-center text-sm text-blue-600 flex-shrink-0">
          💡 <Link href="/auth/signin" className="font-medium underline">登录</Link> 后可保存图表到历史记录
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center text-gray-400">
        <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mr-3"></div>
        加载中...
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
