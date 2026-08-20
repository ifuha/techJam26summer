"use client";

import type { CraftSummary } from "@/lib/type";

export type CraftPreviewProps = {
  craft: CraftSummary;
  onSelect: () => void;
};

export function CraftPreview({ craft, onSelect }: CraftPreviewProps) {
  const location = [craft.prefecture, craft.address].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      onClick={onSelect}
      key={craft.craftId}
      className="absolute top-4 left-4 flex items-center gap-3 bg-[#FAF9F6] rounded-sm shadow-lg p-3 text-left animate-card-content"
    >
      <div className="min-w-0">
        <div className="text-[20px] font-bold text-[#000000]">
          {craft.productName}
        </div>
        {location && (
          <div className="text-[12px] text-[#000000]">{location}</div>
        )}
      </div>
      <div className="w-20 h-16 rounded-sm bg-gray-200 shrink-0 overflow-hidden">
        {craft.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={craft.image}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </button>
  );
}
