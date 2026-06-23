// ==========================================
// 模板库数据 — 30 个预设模板
// 覆盖 7 大业务场景
// ==========================================

export interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  preview: string;
  code: string;
}

export const DEFAULT_TEMPLATES: TemplateItem[] = [
  // ===== 学生管理 (6) =====
  {
    id: "tpl-student-er",
    title: "学生管理系统 ER 图", category: "学生管理",
    description: "包含学生、课程、教师、成绩等实体的完整 ER 图",
    preview: "STUDENT ||--o{ ENROLLMENT : has",
    code: `erDiagram\n  STUDENT { string id PK; string name; string email }\n  COURSE { string id PK; string name; int credits }\n  ENROLLMENT { string id PK; string studentId FK; string courseId FK; float score }\n  TEACHER { string id PK; string name; string department }\n  STUDENT ||--o{ ENROLLMENT : selects\n  COURSE ||--o{ ENROLLMENT : has\n  TEACHER ||--o{ COURSE : teaches`,
  },
  {
    id: "tpl-student-flow", title: "学生选课流程图", category: "学生管理",
    description: "从登录到选课完成的完整业务流程",
    preview: "graph TD\n  A[学生登录] --> B[浏览课程]",
    code: `graph TD\n  A[学生登录] --> B[浏览可选课程]\n  B --> C{是否有名额?}\n  C -->|是| D[加入选课列表]\n  C -->|否| E[提示课程已满]\n  D --> F[确认选课]\n  F --> G[选课成功]\n  E --> B`,
  },
  {
    id: "tpl-library-er", title: "图书馆管理系统 ER 图", category: "学生管理",
    description: "图书、读者、借阅、归还等图书馆核心实体设计",
    preview: "READER ||--o{ BORROW : borrows\nBOOK ||--o{ BORROW : borrowed",
    code: `erDiagram\n  READER { string id PK; string name; string type }\n  BOOK { string id PK; string title; string author; string isbn }\n  BORROW { string id PK; string readerId FK; string bookId FK; date borrowDate; date dueDate }\n  READER ||--o{ BORROW : borrows\n  BOOK ||--o{ BORROW : in_record`,
  },
  {
    id: "tpl-dormitory-er", title: "宿舍管理系统 ER 图", category: "学生管理",
    description: "宿舍楼、房间、学生入住分配等实体设计",
    preview: "BUILDING ||--o{ ROOM : contains\nSTUDENT ||--o{ ROOM : lives_in",
    code: `erDiagram\n  BUILDING { string id PK; string name; int floors }\n  ROOM { string id PK; string buildingId FK; string roomNo; int capacity }\n  STUDENT { string id PK; string name; string roomId FK }\n  BUILDING ||--o{ ROOM : contains\n  ROOM ||--o{ STUDENT : accommodates`,
  },
  {
    id: "tpl-grade-er", title: "成绩管理系统 ER 图", category: "学生管理",
    description: "学生成绩录入、查询、统计的数据库设计",
    preview: "STUDENT ||--o{ SCORE : receives\nCOURSE ||--o{ SCORE : graded",
    code: `erDiagram\n  STUDENT { string id PK; string name }\n  COURSE { string id PK; string name; string semester }\n  SCORE { string id PK; string studentId FK; string courseId FK; float value; string grade }\n  STUDENT ||--o{ SCORE : receives\n  COURSE ||--o{ SCORE : has`,
  },
  {
    id: "tpl-exam-er", title: "考试安排系统 ER 图", category: "学生管理",
    description: "考试时间、考场分配、监考安排的数据库设计",
    preview: "EXAM ||--o{ EXAM_ROOM : scheduled\nROOM ||--o{ EXAM_ROOM : used",
    code: `erDiagram\n  EXAM { string id PK; string courseId FK; datetime examTime }\n  ROOM { string id PK; string name; int capacity }\n  EXAM_ROOM { string id PK; string examId FK; string roomId FK }\n  EXAM ||--o{ EXAM_ROOM : scheduled_in\n  ROOM ||--o{ EXAM_ROOM : hosts`,
  },

  // ===== 电商系统 (6) =====
  { id: "tpl-ecommerce-er", title: "电商系统 ER 图", category: "电商系统", description: "用户、商品、订单、购物车等电商核心实体", preview: "USER ||--o{ ORDER : places", code: `erDiagram\n  USER { string id PK; string username; string email }\n  PRODUCT { string id PK; string name; float price; int stock }\n  ORDER { string id PK; string userId FK; float total; string status }\n  ORDER_ITEM { string id PK; string orderId FK; string productId FK; int qty }\n  USER ||--o{ ORDER : places\n  ORDER ||--o{ ORDER_ITEM : contains\n  PRODUCT ||--o{ ORDER_ITEM : includes` },
  { id: "tpl-ecommerce-flow", title: "商品下单流程图", category: "电商系统", description: "从浏览到支付的完整购物流程", preview: "graph TD\n  A[浏览商品] --> B[加入购物车]", code: `graph TD\n  A[浏览商品] --> B[加入购物车]\n  B --> C[确认订单]\n  C --> D{库存充足?}\n  D -->|是| E[选择支付]\n  D -->|否| F[提示库存不足]\n  E --> G{支付成功?}\n  G -->|是| H[生成订单]\n  G -->|否| I[支付失败]\n  H --> J[发货通知]` },
  { id: "tpl-order-er", title: "订单管理系统 ER 图", category: "电商系统", description: "订单、物流、退换货的完整订单域设计", preview: "ORDER ||--o{ SHIPMENT : has\nORDER ||--o{ REFUND : may_have", code: `erDiagram\n  ORDER { string id PK; string userId FK; string status }\n  SHIPMENT { string id PK; string orderId FK; string trackingNo }\n  REFUND { string id PK; string orderId FK; string reason; float amount }\n  ORDER ||--o{ SHIPMENT : ships_via\n  ORDER ||--o{ REFUND : refunded_by` },
  { id: "tpl-payment-er", title: "支付系统 ER 图", category: "电商系统", description: "支付渠道、交易记录、对账的数据库设计", preview: "USER ||--o{ TRANSACTION : initiates\nPAYMENT_METHOD ||--o{ TRANSACTION : used_in", code: `erDiagram\n  USER { string id PK; string name }\n  TRANSACTION { string id PK; string userId FK; string methodId FK; float amount; string status }\n  PAYMENT_METHOD { string id PK; string type; string accountNo }\n  USER ||--o{ TRANSACTION : creates\n  PAYMENT_METHOD ||--o{ TRANSACTION : processes` },
  { id: "tpl-cart-flow", title: "购物车流程图", category: "电商系统", description: "加购、修改数量、结算的购物车完整流程", preview: "graph TD\n  A[浏览商品] --> B[加入购物车]", code: `graph TD\n  A[浏览商品] --> B[加入购物车]\n  B --> C[查看购物车]\n  C --> D{修改数量?}\n  D -->|是| E[更新数量]\n  D -->|否| F[去结算]\n  E --> C\n  F --> G[填写地址]\n  G --> H[提交订单]` },
  { id: "tpl-product-er", title: "商品管理系统 ER 图", category: "电商系统", description: "商品、分类、SKU、库存的多维度设计", preview: "CATEGORY ||--o{ PRODUCT : groups\nPRODUCT ||--o{ SKU : has", code: `erDiagram\n  CATEGORY { string id PK; string name; string parentId }\n  PRODUCT { string id PK; string name; string categoryId FK }\n  SKU { string id PK; string productId FK; string spec; int stock; float price }\n  CATEGORY ||--o{ PRODUCT : contains\n  PRODUCT ||--o{ SKU : variant_of` },

  // ===== 库存管理 (5) =====
  { id: "tpl-inventory-er", title: "库存管理系统 ER 图", category: "库存管理", description: "仓库、商品、出入库单、供应商核心设计", preview: "WAREHOUSE ||--o{ INVENTORY : stores", code: `erDiagram\n  WAREHOUSE { string id PK; string name; string location }\n  PRODUCT { string id PK; string name; string sku }\n  INVENTORY { string id PK; string warehouseId FK; string productId FK; int qty }\n  SUPPLIER { string id PK; string name; string contact }\n  WAREHOUSE ||--o{ INVENTORY : stores\n  PRODUCT ||--o{ INVENTORY : tracked\n  SUPPLIER ||--o{ INBOUND : supplies` },
  { id: "tpl-inbound-flow", title: "入库流程图", category: "库存管理", description: "采购到入库质检的完整业务流程", preview: "graph TD\n  A[采购下单] --> B[供应商发货]", code: `graph TD\n  A[采购下单] --> B[供应商发货]\n  B --> C[货物到达]\n  C --> D{质检合格?}\n  D -->|是| E[入库上架]\n  D -->|否| F[退货处理]\n  E --> G[更新库存]` },
  { id: "tpl-outbound-flow", title: "出库流程图", category: "库存管理", description: "订单拣货到发货确认的出库流程", preview: "graph TD\n  A[接收订单] --> B[生成拣货单]", code: `graph TD\n  A[接收订单] --> B[生成拣货单]\n  B --> C[仓库拣货]\n  C --> D{库存充足?}\n  D -->|是| E[打包出库]\n  D -->|否| F[缺货处理]\n  E --> G[物流发货]` },
  { id: "tpl-warehouse-er", title: "多仓库管理系统 ER 图", category: "库存管理", description: "多仓库调拨、库存同步的数据库设计", preview: "WAREHOUSE ||--o{ TRANSFER : from\nWAREHOUSE ||--o{ TRANSFER : to", code: `erDiagram\n  WAREHOUSE { string id PK; string name; string region }\n  PRODUCT { string id PK; string name }\n  STOCK { string id PK; string warehouseId FK; string productId FK; int qty }\n  TRANSFER { string id PK; string fromWhId FK; string toWhId FK; string status }\n  WAREHOUSE ||--o{ STOCK : holds\n  WAREHOUSE ||--o{ TRANSFER : source\n  WAREHOUSE ||--o{ TRANSFER : target` },
  { id: "tpl-supply-chain-flow", title: "供应链管理流程图", category: "库存管理", description: "采购-仓储-物流-销售的全链路流程", preview: "graph LR\n  A[供应商] --> B[采购]\n  B --> C[仓储]", code: `graph LR\n  A[供应商] --> B[采购]\n  B --> C[仓储入库]\n  C --> D[库存管理]\n  D --> E[订单处理]\n  E --> F[物流配送]\n  F --> G[客户签收]` },

  // ===== 医院管理 (5) =====
  { id: "tpl-hospital-er", title: "医院挂号系统 ER 图", category: "医院管理", description: "患者、医生、科室、挂号的核心设计", preview: "PATIENT ||--o{ APPOINTMENT : books", code: `erDiagram\n  PATIENT { string id PK; string name; string phone }\n  DEPARTMENT { string id PK; string name }\n  DOCTOR { string id PK; string name; string deptId FK; string title }\n  APPOINTMENT { string id PK; string patientId FK; string doctorId FK; datetime time; string status }\n  PATIENT ||--o{ APPOINTMENT : books\n  DOCTOR ||--o{ APPOINTMENT : accepts\n  DEPARTMENT ||--o{ DOCTOR : has` },
  { id: "tpl-pharmacy-er", title: "药房管理系统 ER 图", category: "医院管理", description: "药品、处方、发药的数据库设计", preview: "PRESCRIPTION ||--o{ DISPENSE : filled\nDRUG ||--o{ DISPENSE : used", code: `erDiagram\n  DRUG { string id PK; string name; string spec; int stock }\n  PRESCRIPTION { string id PK; string patientId FK; string doctorId FK }\n  DISPENSE { string id PK; string prescriptionId FK; string drugId FK; int qty }\n  PRESCRIPTION ||--o{ DISPENSE : dispensed_as\n  DRUG ||--o{ DISPENSE : includes` },
  { id: "tpl-medical-record-er", title: "电子病历系统 ER 图", category: "医院管理", description: "病历、诊断、检查报告的数据库设计", preview: "PATIENT ||--o{ MEDICAL_RECORD : has\nDOCTOR ||--o{ MEDICAL_RECORD : creates", code: `erDiagram\n  PATIENT { string id PK; string name; date birth }\n  DOCTOR { string id PK; string name; string dept }\n  MEDICAL_RECORD { string id PK; string patientId FK; string doctorId FK; string diagnosis }\n  PATIENT ||--o{ MEDICAL_RECORD : owns\n  DOCTOR ||--o{ MEDICAL_RECORD : authors` },
  { id: "tpl-inpatient-er", title: "住院管理系统 ER 图", category: "医院管理", description: "病房、床位、住院患者管理设计", preview: "WARD ||--o{ BED : contains\nPATIENT ||--o{ BED : occupies", code: `erDiagram\n  WARD { string id PK; string name; string type }\n  BED { string id PK; string wardId FK; string bedNo; string status }\n  PATIENT { string id PK; string name }\n  ADMISSION { string id PK; string patientId FK; string bedId FK; date admitDate; date dischargeDate }\n  WARD ||--o{ BED : has\n  PATIENT ||--o{ ADMISSION : admitted\n  BED ||--o{ ADMISSION : assigned` },
  { id: "tpl-appointment-flow", title: "预约挂号流程图", category: "医院管理", description: "从选择科室到挂号成功的完整流程", preview: "graph TD\n  A[选择科室] --> B[选择医生]", code: `graph TD\n  A[选择科室] --> B[选择医生]\n  B --> C[选择时间]\n  C --> D{该时段有空?}\n  D -->|是| E[确认挂号]\n  D -->|否| C\n  E --> F[支付挂号费]\n  F --> G[挂号成功]` },

  // ===== 博客系统 (4) =====
  { id: "tpl-blog-er", title: "博客系统 ER 图", category: "博客系统", description: "用户、文章、分类、评论、标签的完整设计", preview: "USER ||--o{ POST : writes\nPOST ||--o{ COMMENT : has", code: `erDiagram\n  USER { string id PK; string username; string avatar }\n  POST { string id PK; string userId FK; string title; string content; string categoryId FK }\n  CATEGORY { string id PK; string name; string slug }\n  COMMENT { string id PK; string postId FK; string userId FK; string content }\n  TAG { string id PK; string name }\n  POST_TAG { string postId FK; string tagId FK }\n  USER ||--o{ POST : writes\n  POST ||--o{ COMMENT : receives\n  CATEGORY ||--o{ POST : groups\n  POST ||--o{ POST_TAG : tagged\n  TAG ||--o{ POST_TAG : labels` },
  { id: "tpl-cms-er", title: "CMS 内容管理系统 ER 图", category: "博客系统", description: "内容类型、发布流程、版本管理设计", preview: "CONTENT_TYPE ||--o{ CONTENT : defines\nUSER ||--o{ CONTENT : authors", code: `erDiagram\n  USER { string id PK; string name; string role }\n  CONTENT_TYPE { string id PK; string name; string schema }\n  CONTENT { string id PK; string typeId FK; string authorId FK; string title; string body; string status }\n  USER ||--o{ CONTENT : creates\n  CONTENT_TYPE ||--o{ CONTENT : typed_by` },
  { id: "tpl-forum-er", title: "论坛系统 ER 图", category: "博客系统", description: "板块、帖子、回复、用户等级设计", preview: "FORUM ||--o{ THREAD : contains\nUSER ||--o{ THREAD : starts", code: `erDiagram\n  FORUM { string id PK; string name; string desc }\n  THREAD { string id PK; string forumId FK; string userId FK; string title }\n  POST { string id PK; string threadId FK; string userId FK; string content }\n  USER { string id PK; string username; string level }\n  FORUM ||--o{ THREAD : has\n  USER ||--o{ THREAD : creates\n  THREAD ||--o{ POST : receives` },
  { id: "tpl-blog-flow", title: "博客发布流程图", category: "博客系统", description: "从写作到发布的内容管理流程", preview: "graph TD\n  A[撰写文章] --> B[保存草稿]", code: `graph TD\n  A[撰写文章] --> B[保存草稿]\n  B --> C[预览效果]\n  C --> D{满意?}\n  D -->|是| E[提交审核]\n  D -->|否| A\n  E --> F{审核通过?}\n  F -->|是| G[发布上线]\n  F -->|否| A` },

  // ===== 企业管理 (4) =====
  { id: "tpl-hr-er", title: "HR 人力资源系统 ER 图", category: "企业管理", description: "员工、部门、考勤、薪资的模块设计", preview: "DEPARTMENT ||--o{ EMPLOYEE : has\nEMPLOYEE ||--o{ ATTENDANCE : records", code: `erDiagram\n  DEPARTMENT { string id PK; string name }\n  EMPLOYEE { string id PK; string name; string deptId FK; string position }\n  ATTENDANCE { string id PK; string empId FK; date checkDate; string status }\n  SALARY { string id PK; string empId FK; float amount; string period }\n  DEPARTMENT ||--o{ EMPLOYEE : staffs\n  EMPLOYEE ||--o{ ATTENDANCE : clocks\n  EMPLOYEE ||--o{ SALARY : paid` },
  { id: "tpl-crm-er", title: "CRM 客户管理系统 ER 图", category: "企业管理", description: "客户、商机、跟进记录的设计", preview: "CUSTOMER ||--o{ OPPORTUNITY : generates\nUSER ||--o{ FOLLOW_UP : conducts", code: `erDiagram\n  CUSTOMER { string id PK; string name; string industry; string level }\n  OPPORTUNITY { string id PK; string customerId FK; string stage; float amount }\n  FOLLOW_UP { string id PK; string customerId FK; string userId FK; string content }\n  USER { string id PK; string name; string role }\n  CUSTOMER ||--o{ OPPORTUNITY : has\n  CUSTOMER ||--o{ FOLLOW_UP : tracked_by\n  USER ||--o{ FOLLOW_UP : performs` },
  { id: "tpl-project-er", title: "项目管理系统 ER 图", category: "企业管理", description: "项目、任务、分配、进度的设计", preview: "PROJECT ||--o{ TASK : contains\nUSER ||--o{ TASK : assigned", code: `erDiagram\n  PROJECT { string id PK; string name; date startDate; date endDate; string status }\n  TASK { string id PK; string projectId FK; string assigneeId FK; string title; string status; int priority }\n  USER { string id PK; string name; string role }\n  PROJECT ||--o{ TASK : has\n  USER ||--o{ TASK : works_on` },
  { id: "tpl-approval-flow", title: "审批流程图", category: "企业管理", description: "从提交到审批通过的通用审批流程", preview: "graph TD\n  A[提交申请] --> B{金额>1000?}", code: `graph TD\n  A[提交申请] --> B{金额>1000?}\n  B -->|是| C[部门经理审批]\n  B -->|否| D[直接审批]\n  C --> E{审批通过?}\n  D --> E\n  E -->|是| F[执行]\n  E -->|否| G[退回修改]\n  G --> A` },

  // ===== SaaS (4) =====
  { id: "tpl-saas-multitenant", title: "SaaS 多租户 ER 图", category: "SaaS", description: "租户隔离、订阅管理、功能权限设计", preview: "TENANT ||--o{ USER : has\nTENANT ||--o{ SUBSCRIPTION : owns", code: `erDiagram\n  TENANT { string id PK; string name; string plan; string status }\n  USER { string id PK; string tenantId FK; string email; string role }\n  SUBSCRIPTION { string id PK; string tenantId FK; string plan; date expireAt }\n  FEATURE { string id PK; string name; string tier }\n  TENANT ||--o{ USER : members\n  TENANT ||--o{ SUBSCRIPTION : subscribes\n  TENANT ||--o{ FEATURE : accesses` },
  { id: "tpl-rbac-er", title: "RBAC 权限模型 ER 图", category: "SaaS", description: "角色-权限-用户的经典权限模型设计", preview: "USER ||--o{ USER_ROLE : has\nROLE ||--o{ ROLE_PERMISSION : grants", code: `erDiagram\n  USER { string id PK; string name }\n  ROLE { string id PK; string name; string desc }\n  PERMISSION { string id PK; string resource; string action }\n  USER_ROLE { string userId FK; string roleId FK }\n  ROLE_PERMISSION { string roleId FK; string permissionId FK }\n  USER ||--o{ USER_ROLE : assigned\n  ROLE ||--o{ USER_ROLE : binds\n  ROLE ||--o{ ROLE_PERMISSION : includes\n  PERMISSION ||--o{ ROLE_PERMISSION : granted` },
  { id: "tpl-api-gateway-flow", title: "API 网关流程图", category: "SaaS", description: "请求路由、认证、限流的网关流程", preview: "graph TD\n  A[客户端请求] --> B[API Gateway]", code: `graph TD\n  A[客户端请求] --> B[API Gateway]\n  B --> C{认证检查}\n  C -->|通过| D[限流检查]\n  C -->|失败| E[返回 401]\n  D -->|通过| F[路由到服务]\n  D -->|超限| G[返回 429]\n  F --> H[返回响应]` },
  { id: "tpl-microservice-er", title: "微服务架构 ER 图", category: "SaaS", description: "服务注册、配置中心、链路追踪设计", preview: "SERVICE ||--o{ INSTANCE : runs\nSERVICE ||--o{ CONFIG : has", code: `erDiagram\n  SERVICE { string id PK; string name; string version }\n  INSTANCE { string id PK; string serviceId FK; string host; int port }\n  CONFIG { string id PK; string serviceId FK; string key; string value }\n  API_ROUTE { string id PK; string method; string path; string serviceId FK }\n  SERVICE ||--o{ INSTANCE : deployed\n  SERVICE ||--o{ CONFIG : configured\n  SERVICE ||--o{ API_ROUTE : exposes` },
];
