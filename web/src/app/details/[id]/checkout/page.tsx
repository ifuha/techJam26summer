"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons/icon";
import type { Support, UserPublic } from "@/lib/type";
import { getSupportStatus, getUser, subscribe } from "@/lib/api";
import { formatCount, getPlanIcon } from "@/lib/utils/format";

function CheckoutContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const userId = params.id;
  const supportId = searchParams.get("supportId");

  const [creator, setCreator] = useState<UserPublic | null>(null);
  const [support, setSupport] = useState<Support | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getUser(userId)
      .then(setCreator)
      .catch((error) => console.error("Failed to load creator:", error));
  }, [userId]);

  useEffect(() => {
    if (!supportId) return;
    getSupportStatus(supportId)
      .then(setSupport)
      .catch((error) => console.error("Failed to load support:", error));
  }, [supportId]);

  const handlePay = () => {
    if (!supportId || submitting) return;
    setSubmitting(true);
    setError(null);
    subscribe({ supportId })
      .then(() => setDone(true))
      .catch((err) => {
        console.error("Failed to subscribe:", err);
        setError(err.message ?? "決済に失敗しました");
      })
      .finally(() => setSubmitting(false));
  };

  if (done) {
    return (
      <div className="w-screen min-h-dvh bg-[#FAF9F6]">
        <div className="px-4 pt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#5E7231] flex items-center justify-center text-white text-[28px]">
            ✓
          </div>
          <div className="mt-4.25 text-[18px] font-bold text-[#000000]">
            決済が完了しました
          </div>
          <div className="mt-1.5 text-[13px] text-gray-500">
            {creator?.name}さんの応援を開始しました。
          </div>
          <button
            type="button"
            onClick={() => router.push("/heart")}
            className="mt-6 w-full py-3 rounded-full bg-[#5E7231] text-white text-[14px] font-bold"
          >
            応援中の一覧を見る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-dvh bg-white">
      <div className="px-4 pt-2.75 pb-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[15px] font-bold text-[#000000] cursor-pointer"
        >
          <span className="inline-flex items-center text-black rotate-180">
            <Icon name="chevron-right" size={10} />
          </span>
          <span>お支払い</span>
        </button>

        <div className="mt-3.25 rounded-lg border p-3.25 flex items-center gap-3">
          {support && (
            <div className="text-[#5E7231]">
              <Icon name={getPlanIcon(support.name)} size={36} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-gray-500">
              {creator?.name}さんを応援
            </div>
            <div className="text-[15px] font-bold text-[#000000]">
              {support?.name ?? "プラン"}
            </div>
          </div>
          <div className="text-[16px] font-bold text-[#000000]">
            ¥{formatCount(support?.amount ?? 0)}
            <span className="text-[11px] font-normal text-gray-500">
              {support?.isMonthly ? " /月" : ""}
            </span>
          </div>
        </div>

        <div className="mt-4.25 text-[13px] font-bold text-[#000000]">
          カード情報
        </div>
        <div className="mt-1.5 rounded-lg border overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-3 border-b">
            <Icon name="lock" size={14} />
            <input
              type="text"
              placeholder="カード番号"
              defaultValue="4242 4242 4242 4242"
              readOnly
              className="flex-1 text-[14px] text-black outline-none"
            />
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="MM / YY"
              defaultValue="12 / 29"
              readOnly
              className="flex-1 px-3 py-3 border-r text-[14px] text-black outline-none"
            />
            <input
              type="text"
              placeholder="CVC"
              defaultValue="123"
              readOnly
              className="flex-1 px-3 py-3 text-[14px] text-black outline-none"
            />
          </div>
        </div>

        <div className="mt-2.75 text-[13px] font-bold text-[#000000]">
          カード名義人
        </div>
        <input
          type="text"
          placeholder="TARO YAMADA"
          defaultValue={creator ? "TEST USER" : ""}
          readOnly
          className="mt-1.5 w-full border rounded-lg p-3 text-[14px] text-black outline-none"
        />

        <div className="mt-3.25 text-[11px] text-gray-400 leading-relaxed">
          これはテスト環境です。実際の決済は行われず、カード情報も送信されません。「決済を完了する」を押すと応援登録のみ行われます。
        </div>

        {error && (
          <p className="mt-2.75 text-[13px] text-red-500">{error}</p>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={!support || submitting}
          className="mt-4.25 w-full py-3.25 rounded-full bg-[#5E7231] text-white text-[15px] font-bold disabled:opacity-50"
        >
          {submitting
            ? "処理中..."
            : `¥${formatCount(support?.amount ?? 0)} を決済して応援する`}
        </button>
      </div>
    </div>
  );
}

const Checkout = () => {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
};

export default Checkout;
