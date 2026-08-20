"use client";

import { useEffect, useState } from "react";
import { BottomSheet } from "./bottom-sheet";
import { Icon } from "./icons/icon";
import type { CraftDetail, CraftSummary, UserPublic } from "@/lib/type";
import { getCraft } from "@/lib/api";

export type CraftCardProps = {
  craft: CraftSummary;
  onSelectUser?: (user: UserPublic) => void;
};

function SuccessorRow({
  user,
  onSelect,
}: {
  user: UserPublic;
  onSelect?: () => void;
}) {
  const subtitle = [user.productName, user.tags[0]].filter(Boolean);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-3.25 w-full border-t pt-3.25 mt-3.25 text-left"
    >
      <div className="w-17.5 h-17.5 rounded-full bg-gray-400 shrink-0" />
      <div className="flex-1">
        <div className="text-[20px] font-bold text-[#000000]">
          {user.name}
        </div>
        {subtitle.length > 0 && (
          <div className="text-[13px] text-[#000000]">
            {subtitle.join("｜")}
          </div>
        )}
      </div>
      <Icon name="chevron-right" size={12} />
    </button>
  );
}

export function CraftCard({ craft, onSelectUser }: CraftCardProps) {
  const [detail, setDetail] = useState<CraftDetail | null>(null);

  useEffect(() => {
    setDetail(null);
    getCraft(craft.craftId)
      .then(setDetail)
      .catch((error) => console.error("Failed to load craft detail:", error));
  }, [craft.craftId]);

  return (
    <BottomSheet
      resetKey={craft.craftId}
      header={
        <div key={craft.craftId} className="flex items-baseline gap-2 animate-card-content">
          {craft.address && (
            <div className="text-[24px] font-bold text-[#000000]">
              {craft.address}
            </div>
          )}
          {craft.prefecture && (
            <div className="text-[14px] text-[#000000]">
              {craft.prefecture}
            </div>
          )}
        </div>
      }
    >
      <div key={craft.craftId} className="animate-card-content">
        <p className="mt-3.25 text-[13px] text-[#000000]">
          この地域には後継者が{detail ? detail.successorCount : "-"}人います
        </p>

        {detail?.successors.map((successor) => (
          <SuccessorRow
            key={successor.userId}
            user={successor}
            onSelect={() => onSelectUser?.(successor)}
          />
        ))}

        <div className="pb-12" />
      </div>
    </BottomSheet>
  );
}
