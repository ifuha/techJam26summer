"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { Support, UserPublic } from "@/lib/type";
import { getSupportsByCreator, getUser } from "@/lib/api";
import { formatCount, getPlanIcon } from "@/lib/utils/format";

const Plans = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const [user, setUser] = useState<UserPublic | null>(null);
  const [supports, setSupports] = useState<Support[]>([]);
  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(
    null,
  );

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

  const handleProceed = () => {
    if (!selectedSupportId) return;
    router.push(`/details/${userId}/checkout?supportId=${selectedSupportId}`);
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
                    selected
                      ? "border-[#5E7231] border-2"
                      : "border-2 border-[#BBBBBB]"
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
                      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        selected ? "border-[#5E7231]" : "border-gray-300"
                      }`}
                    >
                      {selected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#5E7231]" />
                      )}
                    </div>
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
          onClick={handleProceed}
          disabled={!selectedSupportId}
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
