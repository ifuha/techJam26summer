"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { Post, Support, UserPublic } from "@/lib/type";
import {
  follow,
  getFollowerCount,
  getFollowStatus,
  getPosts,
  getSupportsByCreator,
  getUser,
  subscribe,
  unfollow,
} from "@/lib/api";
import {
  formatCategoryLocation,
  formatCount,
  formatDuration,
  getPlanIcon,
} from "@/lib/utils/format";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: "graduation-cap" | "calendar" | "document" | "clock";
  label: string;
  value: string;
}) {
  return (
    <div className="flex-1 rounded-lg border p-3 bg-[#C9DAA5]/25">
      <div className="flex flex-col items-center gap-1.5 text-[#5E7231]">
        <Icon name={icon} size={31} />
        <span className="text-[11px]">{label}</span>
        <div className="mt-1 text-[15px] font-bold text-[#000000]">{value}</div>
      </div>
    </div>
  );
}

const Detail = () => {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const [user, setUser] = useState<UserPublic | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [supports, setSupports] = useState<Support[]>([]);
  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(
    null,
  );
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [subscribing, setSubscribing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setUser(null);
    setFollowerCount(null);
    setPosts([]);
    setSupports([]);
    setSelectedSupportId(null);

    getUser(userId)
      .then(setUser)
      .catch((error) => console.error("Failed to load user:", error));

    getFollowerCount(userId)
      .then((result) => setFollowerCount(result.count))
      .catch((error) => console.error("Failed to load follower count:", error));

    getPosts()
      .then((allPosts) =>
        setPosts(allPosts.filter((post) => post.userId === userId)),
      )
      .catch((error) => console.error("Failed to load posts:", error));

    getSupportsByCreator(userId)
      .then((result) => {
        setSupports(result);
        setSelectedSupportId(result[0]?.supportId ?? null);
      })
      .catch((error) => console.error("Failed to load supports:", error));

    getFollowStatus(userId)
      .then((result) => setIsFollowing(result.isFollowing))
      .catch((error) => console.error("Failed to load follow status:", error));
  }, [userId]);

  const handleSubscribe = () => {
    if (!selectedSupportId) return;
    setSubscribing(true);
    subscribe({ supportId: selectedSupportId })
      .catch((error) => console.error("Failed to subscribe:", error))
      .finally(() => setSubscribing(false));
  };

  const handleToggleFollow = () => {
    if (!userId) return;
    setFollowBusy(true);
    const action = isFollowing ? unfollow(userId) : follow(userId);
    action
      .then(() => setIsFollowing((prev) => !prev))
      .catch((error) => console.error("Failed to toggle follow:", error))
      .finally(() => setFollowBusy(false));
  };

  if (!user) {
    return (
      <div className="w-screen min-h-dvh bg-[#FAF9F6]">
        <Head />
      </div>
    );
  }

  const subtitle = formatCategoryLocation(
    user.tags[0] ?? user.productName ?? "",
    user.prefecture ?? "",
    user.address ?? "",
  );

  const publicMedia = posts
    .filter((post) => post.supportId === null)
    .flatMap((post) => post.media)
    .slice(0, 4);

  const latestPost = posts[0];
  const daysSinceLatestPost = latestPost
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(latestPost.createAt).getTime()) / 86400000,
        ),
      )
    : null;

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <div className="fixed z-10 top-0 w-full">
        <Head />
      </div>
      <span className="h-13.5 block" />
      <div className="relative">
        {publicMedia.length > 0 ? (
          <div
            onScroll={(event) => {
              const el = event.currentTarget;
              setActiveMediaIndex(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="w-full md:aspect-2/1 aspect-5/4 flex gap-0.5 overflow-x-auto snap-x snap-mandatory scrollbar-none"
          >
            {publicMedia.map((media) => (
              <div
                key={media.postMediaId}
                className="w-full h-full shrink-0 snap-center bg-gray-200 overflow-hidden"
              >
                {media.type === "Movie" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={media.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={media.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full aspect-5/2 bg-gray-200 overflow-hidden">
            {user.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        <div className="absolute bottom-2.75 right-4 flex items-center bg-white gap-1.5 px-3 py-1 rounded-full shadow-xl text-[12px] text-[#000000]">
          <div className="text-[#F43939] pt-1">
            <Icon name="heart" size={16} />
          </div>
          <div className="text-black">
            {formatCount(followerCount ?? 0)}人が応援中
          </div>
        </div>
      </div>

      {publicMedia.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2.75">
          {publicMedia.map((media, index) => (
            <span
              key={media.postMediaId}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: index === activeMediaIndex ? "#A8B28F" : "#A9A9A9",
              }}
            />
          ))}
        </div>
      )}

      <div className="px-4 pt-2.75">
        <div className="flex items-center justify-between">
          {user.tags[0] && (
            <div className="w-fit px-2 py-0.5 rounded-2xl border text-[10px] text-[#000000]">
              {user.tags[0]}
            </div>
          )}
          <button
            type="button"
            onClick={handleToggleFollow}
            disabled={followBusy}
            className={`ml-auto cursor-pointer disabled:opacity-50 ${isFollowing ? "text-[#F43939]" : "text-[#000000]"}`}
          >
            <Icon name="bookmark" size={22} />
          </button>
        </div>
        <div className="mt-1.5 text-[24px] font-bold text-[#000000]">
          {user.name}
        </div>
        <div className="text-[12px] text-gray-500">{subtitle}</div>

        {user.bio && (
          <p className="mt-2.75 text-[13px] text-[#000000] leading-relaxed">
            {user.bio}
          </p>
        )}

        <div className="mt-3.25 grid grid-cols-2 gap-2.5">
          <StatCard
            icon="graduation-cap"
            label="活動歴"
            value={formatDuration(user.createAt)}
          />
          <StatCard
            icon="calendar"
            label="活動開始"
            value={`${new Date(user.createAt).getFullYear()}年`}
          />
          <StatCard
            icon="document"
            label="活動投稿数"
            value={`${posts.length}件`}
          />
          <StatCard
            icon="clock"
            label="最終更新"
            value={
              daysSinceLatestPost === null
                ? "投稿なし"
                : daysSinceLatestPost === 0
                  ? "今日"
                  : `${daysSinceLatestPost}日前`
            }
          />
        </div>

        {posts.length > 0 && (
          <div className="mt-4.25">
            <div className="text-[15px] font-bold text-[#000000]">
              直近の活動記録
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none">
              {posts.map((post) => (
                <div
                  key={post.postId}
                  className="relative w-28 shrink-0 aspect-3/4 rounded-sm bg-gray-800 overflow-hidden"
                >
                  {post.media[0] &&
                    (post.media[0].type === "Movie" ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video
                        src={post.media[0].url}
                        muted
                        playsInline
                        className={`w-full h-full object-cover ${
                          post.isLocked ? "opacity-50" : ""
                        }`}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.media[0].url}
                        alt=""
                        className={`w-full h-full object-cover ${
                          post.isLocked ? "opacity-50" : ""
                        }`}
                      />
                    ))}
                  {!post.isLocked && post.media[0]?.type === "Movie" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-[#C9DAA5]/15 text-[#5E7231] flex items-center justify-center pl-0.5">
                        ▶
                      </div>
                    </div>
                  )}
                  {!post.isLocked && post.media.length > 1 && (
                    <div className="absolute top-1 right-1 rounded-full bg-[#C9DAA5]/15 text-[#5E7231] text-[10px] px-1.5 py-0.5">
                      +{post.media.length - 1}
                    </div>
                  )}
                  {post.isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <Icon name="lock" size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {posts.some((post) => post.isLocked) && (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
                <Icon name="lock" size={11} />
                応援するとすべての活動記録を閲覧できます。
              </div>
            )}
          </div>
        )}

        {supports.length > 0 && (
          <div className="mt-4.25">
            <div className="text-[15px] font-bold text-[#000000]">
              応援プラン
            </div>
            <div className="text-[12px] text-gray-500">
              応援は継承者の活動の支えになります。
            </div>

            <div className="mt-2.75 flex flex-col gap-2.75">
              {supports.map((support) => {
                const selected = support.supportId === selectedSupportId;
                return (
                  <button
                    key={support.supportId}
                    type="button"
                    onClick={() => setSelectedSupportId(support.supportId)}
                    className={`rounded-lg border p-3.25 text-left cursor-pointer ${
                      selected ? "border-[#A6B28B] border-2" : "border-2"
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

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={!selectedSupportId || subscribing}
              className="mt-3.25 w-full py-3 rounded-full bg-[#EE8978] text-[#FFFFFF] text-[14px] disabled:opacity-50"
            >
              このプランで応援する
            </button>
          </div>
        )}
        <div className="pb-24" />
      </div>
      <div className="w-full fixed bottom-0 h-21.75 flex justify-center items-start py-3.25 bg-white px-4 shadow-[0px_0px_5px_5px_rgba(0,0,0,0.25)]">
        <Link
          href={`/details/${userId}/plans`}
          className="bg-[#EE8978] text-white py-2.25 h-10 flex items-center justify-center font-bold w-full rounded-sm cursor-pointer"
        >
          応援する
        </Link>
      </div>
    </div>
  );
};

export default Detail;
