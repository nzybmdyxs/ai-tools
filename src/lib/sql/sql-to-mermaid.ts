// ==========================================
// SQL → Mermaid ER 图转换器
// 解析 CREATE TABLE 语句，生成 erDiagram 代码
// ==========================================

import { Parser } from "node-sql-parser";

interface ColumnInfo {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  refTable?: string;
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
}

interface Relationship {
  from: string;
  to: string;
  type: string; // "one-to-many" | "many-to-one"
}

/**
 * SQL DDL → Mermaid erDiagram 代码
 * 支持 MySQL / PostgreSQL 语法
 */
export function sqlToMermaid(sql: string): { code: string; tables: number } {
  try {
    const parser = new Parser();
    const ast = parser.astify(sql, { database: "mysql" });
    const statements = Array.isArray(ast) ? ast : [ast];

    const tables: TableInfo[] = [];
    const relationships: Relationship[] = [];

    for (const stmt of statements) {
      if (!stmt) continue;

      // node-sql-parser 的 AST 类型比较复杂，使用类型断言
      const s = stmt as {
        type?: string;
        keyword?: string;
        table?: { table: string; schema?: string }[];
        tableName?: string;
        create_definitions?: Array<{
          column?: { column: string };
          definition?: { dataType: string };
          resource?: string;
          constraint_type?: string;
          keyword?: string;
          reference_definition?: {
            table: { table: string };
            columns: Array<{ column: string }>;
          };
        }>;
      };

      const keyword = (s.keyword || s.type || "").toLowerCase();

      if (keyword === "create" && s.table && s.table.length > 0) {
        const tableName = s.table[0].table;
        const columns: ColumnInfo[] = [];
        const defs = s.create_definitions || [];

        for (const def of defs) {
          if (def.column) {
            columns.push({
              name: def.column.column,
              type: def.definition?.dataType || "varchar",
              isPrimaryKey: false,
              isForeignKey: false,
            });
          }
          if (def.constraint_type === "primary key" || def.keyword === "primary key") {
            // Mark PK - simplified: take last column
            if (columns.length > 0) {
              columns[columns.length - 1].isPrimaryKey = true;
            }
          }
          if (def.constraint_type === "foreign key" && def.reference_definition) {
            const refTable = def.reference_definition.table.table;
            if (columns.length > 0) {
              columns[columns.length - 1].isForeignKey = true;
              columns[columns.length - 1].refTable = refTable;
            }
            relationships.push({ from: tableName, to: refTable, type: "many-to-one" });
          }
        }

        tables.push({ name: tableName, columns });
      }
    }

    // 构建 Mermaid erDiagram
    let mermaid = "erDiagram\n";

    // 输出实体定义
    for (const table of tables) {
      mermaid += `  ${table.name} {\n`;
      for (const col of table.columns) {
        const pk = col.isPrimaryKey ? " PK" : "";
        const fk = col.isForeignKey ? " FK" : "";
        mermaid += `    ${col.type} ${col.name}${pk}${fk}\n`;
      }
      mermaid += "  }\n\n";
    }

    // 输出关系
    for (const rel of relationships) {
      if (rel.type === "many-to-one") {
        mermaid += `  ${rel.from} ||--o{ ${rel.to} : has\n`;
      }
    }

    return { code: mermaid.trim(), tables: tables.length };
  } catch {
    // SQL 解析失败，返回空
    return { code: "erDiagram\n  % 无法解析 SQL，请检查语法", tables: 0 };
  }
}
