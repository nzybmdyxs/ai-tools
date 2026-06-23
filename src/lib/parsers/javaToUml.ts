// ==========================================
// Java 实体类 → UML 类图（零 AI 成本）
// ==========================================

/** Java 源码 → Mermaid classDiagram */
export function javaToUml(source: string): { code: string; classes: number } {
  try {
    const classes: { name: string; fields: string[]; methods: string[] }[] = [];
    const classRegex = /(?:public\s+)?(?:abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?/g;
    const fieldRegex = /(private|protected|public)\s+(\w+(?:<[^>]+>)?)\s+(\w+)\s*;/g;
    const methodRegex = /(public|protected|private)\s+(\w+(?:<[^>]+>)?)\s+(\w+)\s*\(/g;

    let classMatch;
    while ((classMatch = classRegex.exec(source)) !== null) {
      const className = classMatch[1];
      const fields: string[] = [];
      const methods: string[] = [];

      // 找到类体的范围（简化：从 class 行到下一个 class 或末尾）
      const classStart = classMatch.index;
      const nextClass = new RegExp(`(?:public\\s+)?class\\s+\\w+`, "g");
      nextClass.lastIndex = classStart + classMatch[0].length;
      const nextMatch = nextClass.exec(source);
      const classEnd = nextMatch ? nextMatch.index : source.length;
      const classBody = source.slice(classStart, classEnd);

      // 提取字段
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(classBody)) !== null) {
        fields.push(`${fieldMatch[1][0]}${fieldMatch[2]} ${fieldMatch[3]}`);
      }

      // 提取方法
      let methodMatch;
      while ((methodMatch = methodRegex.exec(classBody)) !== null) {
        methods.push(`${methodMatch[1][0]}${methodMatch[2]} ${methodMatch[3]}()`);
      }

      classes.push({ name: className, fields, methods });
    }

    if (classes.length === 0) {
      return { code: "classDiagram\n  % 未找到 Java 类定义", classes: 0 };
    }

    let mermaid = "classDiagram\n";
    for (const cls of classes) {
      mermaid += `  class ${cls.name} {\n`;
      for (const f of cls.fields) mermaid += `    ${f}\n`;
      for (const m of cls.methods) mermaid += `    ${m}\n`;
      mermaid += "  }\n";
    }

    return { code: mermaid.trim(), classes: classes.length };
  } catch {
    return { code: "classDiagram\n  % 解析 Java 源码失败", classes: 0 };
  }
}
