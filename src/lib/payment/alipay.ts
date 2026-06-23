// ==========================================
// 支付宝当面付（F2F）
// 文档：https://opendocs.alipay.com/open/194/105072
//
// 前置条件：
//   1. 支付宝商家账号 + 应用 AppID
//   2. 应用私钥 + 支付宝公钥（RSA2）
//   3. 签约当面付产品
//
// 环境变量：
//   ALIPAY_APP_ID        应用 ID
//   ALIPAY_PRIVATE_KEY   应用私钥（PEM 格式）
//   ALIPAY_PUBLIC_KEY    支付宝公钥（PEM 格式）
//   ALIPAY_NOTIFY_URL    回调地址（可选，也可从请求参数传入）
// ==========================================

import type { PaymentProvider, CreateOrderParams, CreateOrderResult, VerifyResult } from "../payment";
import crypto from "crypto";

export function createAlipayF2FProvider(): PaymentProvider {
  return {
    name: "alipay",

    async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
      const appId = process.env.ALIPAY_APP_ID;
      const privateKey = (process.env.ALIPAY_PRIVATE_KEY || "").replace(/\\n/g, "\n");

      if (!appId || !privateKey) {
        throw new Error("支付宝未完整配置，请设置 ALIPAY_* 环境变量");
      }

      const bizContent = {
        out_trade_no: params.tradeNo,
        total_amount: params.amount.toFixed(2),
        subject: params.description.slice(0, 256),
      };

      const baseParams: Record<string, string> = {
        app_id: appId,
        method: "alipay.trade.precreate",
        charset: "utf-8",
        sign_type: "RSA2",
        timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "").replace(/T/, " ").replace(/-/g, "-"),
        version: "1.0",
        notify_url: params.notifyUrl,
        biz_content: JSON.stringify(bizContent),
      };

      // 生成签名
      const sign = generateAlipaySign(baseParams, privateKey);
      baseParams.sign = sign;

      // 构建表单请求
      const formBody = new URLSearchParams(baseParams).toString();

      const response = await fetch("https://openapi.alipay.com/gateway.do", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: formBody,
      });

      const responseText = await response.text();

      // 解析支付宝 JSON 响应（在 form 响应体中）
      const respData = JSON.parse(
        responseText.replace(/.*?"alipay_trade_precreate_response"\s*:\s*/, "")
          .replace(/\}\s*$/, "}")
          .replace(/,"sign":".*"/, "")
      );

      if (respData.code !== "10000") {
        throw new Error(
          `支付宝下单失败: ${respData.sub_msg || respData.msg || "未知错误"}`
        );
      }

      return {
        providerTradeNo: respData.out_trade_no || params.tradeNo,
        qrCodeUrl: respData.qr_code,
      };
    },

    async verifyCallback(
      body: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _headers: Record<string, string>
    ): Promise<VerifyResult> {
      const publicKey = (process.env.ALIPAY_PUBLIC_KEY || "").replace(/\\n/g, "\n");

      // 支付宝回调为 x-www-form-urlencoded
      const params: Record<string, string> = {};
      if (typeof body === "string") {
        const searchParams = new URLSearchParams(body);
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
      } else if (typeof body === "object" && body !== null) {
        Object.assign(params, body as Record<string, string>);
      }

      // 验签
      const receivedSign = params.sign || "";
      const signParams: Record<string, string> = {};
      for (const [key, value] of Object.entries(params)) {
        if (key !== "sign" && key !== "sign_type" && value !== undefined && value !== "") {
          signParams[key] = value;
        }
      }

      const verify = crypto.createVerify("RSA-SHA256");
      const signStr = Object.keys(signParams)
        .sort()
        .map((k) => `${k}=${signParams[k]}`)
        .join("&");
      verify.update(signStr);

      const isValid = verify.verify(publicKey, receivedSign, "base64");

      if (!isValid) {
        return {
          verified: false,
          tradeNo: "",
          transactionId: "",
          amount: 0,
          paidAt: new Date(),
        };
      }

      // 支付宝当面付回调字段
      const tradeStatus = params.trade_status || "";
      if (tradeStatus !== "TRADE_SUCCESS") {
        return {
          verified: false,
          tradeNo: "",
          transactionId: "",
          amount: 0,
          paidAt: new Date(),
        };
      }

      return {
        verified: true,
        tradeNo: params.out_trade_no || "",
        transactionId: params.trade_no || "",
        amount: parseFloat(params.total_amount || "0"),
        paidAt: params.gmt_payment
          ? new Date(params.gmt_payment)
          : new Date(),
      };
    },

    getSuccessResponse() {
      return { code: "success", message: "" };
    },
  };
}

/** 生成支付宝 RSA2 签名 */
function generateAlipaySign(
  params: Record<string, string>,
  privateKey: string
): string {
  const signStr = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "" && k !== "sign")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const sign = crypto
    .createSign("RSA-SHA256")
    .update(signStr)
    .sign(privateKey, "base64");

  return sign;
}
