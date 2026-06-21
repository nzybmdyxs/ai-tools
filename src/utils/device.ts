// ==========================================
// 游客设备 ID 工具
// 浏览器端生成/读取唯一设备标识，用于未登录用户次数追踪
// ==========================================

const DEVICE_ID_KEY = "ai_tool_device_id";

/**
 * 获取或生成设备 ID（仅浏览器端可用）
 * 使用 crypto.randomUUID() 生成唯一标识
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }

    return id;
  } catch {
    // localStorage 不可用时降级
    return "";
  }
}

/**
 * 获取游客剩余导出次数
 * 从后端 API 查询，此处仅返回本地缓存的次数
 */
export function getLocalExportRemain(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("ai_tool_export_remain");
    if (raw === null) return null;
    return parseInt(raw, 10);
  } catch {
    return null;
  }
}

/**
 * 更新本地缓存的剩余次数
 */
export function setLocalExportRemain(remain: number): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("ai_tool_export_remain", String(remain));
  } catch {
    // 静默失败
  }
}
