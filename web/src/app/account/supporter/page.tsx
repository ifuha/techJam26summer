"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { CreatorSubscriptionStats, CreatorSupporter } from "@/lib/type";
import {
  getCreatorStats,
  getMySupporters,
  getUserAccount,
} from "@/lib/api";
import { formatCount, formatDate, getPlanIcon } from "@/lib/utils/format";
import { getUserId } from "@/lib/utils/access-token";

const SupporterSummary = () => {
  const router = useRouter();
  const [stats, setStats] = useState<CreatorSubscriptionStats | null>(null);
  const [supporters, setSupporters] = useState<CreatorSupporter[]>([]);

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

    getCreatorStats()
      .then(setStats)
      .catch((error) => console.error("Failed to load creator stats:", error));

    getMySupporters()
      .then(setSupporters)
      .catch((error) => console.error("Failed to load supporters:", error));
  }, []);

  const planCounts = supporters.reduce<Record<string, number>>((acc, s) => {
    acc[s.supportName] = (acc[s.supportName] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75 pb-8">
        <div className="text-[15px] font-bold text-[#000000]">
          あなたを応援している人
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-[28px] font-bold text-[#000000]">
            {formatCount(stats?.subscriberCount ?? 0)}人
          </div>
          <div className="text-[13px] text-[#5E7231]">
            今月 +{formatCount(stats?.thisMonthCount ?? 0)}人
          </div>
        </div>

        {supporters.length > 0 && (
          <div className="mt-4.25">
            <div className="text-[13px] font-bold text-[#000000]">
              直近の応援者
            </div>
            <div className="mt-2 flex flex-col">
              {supporters.slice(0, 3).map((supporter) => (
                <div
                  key={supporter.subscriptionId}
                  className="flex items-center gap-3.25 border-t py-3.25"
                >
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
              ))}
            </div>
            <Link
              href="/account/supporters"
              className="mt-2 flex items-center justify-center gap-3 w-full py-2.5 rounded-sm border-2 border-black text-[14px] text-[#000000] leading-none"
            >
              <span>もっとみる</span>
              <Icon name="chevron-right" size={12} />
            </Link>
          </div>
        )}

        {Object.keys(planCounts).length > 0 && (
          <div className="mt-4.25">
            <div className="text-[15px] font-bold text-[#000000]">
              プラン別の応援者数
            </div>
            <div className="mt-2 rounded-lg border overflow-hidden">
              {Object.entries(planCounts).map(([name, count], index) => (
                <div
                  key={name}
                  className={`flex items-center gap-2 px-3 py-2.75 ${
                    index > 0 ? "border-t" : ""
                  }`}
                >
                  <div className="text-[#5E7231]">
                    <Icon name={getPlanIcon(name)} size={18} />
                  </div>
                  <div className="flex-1 text-[13px] text-[#000000]">
                    {name}
                  </div>
                  <div className="text-[13px] font-bold text-[#000000]">
                    {formatCount(count)}人
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupporterSummary;
