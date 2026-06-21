// ==========================================
// 支付回调接口（占位）
// POST /api/pay/notify
//
// 支付渠道异步通知入口：
//   - 微信支付：接收 XML/JSON 回调
//   - 支付宝：接收 form 回调
//   - Stripe：接收 webhook 事件
//
// 此接口需要：
//   1. 验签（防止伪造回调）
//   2. 更新 Order 状态为 PAID
//   3. 发放 credits / 升级会员
//   4. 返回成功应答给支付渠道
//
// ⚠️ 此接口必须对外网可达（配置支付渠道回调 URL）
// ==========================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 微信支付 V3 回调为 JSON，V2 为 XML
    // 支付宝回调为 x-www-form-urlencoded
    let body: unknown;
    if (contentType.includes("json")) {
      body = await req.json();
    } else {
      body = await req.text();
    }

    console.log("[支付回调] 收到通知:", JSON.stringify(body).slice(0, 500));

    // TODO: 对接真实支付渠道
    // 1. 验签（从支付渠道 SDK 获取签名验证方法）
    // 2. 查询内部订单状态
    // 3. 更新订单为 PAID
    // 4. 发放权益（credits / Pro 会员）
    // 5. 返回渠道要求的成功应答格式

    return NextResponse.json({
      code: "SUCCESS",
      message: "支付回调接口已预留",
    });
  } catch (error) {
    console.error("支付回调处理失败:", error);
    return NextResponse.json(
      { code: "FAIL", message: "处理失败" },
      { status: 500 }
    );
  }
}
