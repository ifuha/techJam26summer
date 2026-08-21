"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { CreatorSupporter } from "@/lib/type";
import { getMySupporters, getUserAccount, sendThanks } from "@/lib/api";
import { formatDate } from "@/lib/utils/format";
import { getUserId } from "@/lib/utils/access-token";

type SortTab = "すべて" | "新しい順" | "応援開始日順";

const SORT_TABS: SortTab[] = ["すべて", "新しい順", "応援開始日順"];
const PAGE_SIZE = 5;

const Supporters = () => {
  const router = useRouter();
  const [supporters, setSupporters] = useState<CreatorSupporter[]>([]);
  const [sortTab, setSortTab] = useState<SortTab>("すべて");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [thankingId, setThankingId] = useState<string | null>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    getUserAccount(userId)
      .then((account) => {
        if (!account.jobOrCommonMan) {
          router.replace("/");
        }
      })
      .catch((error) => console.error("Failed to load account:", error));

    getMySupporters()
      .then(setSupporters)
      .catch((error) => console.error("Failed to load supporters:", error));
  }, []);

  const sorted = [...supporters].sort(
    (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
  );
  const visible = sorted.slice(0, visibleCount);

  const handleThank = (subscriptionId: string) => {
    setThankingId(subscriptionId);
    sendThanks({ subscriptionId })
      .then(() => {
        setSupporters((prev) =>
          prev.map((s) =>
            s.subscriptionId === subscriptionId ? { ...s, isThanked: true } : s,
          ),
        );
      })
      .catch((error) => console.error("Failed to send thanks:", error))
      .finally(() => setThankingId(null));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75 pb-8">
        <div className="text-[17px] font-bold text-[#000000]">
          あなたを応援している人
        </div>

        <div className="mt-3.25 flex gap-2">
          {SORT_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSortTab(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] cursor-pointer ${
                sortTab === tab
                  ? "bg-[#5E7231] text-white font-bold"
                  : "text-[#000000]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-col">
          {visible.map((supporter) => {
            const thanked = supporter.isThanked;
            const thanking = thankingId === supporter.subscriptionId;
            return (
              <div
                key={supporter.subscriptionId}
                className="border-t py-3.25 flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-3.25">
                  <div className="w-13 h-13 rounded-full bg-gray-300 shrink-0 overflow-hidden">
                    {supporter.supporterAvatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={supporter.supporterAvatar}
                        alt={supporter.supporterName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[16px] font-bold text-[#000000]">
                      {supporter.supporterName}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {formatDate(supporter.createAt)} から応援
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={thanked || thanking}
                  onClick={() => handleThank(supporter.subscriptionId)}
                  className={`w-full py-2 rounded-sm border text-[13px] flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                    thanked
                      ? "border-[#F47A65] text-[#F47A65]"
                      : "bg-[#F47A65] text-white border-[#F47A65] cursor-pointer"
                  }`}
                >
                  <Icon name="heart" size={13} />
                  {thanked ? "感謝を伝えました!" : "感謝を伝える"}
                </button>
              </div>
            );
          })}

          {visible.length === 0 && (
            <div className="mt-8 text-center text-[13px] text-gray-500">
              まだ応援してくれている人がいません。
            </div>
          )}
        </div>

        {visibleCount < sorted.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="mt-3.25 w-full py-2.5 text-[13px] text-[#000000] cursor-pointer"
          >
            もっと読み込む
          </button>
        )}
      </div>
    </div>
  );
};

export default Supporters;
