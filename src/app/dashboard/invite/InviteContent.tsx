"use client";

// ==========================================
// 邀请链接复制按钮（客户端组件）
// ==========================================

import { useState } from "react";

export function InviteContent({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text
      const input = document.createElement("input");
      input.value = inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={copyLink}
      className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
        copied
          ? "bg-green-500 text-white"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {copied ? "✅ 已复制" : "📋 复制链接"}
    </button>
  );
}
