"use client";

// ==========================================
// Monaco Editor 封装组件
// 用于 Mermaid 代码在线编辑
// ==========================================

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// 动态导入 Monaco，避免 SSR 报错
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface MonacoEditorProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  language?: string;
}

export default function MonacoEditor({
  code,
  onChange,
  readOnly = false,
  language = "markdown",
}: MonacoEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400 text-sm">
        加载编辑器中...
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={code}
      onChange={(value) => onChange?.(value || "")}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        wordWrap: "on",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        readOnly,
        tabSize: 2,
      }}
    />
  );
}
