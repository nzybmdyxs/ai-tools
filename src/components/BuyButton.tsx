"use client";

// ==========================================
// 购买按钮 — 处理支付流程
// 1. 检查登录状态 → 未登录跳转登录页
// 2. 调用 /api/pay/create 创建订单
// 3. 显示二维码（微信/支付宝扫码支付）
// 4. 轮询订单状态
// ==========================================

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BuyButtonProps {
  productId: string;
  label?: string;
  className?: string;
}

export default function BuyButton({
  productId,
  label = "立即购买",
  className = "",
}: BuyButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [orderInfo, setOrderInfo] = useState<{
    tradeNo: string;
    amount: number;
    productName: string;
    mode: string;
    message?: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    setError("");

    // 检查登录
    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "创建订单失败");
      }

      setOrderInfo({
        tradeNo: data.tradeNo,
        amount: data.amount,
        productName: data.productName,
        mode: data.mode || "live",
        message: data.message,
      });

      if (data.qrCodeUrl) {
        setQrCodeUrl(data.qrCodeUrl);
      }

      setShowModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "支付服务暂不可用");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setQrCodeUrl("");
    setOrderInfo(null);
  };

  return (
    <>
      <button
        onClick={handleBuy}
        disabled={loading}
        className={className || "px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"}
      >
        {loading ? "处理中..." : label}
      </button>

      {error && (
        <p className="text-red-500 text-xs mt-2">{error}</p>
      )}

      {/* 支付弹窗 */}
      {showModal && orderInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">💳 扫码支付</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* 订单信息 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">商品</span>
                <span className="text-gray-800 font-medium">{orderInfo.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">金额</span>
                <span className="text-red-600 font-bold text-lg">¥{orderInfo.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">订单号</span>
                <span className="text-gray-400 text-xs font-mono">{orderInfo.tradeNo}</span>
              </div>
            </div>

            {/* 二维码 */}
            {qrCodeUrl ? (
              <div className="text-center space-y-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4 inline-block">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                    alt="支付二维码"
                    width={200}
                    height={200}
                    className="mx-auto"
                    unoptimized
                  />
                </div>
                <p className="text-sm text-gray-500">
                  请使用微信/支付宝扫描二维码完成支付
                </p>
                <p className="text-xs text-gray-400">
                  支付完成后请刷新页面查看权益
                </p>
              </div>
            ) : orderInfo.mode === "mock" ? (
              <div className="text-center space-y-3 p-4 bg-yellow-50 rounded-xl">
                <p className="text-2xl">🧪</p>
                <p className="text-sm text-yellow-700 font-medium">开发模式</p>
                <p className="text-xs text-yellow-600">
                  {orderInfo.message || "支付渠道未配置"}
                </p>
                <p className="text-xs text-yellow-500">
                  生产环境配置微信/支付宝即可正常支付
                </p>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p>正在生成支付二维码...</p>
              </div>
            )}

            <button
              onClick={closeModal}
              className="mt-4 w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  );
}
