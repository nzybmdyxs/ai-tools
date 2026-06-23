// ==========================================
// 支付创建接口
// POST /api/pay/create
//
// 支持微信支付 Native + 支付宝当面付
// 未配置支付渠道时返回订单数据（开发模式）
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pricing } from "@/lib/pricing";
import {
  getPaymentProvider,
  isPaymentConfigured,
  generateTradeNo,
} from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "请选择商品" }, { status: 400 });
    }

    // 查找商品配置
    let productName = "";
    let amount = 0;
    let orderType = "CREDITS";
    let credits = 0;
    let description = "";

    // 次数包
    for (const pkg of pricing.credits) {
      if (pkg.id === productId) {
        productName = pkg.name;
        amount = pkg.price;
        orderType = "CREDITS";
        credits = pkg.credits;
        description = pkg.name;
        break;
      }
    }

    // Pro 会员
    if (!productName) {
      if (productId === pricing.pro.monthly.id) {
        productName = pricing.pro.monthly.name;
        amount = pricing.pro.monthly.price;
        orderType = "MONTHLY";
        credits = 0;
        description = "Pro 月费会员";
      } else if (productId === pricing.pro.yearly.id) {
        productName = pricing.pro.yearly.name;
        amount = pricing.pro.yearly.price;
        orderType = "YEARLY";
        credits = 0;
        description = "Pro 年费会员";
      }
    }

    if (!productName) {
      return NextResponse.json({ error: "无效的商品" }, { status: 400 });
    }

    // 生成商户订单号
    const tradeNo = generateTradeNo("AIT");

    // 创建订单记录
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        amount,
        type: orderType,
        status: "PENDING",
        tradeNo,
        productId,
        credits: credits > 0 ? credits : null,
      },
    });

    // 检查支付渠道是否已配置
    const provider = getPaymentProvider();
    const configured = isPaymentConfigured();

    if (!provider || !configured) {
      // 开发模式：返回订单信息，提示支付渠道未配置
      return NextResponse.json({
        success: true,
        orderId: order.id,
        tradeNo,
        amount,
        productName,
        mode: "mock",
        message: "支付渠道未配置（开发模式）：订单已创建，请在生产环境配置支付",
        mock: {
          payUrl: `/api/pay/notify?mock=1&tradeNo=${tradeNo}`,
        },
      });
    }

    // 调用支付渠道
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const notifyUrl = `${baseUrl}/api/pay/notify`;

    try {
      const result = await provider.createOrder({
        orderId: order.id,
        tradeNo,
        amount,
        description,
        notifyUrl,
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        tradeNo,
        amount,
        productName,
        qrCodeUrl: result.qrCodeUrl,
        payUrl: result.payUrl,
        provider: provider.name,
      });
    } catch (payError) {
      // 支付渠道调用失败，但订单已创建
      console.error("支付渠道调用失败:", payError);
      return NextResponse.json(
        {
          success: false,
          orderId: order.id,
          tradeNo,
          error:
            payError instanceof Error ? payError.message : "支付渠道暂不可用",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("支付创建失败:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
