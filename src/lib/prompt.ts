/**
 * AI 提示词 — V3 精简版
 *
 * 优化策略：
 *   1. Prompt 极短，让模型直奔主题
 *   2. 模板优先匹配（0.1秒返回，跳过AI）
 *   3. 配合 max_tokens=2048 限制输出长度
 */

// ===== 模板关键词匹配（跳过 AI，直接返回预设代码） =====

interface TemplateMatch {
  keywords: string[];
  code: string;
}

export const TEMPLATE_MATCHES: Record<string, TemplateMatch[]> = {
  er: [
    {
      keywords: ["学生", "课程", "成绩", "教务", "选课"],
      code: `erDiagram
  STUDENT { string id PK; string name; string email; date birth }
  COURSE { string id PK; string name; int credits; string teacherId FK }
  ENROLLMENT { string id PK; string studentId FK; string courseId FK; float score }
  TEACHER { string id PK; string name; string department }
  STUDENT ||--o{ ENROLLMENT : selects
  COURSE ||--o{ ENROLLMENT : has
  TEACHER ||--o{ COURSE : teaches`,
    },
    {
      keywords: ["电商", "商城", "商品", "订单", "购物车"],
      code: `erDiagram
  USER { string id PK; string username; string email }
  PRODUCT { string id PK; string name; float price; int stock }
  ORDER { string id PK; string userId FK; float total; string status }
  ORDER_ITEM { string id PK; string orderId FK; string productId FK; int qty }
  USER ||--o{ ORDER : places
  ORDER ||--o{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : includes`,
    },
    {
      keywords: ["博客", "文章", "评论", "CMS", "分类", "标签"],
      code: `erDiagram
  USER { string id PK; string username; string avatar }
  POST { string id PK; string userId FK; string title; string content }
  CATEGORY { string id PK; string name; string slug }
  COMMENT { string id PK; string postId FK; string userId FK; string content }
  TAG { string id PK; string name }
  POST_TAG { string postId FK; string tagId FK }
  USER ||--o{ POST : writes
  POST ||--o{ COMMENT : has
  CATEGORY ||--o{ POST : groups
  POST ||--o{ POST_TAG : tagged
  TAG ||--o{ POST_TAG : used`,
    },
    {
      keywords: ["医院", "挂号", "医生", "患者", "预约", "门诊"],
      code: `erDiagram
  PATIENT { string id PK; string name; string phone }
  DEPARTMENT { string id PK; string name }
  DOCTOR { string id PK; string name; string deptId FK; string title }
  APPOINTMENT { string id PK; string patientId FK; string doctorId FK; datetime time }
  PATIENT ||--o{ APPOINTMENT : books
  DOCTOR ||--o{ APPOINTMENT : accepts
  DEPARTMENT ||--o{ DOCTOR : has`,
    },
    {
      keywords: ["库存", "仓库", "入库", "出库", "盘点", "供应链"],
      code: `erDiagram
  WAREHOUSE { string id PK; string name; string location }
  PRODUCT { string id PK; string name; string sku }
  INVENTORY { string id PK; string warehouseId FK; string productId FK; int qty }
  SUPPLIER { string id PK; string name; string contact }
  INBOUND { string id PK; string productId FK; string supplierId FK; int qty }
  WAREHOUSE ||--o{ INVENTORY : stores
  PRODUCT ||--o{ INVENTORY : tracked
  SUPPLIER ||--o{ INBOUND : supplies`,
    },
    {
      keywords: ["HR", "人力资源", "员工", "部门", "考勤", "薪资"],
      code: `erDiagram
  DEPARTMENT { string id PK; string name }
  EMPLOYEE { string id PK; string name; string deptId FK; string position }
  ATTENDANCE { string id PK; string empId FK; date checkDate; string status }
  SALARY { string id PK; string empId FK; float amount; string period }
  DEPARTMENT ||--o{ EMPLOYEE : staffs
  EMPLOYEE ||--o{ ATTENDANCE : clocks
  EMPLOYEE ||--o{ SALARY : paid`,
    },
  ],
  flowchart: [
    {
      keywords: ["登录", "注册", "验证"],
      code: `graph TD
  A[用户访问] --> B{是否已注册?}
  B -->|否| C[注册页面]
  B -->|是| D[登录页面]
  C --> E[填写信息]
  E --> F[验证邮箱]
  F --> G[注册成功]
  D --> H[输入账号密码]
  H --> I{验证通过?}
  I -->|是| J[进入系统]
  I -->|否| H`,
    },
    {
      keywords: ["下单", "购买", "支付", "购物"],
      code: `graph TD
  A[浏览商品] --> B[加入购物车]
  B --> C[确认订单]
  C --> D{库存充足?}
  D -->|是| E[选择支付方式]
  D -->|否| F[提示缺货]
  E --> G[支付处理]
  G --> H{支付成功?}
  H -->|是| I[生成订单]
  H -->|否| J[支付失败]`,
    },
  ],
};

/** 匹配模板关键词，命中则直接返回代码（跳过 AI） */
export function matchTemplate(type: string, text: string): string | null {
  const matches = TEMPLATE_MATCHES[type];
  if (!matches) return null;

  const lower = text.toLowerCase();
  for (const tmpl of matches) {
    const matched = tmpl.keywords.filter((kw) => lower.includes(kw));
    if (matched.length >= Math.ceil(tmpl.keywords.length * 0.6)) {
      return tmpl.code;
    }
  }
  return null;
}
