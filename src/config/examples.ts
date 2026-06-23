// ==========================================
// 图表示例库 — 每种类型一行示例
// ==========================================

import type { DiagramType } from "@/types/diagram";

export const EXAMPLES: Record<DiagramType, string> = {
  er: "学生管理系统：学生、课程、教师、成绩、院系",
  dfd: "在线考试系统：考生提交答案→系统评分→返回成绩",
  usecase: "图书馆管理系统：读者借书、还书、查询、续借",
  class: "电商订单系统：Order类关联User和Product，状态枚举",
  state: "订单状态流转：待支付→已支付→已发货→已完成",
  flowchart: "用户注册→验证邮箱→填写资料→注册成功",
  sequence: "用户登录→服务器验证→数据库查询→返回Token",
  function: "学生管理系统：教务管理/学籍管理/成绩管理/选课管理/毕业管理",
  architecture: "博客平台：CDN→Next.js前端→NestJS后端→Redis缓存→PostgreSQL",
  microservice: "外卖平台：Gateway→订单服务/用户服务/商品服务→MQ→MySQL",
  gantt: "毕业设计：选题2周→需求分析3周→系统设计2周→开发8周→测试3周→论文4周",
  mindmap: "软件工程课程：需求分析/系统设计/编码实现/测试/部署维护",
};
