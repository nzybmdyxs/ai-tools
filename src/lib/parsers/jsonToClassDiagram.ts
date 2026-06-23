// ==========================================
// JSON → UML 类图转换器（零 AI 成本）
// ==========================================

interface ClassDef {
  name: string;
  fields: { name: string; type: string }[];
  children: ClassDef[];
}

/** JSON 文本 → Mermaid classDiagram */
export function jsonToClassDiagram(jsonText: string): { code: string; classes: number } {
  try {
    const obj = JSON.parse(jsonText.trim());
    const classes: ClassDef[] = [];
    buildClass("Root", obj, classes);

    let mermaid = "classDiagram\n";

    for (const cls of classes) {
      mermaid += `  class ${cls.name} {\n`;
      for (const field of cls.fields) {
        mermaid += `    +${field.type} ${field.name}\n`;
      }
      mermaid += "  }\n";
    }

    // 生成关联关系
    for (const cls of classes) {
      for (const child of cls.children) {
        mermaid += `  ${cls.name} --> ${child.name}\n`;
      }
    }

    return { code: mermaid.trim(), classes: classes.length };
  } catch {
    return { code: "classDiagram\n  % 无法解析 JSON", classes: 0 };
  }
}

/** 递归构建类定义 */
function buildClass(name: string, obj: unknown, classes: ClassDef[]) {
  if (obj === null || obj === undefined) return;
  if (typeof obj !== "object") return;

  const cls: ClassDef = { name, fields: [], children: [] };
  const record = obj as Record<string, unknown>;

  for (const [key, value] of Object.entries(record)) {
    const type = getJsonType(value);
    cls.fields.push({ name: key, type });

    // 嵌套对象 → 子类
    if (type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
      const subName = capitalize(key);
      cls.children.push({ name: subName, fields: [], children: [] });
      buildClass(subName, value, classes);
    }
    // 数组中的对象 → 子类
    if (type === "Array<object>" && Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
      const subName = capitalize(key.replace(/s$/, ""));
      cls.children.push({ name: subName, fields: [], children: [] });
      buildClass(subName, value[0], classes);
    }
  }

  classes.push(cls);
}

function getJsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object") return "Array<object>";
    return `Array<${typeof value[0] || "unknown"}>`;
  }
  if (typeof value === "object") return "object";
  return typeof value;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
