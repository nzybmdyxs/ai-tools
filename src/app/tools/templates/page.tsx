// ==========================================
// 模板库页面
// /tools/templates
// ==========================================

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "模板库 — AI 结构图模板中心",
  description:
    "精选 ER 图、流程图、UML 类图等模板，覆盖电商、博客、学生管理、医院管理等场景，一键使用。",
  keywords: "ER图模板,流程图模板,UML模板,数据库设计模板",
};

/** 模板分类配置 */
const CATEGORIES: Record<string, { label: string; icon: string; desc: string }> = {
  电商系统: { label: "电商系统", icon: "🛒", desc: "商城、订单、商品管理相关模板" },
  博客系统: { label: "博客系统", icon: "📝", desc: "CMS、博客、内容管理相关模板" },
  学生管理: { label: "学生管理系统", icon: "🎓", desc: "学生、课程、成绩管理模板" },
  医院管理: { label: "医院管理系统", icon: "🏥", desc: "挂号、病历、药房管理模板" },
  库存管理: { label: "库存管理系统", icon: "📦", desc: "出入库、盘点、供应链模板" },
};

/** 图表类型标签（后续可在模板卡片中展示类型） */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _TYPE_LABELS: Record<string, string> = {
  flow: "流程图",
  er: "ER 图",
  uml: "UML 类图",
  sequence: "时序图",
  gantt: "甘特图",
  mindmap: "思维导图",
};

export default async function TemplatesPage() {
  // 从数据库加载模板
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 如果数据库为空，使用预设模板数据
  const displayTemplates =
    templates.length > 0 ? templates : DEFAULT_TEMPLATES;

  // 按分类分组
  const grouped: Record<string, typeof displayTemplates> = {};
  for (const t of displayTemplates) {
    const cat = t.category || "其他";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-blue-600">
          制图工具
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">模板库</span>
      </div>

      {/* 标题 */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          📦 模板库
        </h1>
        <p className="text-gray-500 text-lg">
          精选优质模板，一键加载使用 — 覆盖 {Object.keys(CATEGORIES).length} 大业务场景
        </p>
      </div>

      {/* 模板数量统计 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count =
            displayTemplates.filter((t) => t.category === key).length ||
            (key === "电商系统" ? 2 : key === "学生管理" ? 2 : key === "库存管理" ? 1 : key === "医院管理" ? 1 : 1);
          return (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-200 transition-colors"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-lg font-bold text-gray-800">{count}</div>
              <div className="text-xs text-gray-400">{cat.label}</div>
            </div>
          );
        })}
      </div>

      {/* 模板列表（按分类） */}
      {Object.keys(CATEGORIES).map((categoryKey) => {
        const categoryTemplates = displayTemplates.filter(
          (t) => t.category === categoryKey
        );
        if (categoryTemplates.length === 0) return null;

        return (
          <section key={categoryKey} className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>{CATEGORIES[categoryKey]?.icon}</span>
              {CATEGORIES[categoryKey]?.label || categoryKey}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* 没有模板时 */}
      {displayTemplates.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg">模板库正在建设中</p>
          <p className="text-sm mt-1">敬请期待更多优质模板...</p>
        </div>
      )}

      {/* 底部 CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-8 text-center">
        <p className="text-xl font-bold text-blue-800 mb-3">
          🚀 用 AI 一键生成你的专属图表
        </p>
        <p className="text-blue-600 mb-6">
          没有找到合适的模板？试试 AI 免费生成！
        </p>
        <Link
          href="/tools/tool"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          开始生成 →
        </Link>
      </div>
    </div>
  );
}

/** 模板卡片 */
function TemplateCard({
  template,
}: {
  template: { id: string; title: string; description: string; preview: string; code: string; category: string };
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col">
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
        {template.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
        {template.description}
      </p>

      {template.preview && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <pre className="text-xs text-gray-600 overflow-x-auto max-h-24 overflow-y-auto line-clamp-4">
            {template.preview.slice(0, 200)}
          </pre>
        </div>
      )}

      <Link
        href={`/tools/tool?template=${template.id}`}
        className="block text-center py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors mt-auto"
      >
        🚀 一键使用
      </Link>
    </div>
  );
}

// ========== 预设模板数据（数据库为空时使用） ==========

const DEFAULT_TEMPLATES = [
  {
    id: "tpl-student-er",
    title: "学生管理系统 ER 图",
    category: "学生管理",
    description: "包含学生、课程、教师、成绩等实体的完整 ER 图，适合教务管理系统数据库设计。",
    preview: "STUDENT ||--o{ ENROLLMENT : has\nCOURSE ||--o{ ENROLLMENT : contains\nTEACHER ||--o{ COURSE : teaches",
    code: `erDiagram
  STUDENT {
    string id PK
    string name
    string email
    date birthDate
  }
  COURSE {
    string id PK
    string name
    int credits
    string teacherId FK
  }
  ENROLLMENT {
    string id PK
    string studentId FK
    string courseId FK
    float score
  }
  TEACHER {
    string id PK
    string name
    string department
  }
  STUDENT ||--o{ ENROLLMENT : selects
  COURSE ||--o{ ENROLLMENT : has
  TEACHER ||--o{ COURSE : teaches`,
  },
  {
    id: "tpl-student-flow",
    title: "学生选课流程图",
    category: "学生管理",
    description: "从登录到选课完成的完整业务流程，包含判断分支和异常处理。",
    preview: "graph TD\n  A[学生登录] --> B[浏览课程]\n  B --> C{课程人数已满?}",
    code: `graph TD
  A[学生登录系统] --> B[浏览可选课程]
  B --> C{是否有名额?}
  C -->|是| D[加入选课列表]
  C -->|否| E[提示课程已满]
  D --> F[确认选课]
  F --> G[选课成功]
  E --> B`,
  },
  {
    id: "tpl-ecommerce-er",
    title: "电商系统 ER 图",
    category: "电商系统",
    description: "用户、商品、订单、购物车、评价等电商核心实体的数据库设计。",
    preview: "USER ||--o{ ORDER : places\nPRODUCT ||--o{ ORDER_ITEM : contains",
    code: `erDiagram
  USER {
    string id PK
    string username
    string email
    string address
  }
  PRODUCT {
    string id PK
    string name
    float price
    int stock
  }
  ORDER {
    string id PK
    string userId FK
    float totalAmount
    string status
  }
  ORDER_ITEM {
    string id PK
    string orderId FK
    string productId FK
    int quantity
    float price
  }
  USER ||--o{ ORDER : places
  ORDER ||--o{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : includes`,
  },
  {
    id: "tpl-ecommerce-flow",
    title: "商品下单流程图",
    category: "电商系统",
    description: "从浏览商品到支付成功的完整购物流程，含库存判断和支付分支。",
    preview: "graph TD\n  A[浏览商品] --> B[加入购物车]\n  B --> C[确认订单]",
    code: `graph TD
  A[用户浏览商品] --> B[加入购物车]
  B --> C[确认订单信息]
  C --> D{库存是否充足?}
  D -->|是| E[选择支付方式]
  D -->|否| F[提示库存不足]
  E --> G[支付处理]
  G --> H{支付成功?}
  H -->|是| I[生成订单]
  H -->|否| J[支付失败]
  I --> K[发货]
  F --> B`,
  },
  {
    id: "tpl-inventory-er",
    title: "库存管理系统 ER 图",
    category: "库存管理",
    description: "仓库、商品、入库单、出库单、供应商等库存管理核心实体设计。",
    preview: "WAREHOUSE ||--o{ INVENTORY : stores\nPRODUCT ||--o{ INVENTORY : tracked",
    code: `erDiagram
  WAREHOUSE {
    string id PK
    string name
    string location
  }
  PRODUCT {
    string id PK
    string name
    string sku
    float costPrice
  }
  INVENTORY {
    string id PK
    string warehouseId FK
    string productId FK
    int quantity
  }
  SUPPLIER {
    string id PK
    string name
    string contact
  }
  INBOUND {
    string id PK
    string productId FK
    string supplierId FK
    int quantity
  }
  WAREHOUSE ||--o{ INVENTORY : stores
  PRODUCT ||--o{ INVENTORY : tracked_by
  SUPPLIER ||--o{ INBOUND : supplies
  PRODUCT ||--o{ INBOUND : received`,
  },
  {
    id: "tpl-hospital-er",
    title: "医院挂号系统 ER 图",
    category: "医院管理",
    description: "患者、医生、科室、挂号、处方等医院信息系统的数据库设计。",
    preview: "PATIENT ||--o{ APPOINTMENT : books\nDOCTOR ||--o{ APPOINTMENT : accepts",
    code: `erDiagram
  PATIENT {
    string id PK
    string name
    string phone
    date birthDate
  }
  DEPARTMENT {
    string id PK
    string name
    string description
  }
  DOCTOR {
    string id PK
    string name
    string departmentId FK
    string title
  }
  APPOINTMENT {
    string id PK
    string patientId FK
    string doctorId FK
    datetime appointTime
    string status
  }
  PATIENT ||--o{ APPOINTMENT : books
  DOCTOR ||--o{ APPOINTMENT : accepts
  DEPARTMENT ||--o{ DOCTOR : has`,
  },
  {
    id: "tpl-blog-er",
    title: "博客系统 ER 图",
    category: "博客系统",
    description: "用户、文章、分类、评论、标签等 CMS 博客系统的数据库设计。",
    preview: "USER ||--o{ POST : writes\nPOST ||--o{ COMMENT : has",
    code: `erDiagram
  USER {
    string id PK
    string username
    string email
    string avatar
  }
  POST {
    string id PK
    string userId FK
    string title
    string content
    string categoryId FK
  }
  CATEGORY {
    string id PK
    string name
    string slug
  }
  COMMENT {
    string id PK
    string postId FK
    string userId FK
    string content
  }
  TAG {
    string id PK
    string name
  }
  POST_TAG {
    string postId FK
    string tagId FK
  }
  USER ||--o{ POST : writes
  USER ||--o{ COMMENT : posts
  POST ||--o{ COMMENT : has
  CATEGORY ||--o{ POST : contains
  POST ||--o{ POST_TAG : tagged
  TAG ||--o{ POST_TAG : used`,
  },
];
