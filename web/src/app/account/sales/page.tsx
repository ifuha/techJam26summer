"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { CreatorSupporter } from "@/lib/type";
import { getMySupporters, getUserAccount } from "@/lib/api";
import { formatCount, getPlanIcon } from "@/lib/utils/format";
import { getUserId } from "@/lib/utils/access-token";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 bg-[#C9DAA5]/25">
      <div className="text-[11px] text-[#5E7231]">{label}</div>
      <div className="mt-1 text-[18px] font-bold text-[#000000]">{value}</div>
    </div>
  );
}

const Sales = () => {
  const router = useRouter();
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

    getMySupporters()
      .then(setSupporters)
      .catch((error) => console.error("Failed to load supporters:", error));
  }, []);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyTotal = supporters.reduce((sum, s) => sum + s.amount, 0);
  const thisMonthTotal = supporters
    .filter((s) => new Date(s.createAt) >= monthStart)
    .reduce((sum, s) => sum + s.amount, 0);
  const thisMonthCount = supporters.filter(
    (s) => new Date(s.createAt) >= monthStart,
  ).length;

  const planBreakdown = supporters.reduce<
    Record<string, { count: number; amount: number }>
  >((acc, s) => {
    const current = acc[s.supportName] ?? { count: 0, amount: 0 };
    acc[s.supportName] = {
      count: current.count + 1,
      amount: current.amount + s.amount,
    };
    return acc;
  }, {});

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75 pb-8">
        <div className="text-[20px] font-bold text-[#000000]">売り上げ</div>
        <div className="text-[12px] text-gray-500">
          応援プランからの月間売上です。
        </div>

        <div className="mt-3.25 rounded-lg bg-[#5E7231] p-4 text-white">
          <div className="text-[12px] opacity-80">月間売上(合計)</div>
          <div className="mt-1 text-[28px] font-bold">
            ¥{formatCount(monthlyTotal)}
          </div>
        </div>

        <div className="mt-2.75 grid grid-cols-2 gap-2">
          <StatCard
            label="今月の新規売上"
            value={`¥${formatCount(thisMonthTotal)}`}
          />
          <StatCard
            label="今月の新規応援"
            value={`${formatCount(thisMonthCount)}人`}
          />
        </div>

        {Object.keys(planBreakdown).length > 0 && (
          <div className="mt-4.25">
            <div className="text-[15px] font-bold text-[#000000]">
              プラン別の売上
            </div>
            <div className="mt-2 rounded-lg border overflow-hidden divide-y">
              {Object.entries(planBreakdown).map(([name, data]) => (
                <div key={name} className="flex items-center gap-2 px-3 py-2.75">
                  <div className="text-[#5E7231]">
                    <Icon name={getPlanIcon(name)} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#000000]">{name}</div>
                    <div className="text-[11px] text-gray-500">
                      {formatCount(data.count)}人
                    </div>
                  </div>
                  <div className="text-[13px] font-bold text-[#000000]">
                    ¥{formatCount(data.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {supporters.length === 0 && (
          <div className="mt-8 text-center text-[13px] text-gray-500">
            まだ応援がありません。
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
