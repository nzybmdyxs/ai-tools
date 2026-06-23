// ==========================================
// 微信支付 Native V3
// 文档：https://pay.weixin.qq.com/docs/merchant/apis/native-payment/
//
// 前置条件：
//   1. 微信商户号（MCHID）
//   2. APIv3 密钥（API_V3_KEY）
//   3. 商户 API 证书序列号 + 私钥（PEM 格式）
//   4. 在商户平台配置 Native 支付回调域名
//
// 环境变量：
//   WECHAT_PAY_MCHID      商户号
//   WECHAT_PAY_APPID      应用 AppID
//   WECHAT_PAY_API_V3_KEY APIv3 密钥（32位）
//   WECHAT_PAY_SERIAL_NO  证书序列号
//   WECHAT_PAY_PRIVATE_KEY 商户私钥（PEM 格式，\n 分隔）
// ==========================================

import type { PaymentProvider, CreateOrderParams, CreateOrderResult, VerifyResult } from "../payment";
import { yuanToFen } from "../payment";
import crypto from "crypto";

export function createWechatNativeProvider(): PaymentProvider {
  return {
    name: "wechat",

    async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
      const mchid = process.env.WECHAT_PAY_MCHID;
      const appid = process.env.WECHAT_PAY_APPID || "";
      const apiV3Key = process.env.WECHAT_PAY_API_V3_KEY;
      const serialNo = process.env.WECHAT_PAY_SERIAL_NO || "";
      const privateKey = (process.env.WECHAT_PAY_PRIVATE_KEY || "").replace(/\\n/g, "\n");

      if (!mchid || !apiV3Key || !serialNo || !privateKey) {
        throw new Error("微信支付未完整配置，请设置 WECHAT_PAY_* 环境变量");
      }

      const body = {
        appid,
        mchid,
        description: params.description.slice(0, 127),
        out_trade_no: params.tradeNo,
        notify_url: params.notifyUrl,
        amount: {
          total: yuanToFen(params.amount),
          currency: "CNY",
        },
      };

      const bodyStr = JSON.stringify(body);
      const url = "https://api.mch.weixin.qq.com/v3/pay/transactions/native";

      const { authorization } = signRequest(
        "POST",
        "/v3/pay/transactions/native",
        bodyStr,
        mchid,
        serialNo,
        privateKey
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
          Accept: "application/json",
        },
        body: bodyStr,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `微信支付下单失败: ${data.message || data.code || "未知错误"}`
        );
      }

      return {
        providerTradeNo: data.code_url || "",
        qrCodeUrl: data.code_url,
      };
    },

    async verifyCallback(
      body: unknown,
      headers: Record<string, string>
    ): Promise<VerifyResult> {
      const apiV3Key = process.env.WECHAT_PAY_API_V3_KEY || "";

      // 微信 V3 回调验证
      const timestamp = headers["wechatpay-timestamp"] || "";
      const nonce = headers["wechatpay-nonce"] || "";
      const signature = headers["wechatpay-signature"] || "";
      const bodyStr = typeof body === "string" ? body : JSON.stringify(body);

      // 验证签名
      const message = `${timestamp}\n${nonce}\n${bodyStr}\n`;
      const expectedSig = crypto
        .createHmac("sha256", apiV3Key)
        .update(message)
        .digest("base64");

      if (signature !== expectedSig) {
        return {
          verified: false,
          tradeNo: "",
          transactionId: "",
          amount: 0,
          paidAt: new Date(),
        };
      }

      // 解密回调数据（微信 V3 回调需要 AES-256-GCM 解密）
      const data = typeof body === "string" ? JSON.parse(body) : (body as Record<string, unknown>);
      const resource = (data.resource || {}) as Record<string, unknown>;

      let decrypted: Record<string, unknown> = {};
      if (resource.ciphertext) {
        try {
          const ciphertext = resource.ciphertext as string;
          const nonceStr = resource.nonce as string;
          const associatedData = resource.associated_data as string || "";

          const authTag = Buffer.from(ciphertext, "base64").slice(-16);
          const encryptedData = Buffer.from(ciphertext, "base64").slice(0, -16);

          const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            Buffer.from(apiV3Key),
            Buffer.from(nonceStr)
          );
          decipher.setAuthTag(authTag);
          decipher.setAAD(Buffer.from(associatedData));

          let decryptedStr = decipher.update(encryptedData, undefined, "utf8");
          decryptedStr += decipher.final("utf8");
          decrypted = JSON.parse(decryptedStr);
        } catch {
          return {
            verified: false,
            tradeNo: "",
            transactionId: "",
            amount: 0,
            paidAt: new Date(),
          };
        }
      }

      const tradeState = decrypted.trade_state as string;
      if (tradeState !== "SUCCESS") {
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
        tradeNo: (decrypted.out_trade_no as string) || "",
        transactionId: (decrypted.transaction_id as string) || "",
        amount: ((decrypted.amount as Record<string, number>)?.total || 0) / 100,
        paidAt: decrypted.success_time
          ? new Date(decrypted.success_time as string)
          : new Date(),
      };
    },

    getSuccessResponse() {
      return { code: "SUCCESS", message: "OK" };
    },
  };
}

/** 微信支付 V3 请求签名 */
function signRequest(
  method: string,
  path: string,
  body: string,
  mchid: string,
  serialNo: string,
  privateKey: string
): { authorization: string } {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const message = `${method}\n${path}\n${timestamp}\n${nonce}\n${body}\n`;

  const sign = crypto
    .createSign("RSA-SHA256")
    .update(message)
    .sign(privateKey, "base64");

  const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}",nonce_str="${nonce}",signature="${sign}",timestamp="${timestamp}",serial_no="${serialNo}"`;

  return { authorization };
}
