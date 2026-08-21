"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { MyCraftFavorite, MyFollow } from "@/lib/type";
import {
  getMyCraftFavorites,
  getMyFollows,
  removeCraftFavorite,
  unfollow,
} from "@/lib/api";
import { formatCategoryLocation, formatCount } from "@/lib/utils/format";

type Tab = "successor" | "craft";

function SuccessorTab() {
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

  if (!loading && follows.length === 0) {
    return (
      <p className="mt-4 text-[13px] text-gray-500">
        まだお気に入りに登録していません。
      </p>
    );
  }

  return (
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
  );
}

function CraftTab() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<MyCraftFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    getMyCraftFavorites()
      .then(setFavorites)
      .catch((error) => console.error("Failed to load craft favorites:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (item: MyCraftFavorite) => {
    setRemovingId(item.craftFavoriteId);
    removeCraftFavorite(item.craftId)
      .then(() => {
        setFavorites((prev) =>
          prev.filter((f) => f.craftFavoriteId !== item.craftFavoriteId),
        );
      })
      .catch((error) => console.error("Failed to remove craft favorite:", error))
      .finally(() => setRemovingId(null));
  };

  if (!loading && favorites.length === 0) {
    return (
      <p className="mt-4 text-[13px] text-gray-500">
        まだお気に入りに登録していません。
      </p>
    );
  }

  return (
    <div className="mt-2.75 flex flex-col gap-3.25">
      {favorites.map((item) => {
        const location = [item.craftPrefecture, item.craftAddress]
          .filter(Boolean)
          .join(" ");
        return (
          <div key={item.craftFavoriteId} className="border-t pt-3.25">
            <Link
              href={`/areaDetails?craftId=${item.craftId}`}
              className="flex items-center gap-3.25"
            >
              <div className="w-13 h-13 rounded-sm bg-gray-400 shrink-0 overflow-hidden">
                {item.craftImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.craftImage}
                    alt={item.craftProductName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="text-[16px] font-bold text-[#000000]">
                  {item.craftProductName}
                </div>
                <div className="text-[11px] text-[#000000]">{location}</div>
                <div className="text-[11px] text-[#000000]">
                  後継者{formatCount(item.successorCount)}人
                </div>
              </div>
              <div className="text-black">
                <Icon name="chevron-right" size={12} />
              </div>
            </Link>

            <div className="mt-2.75 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push(`/areaDetails?craftId=${item.craftId}`)
                }
                className="flex-1 py-2 rounded-sm bg-[#EE8978] text-[#FFFFFF] text-[13px]"
              >
                詳細を見る
              </button>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                disabled={removingId === item.craftFavoriteId}
                className="flex-1 py-2 rounded-sm border text-[#000000] text-[13px] disabled:opacity-50"
              >
                削除
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const Bookmark = () => {
  const [tab, setTab] = useState<Tab>("successor");

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75">
        <div className="text-[20px] font-bold text-[#000000]">お気に入り</div>

        <div className="mt-2.75 relative flex border-b">
          <button
            type="button"
            onClick={() => setTab("successor")}
            className={`flex-1 pb-2.75 text-[14px] font-bold transition-colors ${
              tab === "successor" ? "text-[#5E7231]" : "text-gray-400"
            }`}
          >
            後継者
          </button>
          <button
            type="button"
            onClick={() => setTab("craft")}
            className={`flex-1 pb-2.75 text-[14px] font-bold transition-colors ${
              tab === "craft" ? "text-[#5E7231]" : "text-gray-400"
            }`}
          >
            工芸品
          </button>
          <div
            className="absolute bottom-0 h-0.75 w-1/2 bg-[#5E7231] transition-transform duration-200 ease-out"
            style={{
              transform: tab === "craft" ? "translateX(100%)" : "translateX(0)",
            }}
          />
        </div>

        <div key={tab} className="animate-card-content">
          {tab === "successor" ? <SuccessorTab /> : <CraftTab />}
        </div>

        <div className="pb-12" />
      </div>
    </div>
  );
};

export default Bookmark;
