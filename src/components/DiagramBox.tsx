"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { cleanMermaidCode } from "@/lib/mermaid";

// 确保 Mermaid 只初始化一次
let mermaidInitialized = false;

function ensureMermaidInit() {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Arial, sans-serif",
    });
    mermaidInitialized = true;
  }
}

interface DiagramBoxProps {
  code: string;
}

export default function DiagramBox({ code }: DiagramBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    const cleaned = cleanMermaidCode(code);
    if (!cleaned) return;

    ensureMermaidInit();

    // 生成唯一 ID 避免 Mermaid 渲染冲突
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    let cancelled = false;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(id, cleaned);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRenderError(false);
        }
      } catch (err) {
        console.error("Mermaid 渲染错误:", err);
        if (!cancelled) {
          setRenderError(true);
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code]);

  // 无代码时的空状态
  if (!code) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <span className="text-4xl mb-3">📈</span>
        <p className="text-gray-400 text-lg">输入内容后点击生成，图表将显示在这里</p>
        <p className="text-gray-300 text-sm mt-1">支持流程图 · ER图 · UML · 时序图 · 甘特图 · 思维导图</p>
      </div>
    );
  }

  // 渲染失败时的错误状态
  if (renderError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <span className="text-3xl mb-3 block">⚠️</span>
        <p className="text-red-700 font-semibold mb-2">图表渲染失败</p>
        <p className="text-red-500 text-sm">
          请检查生成的 Mermaid 代码是否正确，或尝试调整输入内容后重新生成
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-auto min-h-[300px] flex items-center justify-center">
      <div ref={containerRef} className="w-full diagram-container" />
    </div>
  );
}
