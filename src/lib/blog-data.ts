// ==========================================
// 博客文章数据 — 20 篇 SEO 文章
// 每个 slug 对应一篇文章，配置驱动渲染
// ==========================================

export interface BlogPost {
  title: string;
  desc: string;
  tag: string;
  sections: { heading: string; content: string }[];
  ctaText: string;
  ctaHref: string;
}

export const BLOG_POSTS: Record<string, BlogPost> = {

  // ===== 数据库 (3) =====
  "er-diagram-guide": {
    title: "ER 图怎么画？数据库设计入门指南", tag: "数据库",
    desc: "从零开始学习 ER 图，掌握实体、属性、关系三要素，快速上手数据库设计。",
    ctaText: "👉 使用 AI 一键生成 ER 图", ctaHref: "/tools/tool",
    sections: [
      { heading: "什么是 ER 图？", content: "ER 图（Entity-Relationship Diagram）是数据库设计中最重要的建模工具，用图形化方式描述数据实体、属性和关系。" },
      { heading: "ER 图三要素", content: "实体（Entity）：数据对象，如用户、订单。\n\n属性（Attribute）：实体的特征，如用户名、价格。\n\n关系（Relationship）：实体间的业务联系，包括 1:1、1:N、M:N。" },
      { heading: "常见关系类型", content: "一对一（1:1）：一个用户一张身份证。\n\n一对多（1:N）：一个用户多个订单。\n\n多对多（M:N）：一个学生多门课，一门课多个学生，需要中间表。" },
      { heading: "用 Mermaid 画 ER 图", content: "使用 erDiagram 关键字开始，用 ||--o{ 等符号表示关系，PK/FK 标注主外键。可以用 AI 自动生成 Mermaid ER 图代码。" },
      { heading: "设计最佳实践", content: "1. 先识别核心实体，再逐步扩展\n2. 为每个实体定义主键\n3. 规范命名（user_id 而非 uid）\n4. 多对多关系拆成两个一对多 + 中间表\n5. 用实际业务场景验证" },
    ],
  },
  "database-design-patterns": {
    title: "数据库设计常见模式与最佳实践", tag: "数据库",
    desc: "掌握数据库设计的经典模式：星型模型、雪花模型、范式设计、反范式优化，提升数据库设计能力。",
    ctaText: "👉 用 AI 快速生成数据库 ER 图", ctaHref: "/tools/tool",
    sections: [
      { heading: "范式设计", content: "第一范式（1NF）：列不可再分。第二范式（2NF）：消除部分依赖。第三范式（3NF）：消除传递依赖。实际项目中通常做到 3NF 即可。" },
      { heading: "反范式设计", content: "查询频繁的表适当冗余字段，减少 JOIN 操作。常见的反范式包括：冗余统计字段、快照数据、汇总表。" },
      { heading: "星型模型与雪花模型", content: "星型模型：事实表为中心，周围是维度表，适合报表查询。雪花模型：维度表进一步规范化，节省空间但查询更复杂。" },
      { heading: "索引设计原则", content: "1. WHERE/JOIN/ORDER BY 字段建索引\n2. 高选择性的列优先\n3. 复合索引遵循最左前缀\n4. 避免过多索引（影响写入性能）" },
    ],
  },
  "sql-query-optimization": {
    title: "SQL 查询优化：从慢查询到高性能", tag: "数据库",
    desc: "系统学习 SQL 查询优化的方法：执行计划分析、索引优化、SQL 重写、数据库参数调优。",
    ctaText: "👉 用 AI 工具辅助数据库设计", ctaHref: "/tools/tool",
    sections: [
      { heading: "读懂执行计划", content: "EXPLAIN 是 SQL 优化的第一步。关注 type 字段（ALL > index > range > ref > const），rows 估算，Extra 中的 Using filesort/Using temporary。" },
      { heading: "索引优化策略", content: "覆盖索引：查询列都在索引中避免回表。联合索引最左匹配原则。避免在索引列上使用函数或计算。" },
      { heading: "SQL 重写技巧", content: "用 JOIN 替代子查询。避免 SELECT *。分页优化：用 WHERE id > last_id LIMIT n 代替 OFFSET。批量插入代替逐条。" },
      { heading: "数据库参数调优", content: "调整 buffer pool 大小。合理设置连接池。慢查询日志定位瓶颈。定期 ANALYZE TABLE 更新统计信息。" },
    ],
  },

  // ===== 系统设计 (3) =====
  "uml-guide": {
    title: "UML 类图教程：面向对象设计必备技能", tag: "系统设计",
    desc: "掌握 UML 类图的核心概念，学习类之间六种关系，运用 SOLID 设计原则写出优雅的面向对象代码。",
    ctaText: "👉 使用 AI 一键生成 UML 类图", ctaHref: "/tools/tool",
    sections: [
      { heading: "类图的基本元素", content: "类图包含三部分：类名、属性（+/-/# 可见性 名称: 类型）、方法。可见性：+ public，- private，# protected。" },
      { heading: "六种关系", content: "1. 继承（空心三角）\n2. 实现（空心三角虚线）\n3. 关联（基本连接）\n4. 聚合（空心菱形，部分可独立）\n5. 组合（实心菱形，部分不能独立）\n6. 依赖（虚线箭头）" },
      { heading: "SOLID 设计原则", content: "S 单一职责 / O 开闭原则 / L 里氏替换 / I 接口隔离 / D 依赖倒置。好的类图应当体现这些原则。" },
    ],
  },
  "system-architecture-patterns": {
    title: "系统架构设计模式：从单体到微服务", tag: "系统设计",
    desc: "全面了解常见系统架构模式：分层架构、六边形架构、微服务、事件驱动，选择适合你的架构。",
    ctaText: "👉 用 AI 绘制系统架构图", ctaHref: "/tools/tool",
    sections: [
      { heading: "分层架构", content: "经典三层：表现层（Controller）、业务层（Service）、数据层（Repository）。适合中小型项目，简单易懂。" },
      { heading: "六边形架构", content: "端口与适配器模式，核心业务逻辑完全独立于外部依赖（数据库、消息队列、HTTP）。适合需要切换技术栈的项目。" },
      { heading: "微服务架构", content: "按业务域拆分服务，每个服务独立部署、独立数据库。优点：独立扩容、技术异构。缺点：分布式复杂度、数据一致性。" },
      { heading: "如何选择？", content: "团队 < 5人 → 单体 / 模块化单体。业务复杂且有独立团队 → 微服务。不确定 → 从模块化单体开始，按需拆分。" },
    ],
  },
  "rest-api-design": {
    title: "RESTful API 设计规范与实践", tag: "系统设计",
    desc: "学习 RESTful API 的设计原则：资源命名、HTTP 动词、状态码、版本管理、安全与认证，设计优雅的 API。",
    ctaText: "👉 用 AI 工具提升开发效率", ctaHref: "/tools/tool",
    sections: [
      { heading: "资源命名规范", content: "使用名词复数：/users, /orders。层级关系：/users/{id}/orders。避免动词：用 POST /orders 而非 /createOrder。" },
      { heading: "HTTP 动词与状态码", content: "GET 查询 / POST 创建 / PUT 全量更新 / PATCH 部分更新 / DELETE 删除。200 OK / 201 Created / 400 Bad Request / 404 Not Found / 500 Server Error。" },
      { heading: "分页、过滤与排序", content: "分页：?page=1&limit=20。过滤：?status=active。排序：?sort=-createdAt（-表示倒序）。响应中返回 total 和下一页链接。" },
      { heading: "认证与安全", content: "JWT Bearer Token。HTTPS 强制。输入校验与参数化查询防注入。速率限制防滥用。API Key 管理对外开放接口。" },
    ],
  },

  // ===== 图表教程 (3) =====
  "flowchart-guide": {
    title: "流程图绘制完全指南", tag: "效率工具",
    desc: "从基础符号到复杂流程，系统学习流程图的绘制方法，掌握 BPMN 基本元素，画出专业的业务流程图。",
    ctaText: "👉 AI 一键生成流程图", ctaHref: "/tools/tool",
    sections: [
      { heading: "基础符号", content: "圆角矩形：开始/结束。矩形：处理步骤。菱形：判断分支。箭头：流程方向。平行四边形：输入/输出。" },
      { heading: "流程图结构", content: "顺序结构：一步步执行。分支结构：根据条件选择路径。循环结构：满足条件时重复执行。用 Mermaid graph TD/LR 绘制。" },
      { heading: "最佳实践", content: "1. 从上到下、从左到右\n2. 一个流程图只表达一个主题\n3. 避免箭头交叉\n4. 关键决策点用菱形突出显示" },
    ],
  },
  "sequence-diagram-guide": {
    title: "时序图怎么画？交互流程设计入门", tag: "系统设计",
    desc: "学习时序图（Sequence Diagram）绘制方法，掌握参与者、生命线、消息箭头，清晰展示系统交互流程。",
    ctaText: "👉 AI 一键生成时序图", ctaHref: "/tools/tool",
    sections: [
      { heading: "时序图是什么？", content: "时序图展示对象之间消息传递的顺序，是分析系统交互的最佳工具。常用于 API 调用流程、微服务间通信、用户登录流程。" },
      { heading: "核心元素", content: "参与者（Actor/Object）：交互的主体。生命线（Lifeline）：垂直虚线表示时间。消息（Message）：箭头表示调用方向。激活框：表示执行期间。" },
      { heading: "Mermaid 语法", content: "sequenceDiagram 开头。participant 定义参与者。用 -> 表示同步调用，-->> 表示异步消息。Note 添加注释。" },
    ],
  },
  "gantt-chart-guide": {
    title: "甘特图教程：项目管理必备技能", tag: "项目管理",
    desc: "从基础概念到高级技巧，学习甘特图的制作方法，掌握 WBS 分解、依赖关系和关键路径分析。",
    ctaText: "👉 用 AI 生成项目甘特图", ctaHref: "/tools/tool",
    sections: [
      { heading: "甘特图的作用", content: "甘特图是项目管理中最常用的工具。横轴是时间，纵轴是任务，条形表示任务的开始和结束。直观展示项目进度。" },
      { heading: "WBS 分解", content: "Work Breakdown Structure：把大任务逐级分解为可管理的小任务。每个任务有明确的责任人、工期和前置依赖。" },
      { heading: "关键路径法", content: "关键路径是项目中最长的任务链，决定了项目的最短工期。关键路径上的任务不能延期，否则整个项目延期。" },
    ],
  },

  // ===== 学术写作 (3) =====
  "essay-writing-guide": {
    title: "论文写作全流程指南：从选题到答辩", tag: "学术写作",
    desc: "系统介绍学术论文写作的全流程：选题策略、文献综述、研究方法、数据分析、格式排版，助你顺利通过答辩。",
    ctaText: "👉 用 AI 工具辅助论文写作", ctaHref: "/tools/tool",
    sections: [
      { heading: "选题策略", content: "选题三原则：创新性（有研究价值）、可行性（能完成）、兴趣性（愿意投入）。结合导师方向，参考近三年文献找研究空白。" },
      { heading: "文献综述怎么写", content: "1. 确定检索关键词\n2. 使用 Google Scholar/知网搜索\n3. 按主题分类整理\n4. 分析各研究的贡献与不足\n5. 指出你的研究如何填补空白" },
      { heading: "论文结构", content: "标准结构：摘要 → 引言 → 文献综述 → 研究方法 → 实验/分析 → 结果讨论 → 结论。每章开头有导读，结尾有小结。" },
    ],
  },
  "literature-review-guide": {
    title: "文献综述怎么写？从查文献到归纳整理", tag: "学术写作",
    desc: "详细讲解文献综述的写作方法：检索技巧、文献管理、批判性阅读、归纳总结，写出高质量的 Literature Review。",
    ctaText: "👉 用 AI 工具提升写作效率", ctaHref: "/tools/tool",
    sections: [
      { heading: "检索技巧", content: "关键词组合搜索。使用布尔运算符 AND/OR/NOT。追踪高引论文的引用链。关注领域顶会/顶刊的最新成果。" },
      { heading: "文献管理", content: "使用 Zotero/Mendeley 管理参考文献。按主题建立文件夹。边读边标注关键发现与方法。自动生成参考文献格式。" },
      { heading: "写作框架", content: "漏斗式结构：从宽泛背景 → 聚焦研究问题。按时间线或主题线组织。每段只讨论一个观点。最后总结研究空白。" },
    ],
  },
  "graduation-project-guide": {
    title: "毕业设计全流程：选题到答辩一篇搞定", tag: "学术写作",
    desc: "毕业设计完整攻略：如何选题、怎么写开题报告、系统设计文档、代码实现、论文撰写、答辩准备。",
    ctaText: "👉 用 AI 画毕业设计的技术架构图", ctaHref: "/tools/tool",
    sections: [
      { heading: "选题建议", content: "实践型：做一个实际可用的系统（推荐）。研究型：探索算法改进。混合型：系统 + 创新点。与职业方向结合更有利。" },
      { heading: "开题报告", content: "包含：研究背景与意义、国内外现状、研究内容、技术路线、预期成果、进度安排。让评审老师看到清晰的计划。" },
      { heading: "答辩准备", content: "PPT 控制在 15-20 页。重点讲背景、方法、结果、创新点。准备常见问题的回答。演示系统要提前测试。" },
    ],
  },

  // ===== 开发工具 (2) =====
  "git-workflow-guide": {
    title: "Git 工作流程最佳实践", tag: "开发工具",
    desc: "掌握 Git Flow、GitHub Flow、Trunk-Based 等主流工作流，学习分支管理、代码审查和版本发布的最佳实践。",
    ctaText: "👉 探索更多开发工具", ctaHref: "/dev-tools",
    sections: [
      { heading: "常见工作流", content: "Git Flow：master + develop + feature/hotfix/release 分支，适合有固定发布周期的项目。GitHub Flow：feature → PR → main，适合持续部署。Trunk-Based：所有人直接提交到 main（配合 feature flag）。" },
      { heading: "分支管理", content: "分支命名：feature/xxx, bugfix/xxx, hotfix/xxx。一个分支只做一件事。合并前先 rebase 保持历史整洁。及时删除已合并的分支。" },
      { heading: "Commit 规范", content: "Conventional Commits：feat/fix/docs/refactor/test/chore。如 feat: add user login。关联 issue：fix #123。小步提交，每次提交可独立回滚。" },
    ],
  },
  "docker-basics": {
    title: "Docker 入门：容器化你的应用", tag: "开发工具",
    desc: "从零开始学习 Docker：镜像构建、容器管理、Docker Compose 编排、多阶段构建优化，掌握容器化部署的核心技能。",
    ctaText: "👉 了解更多开发工具", ctaHref: "/dev-tools",
    sections: [
      { heading: "核心概念", content: "镜像（Image）：应用的打包模板。容器（Container）：镜像的运行实例。Dockerfile：构建镜像的脚本。Registry：镜像仓库（Docker Hub）。" },
      { heading: "Dockerfile 最佳实践", content: "使用官方基础镜像。多阶段构建减小镜像体积。利用构建缓存（先复制 package.json 再 npm install）。不要以 root 运行容器。" },
      { heading: "Docker Compose", content: "用 YAML 定义多容器应用。一键启动：docker-compose up。适合本地开发环境。可为每个服务配置端口、卷挂载、环境变量。" },
    ],
  },

  // ===== 业务系统 (6) =====
  "ecommerce-db-design": {
    title: "电商数据库设计实战", tag: "电商系统",
    desc: "深入电商系统的数据库设计：用户、商品、订单、购物车、支付、物流六大模块的完整表结构设计。",
    ctaText: "👉 AI 一键生成电商 ER 图", ctaHref: "/tools/tool?template=tpl-ecommerce-er",
    sections: [
      { heading: "用户模块", content: "用户表 + 地址表 + 用户等级。邮箱/手机号双登录。收货地址支持多个，设默认地址。用户等级影响折扣。" },
      { heading: "商品模块", content: "商品表 + SKU 表 + 分类表 + 品牌表。SPU 与 SKU 的关系。商品属性用 JSON 字段存储。分类支持多级（parent_id 自关联）。" },
      { heading: "订单模块", content: "订单主表 + 订单明细表 + 订单状态流水表。状态机：待支付 → 已支付 → 已发货 → 已收货 → 已完成。支持部分退款和整单取消。" },
    ],
  },
  "inventory-system-design": {
    title: "库存管理系统设计与实现", tag: "库存管理",
    desc: "完整库存管理系统设计：入库/出库/盘点/调拨四大流程，多仓库库存同步，库存预警机制。",
    ctaText: "👉 AI 生成库存管理 ER 图", ctaHref: "/tools/tool?template=tpl-inventory-er",
    sections: [
      { heading: "库存核心概念", content: "SKU 粒度的库存管理。可用库存 = 实际库存 - 锁定库存。安全库存预警线。批次/效期管理（食品/药品行业必需）。" },
      { heading: "出入库流程", content: "入库：采购单 → 质检 → 上架。出库：订单 → 拣货 → 复核 → 发货。每次出入库都要记录流水，方便审计和对账。" },
      { heading: "库存同步", content: "多仓库场景：总库存 = 各仓库存之和。调拨单实现在仓库间转移。使用乐观锁或分布式锁防止超卖。" },
    ],
  },
  "hospital-information-system": {
    title: "医院信息系统数据库设计", tag: "医院管理",
    desc: "HIS 系统核心模块设计：挂号、门诊、住院、药房、检查检验，医疗信息系统的完整数据库方案。",
    ctaText: "👉 AI 生成医院管理 ER 图", ctaHref: "/tools/tool?template=tpl-hospital-er",
    sections: [
      { heading: "挂号模块", content: "科室 → 医生 → 排班 → 号源。支持预约挂号和当日挂号。号源管理需处理退号和爽约场景。" },
      { heading: "门诊模块", content: "医生接诊 → 开具处方/检查 → 缴费 → 取药/检查。门诊病历结构化存储，方便后续查询和统计分析。" },
      { heading: "住院模块", content: "入院登记 → 病房分配 → 医嘱执行 → 费用记账 → 出院结算。每日费用清单实时更新，支持医保结算。" },
    ],
  },
  "cms-database-design": {
    title: "内容管理系统数据库设计", tag: "博客系统",
    desc: "CMS 系统的数据库设计：内容类型、分类标签、发布流程、版本管理、权限控制，打造灵活的内容平台。",
    ctaText: "👉 AI 生成 CMS ER 图", ctaHref: "/tools/tool?template=tpl-cms-er",
    sections: [
      { heading: "内容模型", content: "内容类型表（定义字段 schema） + 内容表（存储实际内容）。支持自定义字段。内容状态：草稿/待审核/已发布/已撤回。" },
      { heading: "分类与标签", content: "分类：层级结构（树形），每个内容属于一个分类。标签：扁平结构（打标），一个内容可以有多个标签。两者结合提升检索灵活性。" },
      { heading: "版本管理", content: "每次修改创建新版本记录。支持版本对比和回滚。已发布版本与草稿版本分离。定时发布功能。" },
    ],
  },
  "mindmap-guide": {
    title: "思维导图绘制方法与学习技巧", tag: "学习方法",
    desc: "学习思维导图的核心绘制方法，掌握关键词提炼、层级结构、视觉化表达技巧，提升学习效率和记忆力。",
    ctaText: "👉 AI 一键生成思维导图", ctaHref: "/tools/tool",
    sections: [
      { heading: "思维导图原理", content: "基于大脑放射性思维模式。中心主题 → 一级分支 → 二级分支 → 细节。结合颜色、图标、缩写增强记忆效果。" },
      { heading: "绘制技巧", content: "1. 中心主题用图像化表达\n2. 每分支一个关键词\n3. 层级不超过 4-5 层\n4. 用不同颜色区分主分支\n5. 添加图标和符号" },
      { heading: "应用场景", content: "学习笔记：将书本知识结构化。会议记录：快速整理讨论要点。头脑风暴：发散思维不设限。项目规划：WBS 以思维导图呈现。" },
    ],
  },
  "json-formatting-guide": {
    title: "JSON 格式化工具与使用技巧", tag: "开发工具",
    desc: "JSON 数据格式完全指南：语法规则、格式化工具、Schema 验证、JSONPath 查询，提升数据处理效率。",
    ctaText: "👉 试用在线 JSON 格式化工具", ctaHref: "/dev-tools",
    sections: [
      { heading: "JSON 基础", content: "键值对格式，键必须用双引号。支持：字符串、数字、布尔、null、数组、对象。常见错误：尾部逗号、单引号、注释（不合法）。" },
      { heading: "格式化与校验", content: "在线工具一键美化/压缩。VS Code 内置格式化（Shift+Alt+F）。JSON Schema 定义结构约束。使用 JSONLint 快速检查语法。" },
      { heading: "JSONPath", content: "$.store.book[0].title 定位嵌套数据。$..author 递归查找所有 author。@.price < 10 条件过滤。比手写循环高效得多。" },
    ],
  },
};
