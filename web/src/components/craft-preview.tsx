"use client";

import Link from "next/link";
import type { CraftSummary } from "@/lib/type";

export type CraftPreviewProps = {
  craft: CraftSummary;
};

export function CraftPreview({ craft }: CraftPreviewProps) {
  const location = [craft.prefecture, craft.address].filter(Boolean).join(" ");

  return (
    <Link
      key={craft.craftId}
      href={`/areaDetails?craftId=${craft.craftId}`}
      className="absolute top-4 left-4 flex items-center gap-3 bg-[#FAF9F6] rounded-sm shadow-lg p-3 text-left animate-card-content cursor-pointer"
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
    </Link>
  );
}
