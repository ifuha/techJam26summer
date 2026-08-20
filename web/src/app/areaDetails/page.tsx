"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Head } from "@/components/head";
import type { CraftDetail } from "@/lib/type";
import { getCraft } from "@/lib/api";

function AreaDetailsContent() {
  const searchParams = useSearchParams();
  const craftId = searchParams.get("craftId");
  const [detail, setDetail] = useState<CraftDetail | null>(null);

  useEffect(() => {
    if (!craftId) return;
    setDetail(null);
    getCraft(craftId)
      .then(setDetail)
      .catch((error) => console.error("Failed to load area detail:", error));
  }, [craftId]);

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />
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
          </div>
        </div>
      )}
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
