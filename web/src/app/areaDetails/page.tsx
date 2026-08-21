"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { CraftDetail } from "@/lib/type";
import {
  addCraftFavorite,
  getCraft,
  getCraftFavoriteStatus,
  removeCraftFavorite,
} from "@/lib/api";

function AreaDetailsContent() {
  const searchParams = useSearchParams();
  const craftId = searchParams.get("craftId");
  const [detail, setDetail] = useState<CraftDetail | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  useEffect(() => {
    if (!craftId) return;
    setDetail(null);
    setIsFavorited(false);
    getCraft(craftId)
      .then(setDetail)
      .catch((error) => console.error("Failed to load area detail:", error));

    getCraftFavoriteStatus(craftId)
      .then((result) => setIsFavorited(result.isFavorited))
      .catch((error) => console.error("Failed to load favorite status:", error));
  }, [craftId]);

  const handleToggleFavorite = () => {
    if (!craftId) return;
    setFavoriteBusy(true);
    const action = isFavorited
      ? removeCraftFavorite(craftId)
      : addCraftFavorite(craftId);
    action
      .then(() => setIsFavorited((prev) => !prev))
      .catch((error) => console.error("Failed to toggle favorite:", error))
      .finally(() => setFavoriteBusy(false));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <div className="fixed z-10 top-0 w-full">
        <Head />
      </div>
      <span className="h-13.5 block" />
      {detail && (
        <div>
          <div className="w-full aspect-5/2 bg-gray-200 overflow-hidden">
            {detail.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={detail.image}
                alt={detail.productName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="px-4 py-3.25">
            <div className="flex items-baseline gap-2">
              <div className="text-[24px] font-bold text-[#000000]">
                {detail.productName}
              </div>
              {detail.reading && (
                <div className="text-[13px] text-[#000000]">
                  （{detail.reading}）
                </div>
              )}
              <button
                type="button"
                onClick={handleToggleFavorite}
                disabled={favoriteBusy}
                className={`ml-auto cursor-pointer disabled:opacity-50 ${
                  isFavorited ? "text-[#F43939]" : "text-[#000000]"
                }`}
              >
                <Icon name="bookmark" size={22} />
              </button>
            </div>
            {(detail.category || detail.certification) && (
              <div className="flex flex-wrap gap-2 mt-2.75">
                {detail.category && (
                  <div className="px-3 py-1 rounded-2xl border text-[12px] text-[#5E7231]">
                    {detail.category}
                  </div>
                )}
                {detail.certification && (
                  <div className="px-3 py-1 rounded-2xl border text-[12px] text-[#5E7231]">
                    {detail.certification}
                  </div>
                )}
              </div>
            )}
            {detail.description && (
              <div className="mt-3.25 text-[13px] text-[#000000] leading-relaxed">
                {detail.description}
              </div>
            )}
            {detail.features.length > 0 && (
              <div className="mt-4.25">
                <div className="text-[15px] font-bold text-[#000000]">特徴</div>
                <ul className="mt-1.5">
                  {detail.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-[13px] text-[#000000] mt-1"
                    >
                      ・{feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {detail.productionAreas.length > 0 && (
              <div className="mt-4.25">
                <div className="text-[15px] font-bold text-[#000000]">
                  主な生産地
                </div>
                <div className="mt-1.5 text-[13px] text-[#000000]">
                  {detail.productionAreas.join("　")}
                </div>
              </div>
            )}

            {detail.successors.length > 0 && (
              <div className="mt-4.25">
                <div className="text-[15px] font-bold text-[#000000]">
                  この工芸品を受け継ぐ工芸者
                </div>
                <div className="mt-1.5 flex flex-col">
                  {detail.successors.map((successor) => {
                    const subtitle = [successor.address, successor.tags[0]]
                      .filter(Boolean)
                      .join("｜");
                    return (
                      <Link
                        key={successor.userId}
                        href={`/details/${successor.userId}`}
                        className="flex items-center gap-3.25 border-t py-3.25"
                      >
                        <div className="w-13 h-13 rounded-full bg-gray-400 shrink-0 overflow-hidden">
                          {successor.avatar && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={successor.avatar}
                              alt={successor.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-[16px] font-bold text-[#000000]">
                            {successor.name}
                          </div>
                          {subtitle && (
                            <div className="text-[11px] text-[#000000]">
                              {subtitle}
                            </div>
                          )}
                        </div>
                        <div className="text-black">
                          <Icon name="chevron-right" size={12} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <span className="h-25 block" />
    </div>
  );
}

const AreaDetail = () => {
  return (
    <Suspense fallback={null}>
      <AreaDetailsContent />
    </Suspense>
  );
};

export default AreaDetail;
