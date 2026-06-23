// ==========================================
// 支付回调接口
// POST /api/pay/notify
//
// 统一处理微信支付 / 支付宝回调
// 核心流程：验签 → 查订单 → 标记已支付 → 发放权益
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 解析请求体
    let body: unknown;
    if (contentType.includes("json")) {
      body = await req.json();
    } else {
      body = await req.text();
    }

    // 开发模式：手动标记支付（用于测试）
    const url = new URL(req.url);
    const mockMode = url.searchParams.get("mock") === "1";
    const mockTradeNo = url.searchParams.get("tradeNo");

    if (mockMode && mockTradeNo) {
      await processPayment(mockTradeNo, "MOCK_TXN");
      return NextResponse.json({ code: "SUCCESS", message: "Mock payment processed" });
    }

    // 自动检测支付渠道
    const wechatSig = headers["wechatpay-signature"];
    const provider = getPaymentProvider(wechatSig ? "wechat" : "alipay");

    if (!provider) {
      console.warn("[支付回调] 未配置支付渠道，无法验证签名");
      return NextResponse.json(
        { code: "FAIL", message: "Payment provider not configured" },
        { status: 500 }
      );
    }

    // 验签
    const result = await provider.verifyCallback(body, headers);

    if (!result.verified) {
      console.warn("[支付回调] 签名验证失败");
      return NextResponse.json(
        { code: "FAIL", message: "Signature verification failed" },
        { status: 403 }
      );
    }

    // 处理支付结果
    await processPayment(result.tradeNo, result.transactionId, result.paidAt);

    // 返回渠道要求的成功应答
    return NextResponse.json(provider.getSuccessResponse());
  } catch (error) {
    console.error("[支付回调] 处理失败:", error);
    // 仍然返回成功，避免支付渠道重复回调
    return NextResponse.json({ code: "SUCCESS", message: "" });
  }
}

/**
 * 处理支付成功逻辑
 * 1. 更新订单状态
 * 2. 发放权益（次数 / 会员）
 * 3. 处理邀请奖励
 */
async function processPayment(
  tradeNo: string,
  transactionId: string,
  paidAt?: Date
) {
  // 查找订单
  const order = await prisma.order.findUnique({
    where: { tradeNo },
    include: {
      user: { select: { id: true, inviterId: true, plan: true, credits: true } },
    },
  });

  if (!order) {
    console.error(`[支付回调] 订单不存在: ${tradeNo}`);
    return;
  }

  // 幂等处理：已支付则跳过
  if (order.status === "PAID") {
    console.log(`[支付回调] 订单已支付，跳过: ${tradeNo}`);
    return;
  }

  const now = paidAt || new Date();

  // 计算会员到期时间
  let expireAt: Date | null = null;
  if (order.type === "MONTHLY") {
    expireAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  } else if (order.type === "YEARLY") {
    expireAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  }

  // 更新订单为已支付
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      paidAt: now,
      expireAt,
    },
  });

  // 发放权益
  if (order.type === "CREDITS" && order.credits) {
    // 次数包：增加 credits
    await prisma.user.update({
      where: { id: order.userId },
      data: { credits: { increment: order.credits } },
    });
    console.log(`[支付回调] 用户 ${order.userId} 获得 ${order.credits} 次 AI 生成`);
  } else if (order.type === "MONTHLY" || order.type === "YEARLY") {
    // 会员：升级为 PRO + 创建/更新订阅记录
    await prisma.user.update({
      where: { id: order.userId },
      data: { plan: "PRO" },
    });

    await prisma.subscription.upsert({
      where: { userId: order.userId },
      create: {
        userId: order.userId,
        plan: "PRO",
        status: "ACTIVE",
        expireAt,
      },
      update: {
        plan: "PRO",
        status: "ACTIVE",
        expireAt,
      },
    });

    console.log(`[支付回调] 用户 ${order.userId} 升级为 PRO，到期: ${expireAt}`);
  }

  // 邀请奖励：邀请人获得 +50 次
  if (order.user.inviterId) {
    await prisma.user.update({
      where: { id: order.user.inviterId },
      data: { credits: { increment: 50 } },
    });
    console.log(`[支付回调] 邀请人 ${order.user.inviterId} 获得 50 次奖励`);
  }
}
