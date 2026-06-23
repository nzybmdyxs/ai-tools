# AI 工具集合站 — 更新日志

---

## V1.3 (2026-06-22)

### 🎨 UX 体验优化

#### 生成感知优化 (P0)
- 点击生成立即显示骨架屏 + 步骤进度条（分析需求→生成图表→校验语法）
- 按钮即时变灰显示"AI 正在生成..."
- 结果区脉冲指示器"生成中"
- Mermaid 预加载（useEffect import），首次渲染不再卡顿

### 🗂️ 图表类型扩展（12种）

#### 配置驱动架构
- DiagramType 6→12 种：新增 DFD、用例图、类图、状态图、技术架构图、微服务架构图、功能结构图
- `DIAGRAM_CONFIG` 配置中心：label/icon/mermaidType/category 统一管理
- `buildPrompt.ts` 12 种专用 Prompt，每种独立 builder 函数
- `DiagramTypeTabs` 分类网格布局，配置驱动
- 所有 typeLabels 动态生成，零硬编码

### ⚡ 架构重构
- `src/types/diagram.ts` — DiagramType/GenerationMode/ERNotation 类型
- `src/config/diagram-types.ts` — 统一图表配置中心（含分类分组）
- `src/config/build-prompt.ts` — Prompt 构造器（12种专用）
- `src/config/examples.ts` — 示例文本库
- 移除旧 `if(type===...)` 分支逻辑，全部配置驱动

---

## V1.2 (2026-06-22)

### 🔧 核心可用性升级

#### AI / SQL / Mermaid 三模式
- AI 生成：描述需求，AI 自动生成
- SQL 生成：粘贴 CREATE TABLE DDL，自动转 ER 图
- Mermaid 代码：直接编写，实时预览
- `GenerationModeTabs` 组件 + 每模式专属 placeholder

#### Mermaid 自动校验 + 修复
- `validateMermaid()` — 服务端 `mermaid.parse()` 语法校验
- `repairMermaid()` — AI 自动修复错误代码
- `fixAndValidate()` — 校验→修复循环（最多3次）
- 手动修复按钮 + `/api/repair-mermaid` 接口
- Mermaid 渲染失败率：10-20% → <1%

#### SQL → Mermaid 转换
- `node-sql-parser` 解析 CREATE TABLE 语句
- 自动识别主键、外键、表关系
- 生成 Mermaid erDiagram 代码

#### 数据库追踪
- Diagram 模型新增 `renderError` + `repaired` 字段

### 🔧 超级管理员 + 开发模式
- `DEV_BYPASS=true` 本地开发免登录、无限次数
- `SUPER_ADMIN_EMAIL` 生产环境超级权限
- Dashboard 超级管理员标识
- `src/lib/auth/admin.ts` + `current-user.ts` 统一鉴权

### ⚡ 生成速度优化
- 模型切换 `deepseek-v4-pro` → `deepseek-v4-flash`（3-5x 更快）
- Prompt 超精简（15-20 字英文关键词）
- 模板匹配优先（8组关键词，0.1秒命中）
- max_tokens 4096 → 2048

---

## V1.1 (2026-06-22)

### 🚀 新增功能
- 微信支付 Native V3 + 支付宝当面付接入
- 支付回调自动发放权益（次数/会员/邀请奖励）
- 邀请裂变系统：8 位码 + 注册+10 + 付费+50
- 模板库 7→30 个 + 博客 2→20 篇
- 图表分享页 `/tools/share/[id]`
- 游客 AI 生成 3 次免费
- Mermaid 在线编辑器（Monaco）

### 📊 V1.0→V1.1
| 指标 | V1.0 | V1.1 |
|------|------|------|
| 页面 | 33 | 36 |
| API | 9 | 12 |
| 模板 | 7 | 30 |
| 博客 | 2 | 20 |
| 代码 | ~6k | ~9.5k |

---

## V1.0 (2026-06-21)

### 初始版本
- AI 图表生成 6 种类型 + Mermaid SVG 渲染
- NextAuth 魔法链接登录 + 会员体系
- Dashboard 用户中心 + 历史记录 + 收藏
- 7 模板 + 2 博客 + Sitemap + SEO
- 33 页面 / 9 API / ~6,000 行代码
