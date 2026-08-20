"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { Support, UserPublic } from "@/lib/type";
import { getSupportsByCreator, getUser, subscribe } from "@/lib/api";
import { formatCount, getPlanIcon } from "@/lib/utils/format";

const Plans = () => {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const [user, setUser] = useState<UserPublic | null>(null);
  const [supports, setSupports] = useState<Support[]>([]);
  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(
    null,
  );
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setUser(null);
    setSupports([]);
    setSelectedSupportId(null);

    getUser(userId)
      .then(setUser)
      .catch((error) => console.error("Failed to load user:", error));

    getSupportsByCreator(userId)
      .then((result) => {
        setSupports(result);
        setSelectedSupportId(result[0]?.supportId ?? null);
      })
      .catch((error) => console.error("Failed to load supports:", error));
  }, [userId]);

  const handleSubscribe = () => {
    if (!selectedSupportId) return;
    setSubscribing(true);
    subscribe({ supportId: selectedSupportId })
      .catch((error) => console.error("Failed to subscribe:", error))
      .finally(() => setSubscribing(false));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75">
        <div className="text-[20px] font-bold text-[#000000]">
          {user ? `${user.name}を応援する` : "応援プラン"}
        </div>
        <div className="text-[12px] text-gray-500">
          応援は継承者の活動の支えになります。
        </div>

        {supports.length > 0 && (
          <div className="mt-2.75 flex flex-col gap-2.75">
            {supports.map((support) => {
              const selected = support.supportId === selectedSupportId;
              return (
                <button
                  key={support.supportId}
                  type="button"
                  onClick={() => setSelectedSupportId(support.supportId)}
                  className={`rounded-lg border p-3.25 text-left ${
                    selected ? "border-[#5E7231] border-2" : "border-2"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name={getPlanIcon(support.name)} size={60} />
                      <div className="text-[15px] font-bold text-[#000000]">
                        {support.name}
                      </div>
                      <div className="text-[12px] text-[#000000]">
                        月額{formatCount(support.amount)}円
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                        selected
                          ? "border-[#5E7231] bg-[#5E7231]"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {support.benefits.length > 0 && (
                    <ul className="mt-1.5">
                      {support.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="text-[12px] text-[#000000]"
                        >
                          ・{benefit}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={!selectedSupportId || subscribing}
          className="mt-3.25 w-full py-3 rounded-full bg-[#EE8978] text-[#FFFFFF] text-[14px] disabled:opacity-50"
        >
          このプランで応援する
        </button>

        <div className="pb-12" />
      </div>
    </div>
  );
};

export default Plans;
