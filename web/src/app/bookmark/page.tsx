"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { MyFollow } from "@/lib/type";
import { getMyFollows, unfollow } from "@/lib/api";
import { formatCategoryLocation } from "@/lib/utils/format";

const Bookmark = () => {
  const router = useRouter();
  const [follows, setFollows] = useState<MyFollow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);

  useEffect(() => {
    getMyFollows()
      .then(setFollows)
      .catch((error) => console.error("Failed to load follows:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleUnfollow = (item: MyFollow) => {
    setUnfollowingId(item.followId);
    unfollow(item.followedUserId)
      .then(() => {
        setFollows((prev) => prev.filter((f) => f.followId !== item.followId));
      })
      .catch((error) => console.error("Failed to unfollow:", error))
      .finally(() => setUnfollowingId(null));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75">
        <div className="text-[20px] font-bold text-[#000000]">
          お気に入りの継承者
        </div>

        {!loading && follows.length === 0 && (
          <p className="mt-4 text-[13px] text-gray-500">
            まだお気に入りに登録していません。
          </p>
        )}

        <div className="mt-2.75 flex flex-col gap-3.25">
          {follows.map((item) => {
            const subtitle = formatCategoryLocation(
              item.followedProductName ?? "",
              item.followedPrefecture ?? "",
              item.followedAddress ?? "",
            );
            return (
              <div key={item.followId} className="border-t pt-3.25">
                <Link
                  href={`/details/${item.followedUserId}`}
                  className="flex items-center gap-3.25"
                >
                  <div className="w-13 h-13 rounded-full bg-gray-400 shrink-0 overflow-hidden">
                    {item.followedAvatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.followedAvatar}
                        alt={item.followedName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[16px] font-bold text-[#000000]">
                      {item.followedName}
                    </div>
                    <div className="text-[11px] text-[#000000]">{subtitle}</div>
                  </div>
                  <div className="text-black">
                    <Icon name="chevron-right" size={12} />
                  </div>
                </Link>

                <div className="mt-2.75 flex gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(`/details/${item.followedUserId}`)}
                    className="flex-1 py-2 rounded-sm bg-[#EE8978] text-[#FFFFFF] text-[13px]"
                  >
                    応援する
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnfollow(item)}
                    disabled={unfollowingId === item.followId}
                    className="flex-1 py-2 rounded-sm border text-[#000000] text-[13px] disabled:opacity-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pb-12" />
      </div>
    </div>
  );
};

export default Bookmark;
