"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { MySubscription } from "@/lib/type";
import { getMySubscriptions, unsubscribe } from "@/lib/api";
import { formatCategoryLocation } from "@/lib/utils/format";

const Supporting = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<MySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);

  useEffect(() => {
    getMySubscriptions()
      .then(setSubscriptions)
      .catch((error) => console.error("Failed to load subscriptions:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsubscribe = (subscription: MySubscription) => {
    setUnsubscribingId(subscription.subscriptionId);
    unsubscribe(subscription.supportId)
      .then(() => {
        setSubscriptions((prev) =>
          prev.filter((s) => s.subscriptionId !== subscription.subscriptionId),
        );
      })
      .catch((error) => console.error("Failed to unsubscribe:", error))
      .finally(() => setUnsubscribingId(null));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75">
        <div className="text-[20px] font-bold text-[#000000]">
          応援中の継承者
        </div>

        {!loading && subscriptions.length === 0 && (
          <p className="mt-4 text-[13px] text-gray-500">
            まだ誰も応援していません。
          </p>
        )}

        <div className="mt-2.75 flex flex-col gap-3.25">
          {subscriptions.map((subscription) => {
            const subtitle = formatCategoryLocation(
              subscription.creatorProductName ?? "",
              subscription.creatorPrefecture ?? "",
              subscription.creatorAddress ?? "",
            );
            return (
              <div key={subscription.subscriptionId} className="border-t pt-3.25">
                <Link
                  href={`/details/${subscription.creatorUserId}`}
                  className="flex items-center gap-3.25"
                >
                  <div className="w-13 h-13 rounded-full bg-gray-400 shrink-0 overflow-hidden">
                    {subscription.creatorAvatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={subscription.creatorAvatar}
                        alt={subscription.creatorName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[16px] font-bold text-[#000000]">
                      {subscription.creatorName}
                    </div>
                    <div className="text-[11px] text-[#000000]">{subtitle}</div>
                    <div className="text-[12px] font-bold text-[#000000]">
                      {subscription.supportName}
                    </div>
                  </div>
                  <div className="text-black">
                    <Icon name="chevron-right" size={12} />
                  </div>
                </Link>

                <div className="mt-2.75 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/details/${subscription.creatorUserId}/plans`)
                    }
                    className="flex-1 py-2 rounded-sm bg-[#EE8978] text-[#FFFFFF] text-[13px]"
                  >
                    プランを変更
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnsubscribe(subscription)}
                    disabled={unsubscribingId === subscription.subscriptionId}
                    className="flex-1 py-2 rounded-sm border text-[#000000] text-[13px] disabled:opacity-50"
                  >
                    応援をやめる
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pb-12" />
      </div>
    </div>
  );
};

export default Supporting;
