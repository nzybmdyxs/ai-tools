// ==========================================
// 图表类型配置中心 — 配置驱动
// 新增图类型只需在此文件添加一条配置
// ==========================================

import type { DiagramType } from "@/types/diagram";

export interface DiagramTypeConfig {
  value: DiagramType;
  label: string;
  icon: string;
  mermaidType: string;
  example: string;
  category: "diagram" | "architecture" | "project";
}

export const DIAGRAM_CONFIG: Record<DiagramType, DiagramTypeConfig> = {
  // ===== 数据建模 (2) =====
  er: {
    value: "er",
    label: "ER 图",
    icon: "🗄️",
    mermaidType: "erDiagram",
    example: "学生管理系统：学生、课程、教师、成绩",
    category: "diagram",
  },
  dfd: {
    value: "dfd",
    label: "数据流图",
    icon: "📊",
    mermaidType: "flowchart",
    example: "在线考试系统：考生提交答案→系统评分→返回成绩",
    category: "diagram",
  },

  // ===== UML 建模 (3) =====
  class: {
    value: "class",
    label: "类图",
    icon: "📦",
    mermaidType: "classDiagram",
    example: "电商订单系统：Order类关联User和Product",
    category: "diagram",
  },
  usecase: {
    value: "usecase",
    label: "用例图",
    icon: "👤",
    mermaidType: "flowchart",
    example: "图书馆系统：读者借书、还书、查询、续借",
    category: "diagram",
  },
  state: {
    value: "state",
    label: "状态图",
    icon: "🔄",
    mermaidType: "stateDiagram-v2",
    example: "订单状态流转：待支付→已支付→已发货→已完成",
    category: "diagram",
  },

  // ===== 通用图表 (3) =====
  flowchart: {
    value: "flowchart",
    label: "流程图",
    icon: "🔀",
    mermaidType: "flowchart",
    example: "用户注册→验证邮箱→填写资料→注册成功",
    category: "diagram",
  },
  sequence: {
    value: "sequence",
    label: "时序图",
    icon: "⏱️",
    mermaidType: "sequenceDiagram",
    example: "用户登录→服务器验证→数据库查询→返回Token",
    category: "diagram",
  },
  mindmap: {
    value: "mindmap",
    label: "思维导图",
    icon: "🧠",
    mermaidType: "mindmap",
    example: "软件工程课程：需求/设计/开发/测试/部署",
    category: "diagram",
  },

  // ===== 架构图 (3) =====
  architecture: {
    value: "architecture",
    label: "技术架构图",
    icon: "🏗️",
    mermaidType: "flowchart",
    example: "博客平台：CDN→前端→后端→Redis→PostgreSQL",
    category: "architecture",
  },
  microservice: {
    value: "microservice",
    label: "微服务架构",
    icon: "☁️",
    mermaidType: "flowchart",
    example: "外卖平台：Gateway→订单/用户/商品/支付服务→MQ→DB",
    category: "architecture",
  },
  function: {
    value: "function",
    label: "功能结构图",
    icon: "🌳",
    mermaidType: "mindmap",
    example: "学生管理系统：教务/学籍/成绩/选课/毕业",
    category: "architecture",
  },

  // ===== 项目管理 (1) =====
  gantt: {
    value: "gantt",
    label: "甘特图",
    icon: "📅",
    mermaidType: "gantt",
    example: "毕业设计：选题2周→需求3周→开发8周→测试3周→论文4周",
    category: "project",
  },
};

/** 所有类型的数组形式（用于渲染列表） */
export const DIAGRAM_TYPES = Object.values(DIAGRAM_CONFIG);

/** 按分类分组 */
export const DIAGRAM_CATEGORIES = [
  { key: "diagram", label: "数据 & UML 建模", icon: "📐" },
  { key: "architecture", label: "架构设计", icon: "🏗️" },
  { key: "project", label: "项目管理", icon: "📅" },
] as const;

/** 根据 value 获取配置 */
export function getDiagramType(value: string): DiagramTypeConfig | undefined {
  return DIAGRAM_CONFIG[value as DiagramType] || DIAGRAM_TYPES.find((t) => t.value === value);
}
