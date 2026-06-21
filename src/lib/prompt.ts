/**
 * AI 提示词模板
 * 根据不同图表类型返回对应的 Mermaid 生成提示词
 */

export const PROMPT_MAP: Record<string, string> = {
  flow: `你是一个专业的流程图生成助手。请把以下内容转换为 Mermaid flowchart 格式。

要求：
1. 只输出 Mermaid 代码，不要任何解释
2. 使用 flowchart TD（从上到下）或 flowchart LR（从左到右）
3. 节点使用方括号[]表示流程步骤，菱形{}表示判断
4. 使用中文描述节点

请将以下内容转换为流程图：`,

  er: `你是一个专业的数据库设计助手。请把以下内容转换为 Mermaid ER 图（erDiagram）格式。

要求：
1. 只输出 Mermaid 代码，不要任何解释
2. 识别实体及其属性
3. 标注实体之间的关系（一对一、一对多、多对多）
4. 使用中文描述

请将以下内容转换为 ER 图：`,

  uml: `你是一个专业的 UML 建模助手。请把以下内容转换为 Mermaid classDiagram 格式。

要求：
1. 只输出 Mermaid 代码，不要任何解释
2. 包含类名、属性和方法
3. 标注类之间的关系（继承、关联、聚合、组合）
4. 使用中文描述

请将以下内容转换为 UML 类图：`,

  sequence: `你是一个专业的时序图生成助手。请把以下内容转换为 Mermaid sequenceDiagram 格式。

要求：
1. 只输出 Mermaid 代码，不要任何解释
2. 清晰标注参与者和消息传递顺序
3. 使用中文描述

请将以下内容转换为时序图：`,

  gantt: `你是一个专业的甘特图生成助手。请把以下内容转换为 Mermaid gantt 格式。

要求：
1. 只输出 Mermaid 代码，不要任何解释
2. 包含任务、时间线和依赖关系
3. 使用中文描述

请将以下内容转换为甘特图：`,

  mindmap: `你是一个专业的思维导图生成助手。请把以下内容转换为 Mermaid mindmap 格式。

要求：
1. 只输出 Mermaid 代码，不要任何解释
2. 层级清晰，结构合理
3. 使用中文描述

请将以下内容转换为思维导图：`,
};

export const TYPE_LABELS: Record<string, string> = {
  flow: "流程图",
  er: "ER 图",
  uml: "UML 类图",
  sequence: "时序图",
  gantt: "甘特图",
  mindmap: "思维导图",
};

export const TYPE_EXAMPLES: Record<string, string> = {
  flow: "用户注册 → 验证邮箱 → 填写资料 → 注册成功",
  er: "用户（id, 用户名, 邮箱） 订单（id, 用户id, 金额, 时间） 一个用户有多个订单",
  uml: "Animal 类有 name 属性和 eat 方法，Dog 继承 Animal，有 bark 方法",
  sequence: "用户发送登录请求 → 服务器验证 → 数据库查询 → 返回结果 → 用户登录成功",
  gantt: "需求分析 7天 → UI设计 5天 → 开发 14天 → 测试 5天 → 上线 1天",
  mindmap: "AI工具：ChatGPT，Claude，文心一言，通义千问",
};
