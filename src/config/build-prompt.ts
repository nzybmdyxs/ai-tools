// ==========================================
// Prompt 配置中心 — 每种图类型专用 Prompt
// 新增图类型只需在此文件添加一条
// ==========================================

import type { DiagramType, ERNotation } from "@/types/diagram";

const PROMPTS: Record<DiagramType, (content: string, notation?: ERNotation) => string> = {
  er: (content, notation) => {
    if (notation === "chen") {
      return `生成Chen ER Diagram。含实体+属性+关系+基数约束。仅返回Mermaid erDiagram代码:\n${content}`;
    }
    return `生成Crow's Foot ER Diagram。含字段类型+主键+外键+表关系。仅返回Mermaid erDiagram代码:\n${content}`;
  },

  dfd: (content) =>
    `生成数据流图(DFD)。格式为Mermaid flowchart。方框[]表示实体，双括号(())表示过程，方括号[( )]表示数据存储。仅返回Mermaid代码:\n${content}`,

  usecase: (content) =>
    `生成UML用例图。格式为Mermaid flowchart LR。Actor用方框[用户名]，用例用双括号((用例名))。Actor在左，用例在右。仅返回Mermaid代码:\n${content}`,

  class: (content) =>
    `生成UML类图。格式Mermaid classDiagram。含类名+属性+方法+可见性符号(+-)。标注继承/关联/聚合/组合关系。仅返回Mermaid代码:\n${content}`,

  state: (content) =>
    `生成状态图。格式Mermaid stateDiagram-v2。含初始状态[*]、中间状态、终态[*]、状态转换箭头。仅返回Mermaid代码:\n${content}`,

  flowchart: (content) =>
    `生成流程图。格式Mermaid flowchart TD。方框[]表示步骤，菱形{}表示判断分支。仅返回Mermaid代码:\n${content}`,

  sequence: (content) =>
    `生成时序图。格式Mermaid sequenceDiagram。含参与者participant、消息箭头、激活框、返回消息。仅返回Mermaid代码:\n${content}`,

  function: (content) =>
    `生成功能结构图。格式Mermaid mindmap。顶层为系统名，二级为功能模块，三级为子功能。层级清晰，结构合理。仅返回Mermaid代码:\n${content}`,

  architecture: (content) =>
    `生成技术架构图。格式Mermaid flowchart TB。包含客户端/前端/后端/缓存/数据库/消息队列等层次。从上到下排列。仅返回Mermaid代码:\n${content}`,

  microservice: (content) =>
    `生成微服务架构图。格式Mermaid flowchart TB。包含Gateway/各微服务/Redis/MQ/MySQL等组件。服务间用箭头标注调用关系。仅返回Mermaid代码:\n${content}`,

  gantt: (content) =>
    `生成甘特图。格式Mermaid gantt。含任务名+开始日期+持续天数+依赖关系。仅返回Mermaid代码:\n${content}`,

  mindmap: (content) =>
    `生成思维导图。格式Mermaid mindmap。主题居中，各级分支向外展开。层级不超过4层。仅返回Mermaid代码:\n${content}`,
};

interface BuildPromptParams {
  diagramType: DiagramType;
  notation?: ERNotation;
  prompt: string;
}

/** 构造发给 AI 的最终 Prompt（配置驱动） */
export function buildPrompt({ diagramType, notation, prompt }: BuildPromptParams): string {
  const builder = PROMPTS[diagramType];
  if (!builder) return `仅返回Mermaid代码:\n${prompt}`;
  return builder(prompt, notation);
}
