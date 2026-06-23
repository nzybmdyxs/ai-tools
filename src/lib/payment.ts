// ==========================================
// 统一支付接口
// 支持微信支付 Native V3 + 支付宝当面付
// 通过环境变量 PAYMENT_PROVIDER 切换
// ==========================================

export interface CreateOrderParams {
  /** 内部订单号 */
  orderId: string;
  /** 商户订单号（tradeNo） */
  tradeNo: string;
  /** 金额（元） */
  amount: number;
  /** 商品描述 */
  description: string;
  /** 支付结果回调地址 */
  notifyUrl: string;
}

export interface CreateOrderResult {
  /** 渠道订单号 */
  providerTradeNo: string;
  /** 二维码链接（微信 Native / 支付宝当面付） */
  qrCodeUrl?: string;
  /** 支付跳转链接（通用） */
  payUrl?: string;
}

export interface VerifyResult {
  /** 验签是否通过 */
  verified: boolean;
  /** 商户订单号（tradeNo，对应内部订单） */
  tradeNo: string;
  /** 渠道交易号 */
  transactionId: string;
  /** 实付金额（元） */
  amount: number;
  /** 支付完成时间 */
  paidAt: Date;
}

export interface PaymentProvider {
  /** 渠道名称 */
  name: string;
  /** 创建订单（返回支付链接/二维码） */
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;
  /** 验证回调签名 + 解析数据 */
  verifyCallback(
    body: unknown,
    headers: Record<string, string>
  ): Promise<VerifyResult>;
  /** 返回渠道要求的成功应答 */
  getSuccessResponse(): { code: string; message: string };
}

/** 根据配置获取支付渠道 */
export function getPaymentProvider(type?: string): PaymentProvider | null {
  const provider = type || process.env.PAYMENT_PROVIDER || "";

  switch (provider) {
    case "wechat":
      return createWechatProvider();
    case "alipay":
      return createAlipayProvider();
    default:
      return null;
  }
}

/** 检查支付渠道是否已配置 */
export function isPaymentConfigured(provider?: string): boolean {
  const p = provider || process.env.PAYMENT_PROVIDER || "";

  switch (p) {
    case "wechat":
      return !!(
        process.env.WECHAT_PAY_MCHID &&
        process.env.WECHAT_PAY_API_V3_KEY &&
        process.env.WECHAT_PAY_PRIVATE_KEY
      );
    case "alipay":
      return !!(
        process.env.ALIPAY_APP_ID &&
        process.env.ALIPAY_PRIVATE_KEY &&
        process.env.ALIPAY_PUBLIC_KEY
      );
    default:
      return false;
  }
}

// ===== 工具函数 =====

/** 生成唯一商户订单号 */
export function generateTradeNo(prefix = "ORD"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

/** 金额元转分（微信支付用） */
export function yuanToFen(yuan: number): number {
  return Math.round(yuan * 100);
}

// ===== 延迟导入（避免未配置时加载模块） =====

import { createWechatNativeProvider } from "./payment/wechat";
import { createAlipayF2FProvider } from "./payment/alipay";

function createWechatProvider(): PaymentProvider {
  return createWechatNativeProvider();
}

function createAlipayProvider(): PaymentProvider {
  return createAlipayF2FProvider();
}
