// ==========================================
// OpenAPI / Swagger → 架构图（零 AI 成本）
// ==========================================

import yaml from "js-yaml";

/** OpenAPI YAML/JSON → Mermaid 架构图 */
export function openapiToArchitecture(content: string): { code: string; endpoints: number } {
  try {
    let doc: Record<string, unknown>;

    if (content.includes("openapi:") || content.includes("swagger:")) {
      doc = yaml.load(content) as Record<string, unknown>;
    } else {
      doc = JSON.parse(content);
    }

    const paths = (doc.paths || {}) as Record<string, Record<string, unknown>>;

    // 按 Tag 分组
    const services: Map<string, string[]> = new Map();
    const untagged = "API";

    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        if (method === "parameters") continue;
        const op = operation as { tags?: string[] };
        const opTags = op.tags || [];
        const serviceName = opTags.length > 0 ? opTags[0] : untagged;

        if (!services.has(serviceName)) services.set(serviceName, []);
        services.get(serviceName)!.push(`${method.toUpperCase()} ${path}`);
      }
    }

    // 构建 Mermaid
    let mermaid = "flowchart TB\n";
    mermaid += "  Client[客户端]\n";

    for (const [service, endpoints] of Array.from(services.entries())) {
      const nodeId = service.replace(/[^a-zA-Z0-9]/g, "_");
      mermaid += `\n  subgraph ${service}\n`;
      for (const ep of endpoints) {
        const epId = ep.replace(/[^a-zA-Z0-9]/g, "_");
        mermaid += `    ${nodeId}_${epId}[${ep}]\n`;
      }
      mermaid += "  end\n";
      mermaid += `  Client --> ${nodeId}_${endpoints[0].replace(/[^a-zA-Z0-9]/g, "_")}\n`;
    }

    const totalEndpoints = Array.from(services.values()).reduce((sum: number, eps: string[]) => sum + eps.length, 0);
    return { code: mermaid, endpoints: totalEndpoints };
  } catch {
    return { code: "flowchart TB\n  % 无法解析 OpenAPI 文档", endpoints: 0 };
  }
}
