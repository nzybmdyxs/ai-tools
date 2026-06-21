// ==========================================
// 支付创建接口（占位）
// POST /api/pay/create
//
// 后续对接微信支付 / 支付宝时，只需修改此文件：
//   1. 接收商品 ID + 用户 ID
//   2. 调用支付渠道 SDK 创建订单
//   3. 返回支付链接 / 二维码 / JSAPI 参数
//
// 当前返回模拟数据，方便前端调试流程
// ==========================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "请选择要购买的商品" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    // TODO: 对接真实支付渠道
    // 1. 根据 productId 查询 pricing 获取价格
    // 2. 在 Order 表创建订单记录
    // 3. 调用支付 SDK 获取支付参数/链接
    // 4. 返回给前端

    return NextResponse.json({
      success: true,
      message: "支付接口已预留，待接入微信支付/支付宝",
      mock: {
        orderId: `mock_${Date.now()}`,
        productId,
        userId,
        // 微信支付 Native: 返回 code_url
        // 微信支付 JSAPI: 返回 prepay_id + 签名参数
        // 支付宝当面付: 返回 qr_code
        // Stripe: 返回 client_secret
        payUrl: "https://example.com/mock-pay",
      },
    });
  } catch (error) {
    console.error("支付创建失败:", error);
    return NextResponse.json(
      { error: "支付服务暂不可用" },
      { status: 500 }
    );
  }
}
