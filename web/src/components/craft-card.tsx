"use client";

import { useEffect, useState } from "react";
import { BottomSheet } from "./bottom-sheet";
import type { CraftDetail, CraftSummary } from "@/lib/type";
import { getCraft } from "@/lib/api";

export type CraftCardProps = {
  craft: CraftSummary;
};

export function CraftCard({ craft }: CraftCardProps) {
  const [detail, setDetail] = useState<CraftDetail | null>(null);

  useEffect(() => {
    setDetail(null);
    getCraft(craft.craftId)
      .then(setDetail)
      .catch((error) => console.error("Failed to load craft detail:", error));
  }, [craft.craftId]);

  const location = [craft.prefecture, craft.address].filter(Boolean).join(" ");

  return (
    <BottomSheet
      resetKey={craft.craftId}
      header={
        <div key={craft.craftId} className="flex items-baseline gap-2 animate-card-content">
          <div className="text-[20px] font-bold text-[#000000]">
            {craft.productName}
          </div>
          {location && (
            <div className="text-[12px] text-[#000000]">{location}</div>
          )}
        </div>
      }
    >
      <div key={craft.craftId} className="animate-card-content">
        <div className="mt-3.25 w-full h-45 rounded-sm bg-gray-200 overflow-hidden">
          {craft.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={craft.image}
              alt={craft.productName}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {detail?.description && (
          <p className="mt-3.25 text-[13px] text-[#000000]">
            {detail.description}
          </p>
        )}

        <p className="mt-3.25 text-[13px] text-[#000000]">
          後継者が{detail ? detail.successorCount : "-"}人います
        </p>

        <div className="pb-12" />
      </div>
    </BottomSheet>
  );
}
