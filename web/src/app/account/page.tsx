"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import type { CreatorSubscriptionStats, Post, UserAccount } from "@/lib/type";
import {
  getCreatorStats,
  getFollowerCount,
  getPosts,
  getUserAccount,
} from "@/lib/api";
import { formatCount } from "@/lib/utils/format";
import { getUserId } from "@/lib/utils/access-token";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 bg-[#C9DAA5]/25">
      <div className="text-[11px] text-[#5E7231]">{label}</div>
      <div className="mt-1 text-[18px] font-bold text-[#000000]">{value}</div>
    </div>
  );
}

const Account = () => {
  const router = useRouter();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<CreatorSubscriptionStats | null>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    getUserAccount(userId)
      .then((result) => {
        if (!result.jobOrCommonMan) {
          router.replace("/");
          return;
        }
        setAccount(result);
      })
      .catch((error) => console.error("Failed to load account:", error));

    getFollowerCount(userId)
      .then((result) => setFollowerCount(result.count))
      .catch((error) => console.error("Failed to load follower count:", error));

    getPosts()
      .then((allPosts) => setPosts(allPosts.filter((p) => p.userId === userId)))
      .catch((error) => console.error("Failed to load posts:", error));

    getCreatorStats()
      .then(setStats)
      .catch((error) => console.error("Failed to load creator stats:", error));
  }, []);

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75">
        <div className="flex items-center gap-3.25">
          <div className="w-17.5 h-17.5 rounded-full bg-gray-300 shrink-0 overflow-hidden">
            {account?.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={account.avatar}
                alt={account.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="text-[16px] text-[#000000]">
            こんにちは、{account?.name ?? "..."}さん
          </div>
        </div>

        <div className="mt-3.25 grid grid-cols-3 gap-2">
          <StatCard
            label="応援者数"
            value={`${formatCount(stats?.subscriberCount ?? 0)}人`}
          />
          <StatCard
            label="今月の応援"
            value={`${formatCount(stats?.thisMonthCount ?? 0)}人`}
          />
          <StatCard
            label="活動記録数"
            value={`${formatCount(posts.length)}件`}
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <StatCard
            label="お気に入り数"
            value={`${formatCount(followerCount ?? 0)}人`}
          />
        </div>

        <div className="pb-25" />
      </div>

      <div className="w-full fixed bottom-0 h-21.75 flex justify-center items-start py-3.25 bg-white px-4 shadow-[0px_0px_5px_5px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={() => router.push("/account/post")}
          className="bg-[#5E7231] text-white py-2.25 h-10 flex items-center justify-center font-bold w-full rounded-sm"
        >
          活動を投稿する
        </button>
      </div>
    </div>
  );
};

export default Account;
