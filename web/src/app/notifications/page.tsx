"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons/icon";
import type { Post } from "@/lib/type";
import { getMySubscriptions, getPosts } from "@/lib/api";
import { getUserId } from "@/lib/utils/access-token";

type Tab = "すべて" | "未読";

type NotificationItem = {
  post: Post;
  creatorName: string;
  creatorAvatar: string | null;
  isUnread: boolean;
};

const LAST_CHECKED_KEY = "notifications:lastCheckedAt";

const Notifications = () => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("すべて");
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const lastCheckedAt = localStorage.getItem(LAST_CHECKED_KEY);

    Promise.all([getMySubscriptions(), getPosts()])
      .then(([subscriptions, posts]) => {
        const creators = new Map<
          string,
          { name: string; avatar: string | null }
        >();
        subscriptions.forEach((s) =>
          creators.set(s.creatorUserId, {
            name: s.creatorName,
            avatar: s.creatorAvatar,
          }),
        );

        const notifications = posts
          .filter((post) => post.userId !== userId && creators.has(post.userId))
          .sort(
            (a, b) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
          )
          .map((post) => {
            const creator = creators.get(post.userId)!;
            return {
              post,
              creatorName: creator.name,
              creatorAvatar: creator.avatar,
              isUnread:
                !lastCheckedAt ||
                new Date(post.createAt) > new Date(lastCheckedAt),
            };
          });

        setItems(notifications);
        localStorage.setItem(LAST_CHECKED_KEY, new Date().toISOString());
      })
      .catch((error) => console.error("Failed to load notifications:", error));
  }, []);

  const visible = useMemo(
    () => (tab === "未読" ? items.filter((item) => item.isUnread) : items),
    [items, tab],
  );

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <div className="px-4">
        <div className="flex items-center gap-2 pt-2.75 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer text-black rotate-180"
          >
            <Icon name="chevron-right" size={14} />
          </button>
          <div className="flex-1 text-center text-[17px] font-bold text-[#000000] -ml-5">
            お知らせ
          </div>
        </div>
        <div className="flex gap-2.5">
          {(["すべて", "未読"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-5 py-2 rounded-full text-[13px] cursor-pointer ${
                tab === t
                  ? "bg-[#9CA86B] text-white font-bold"
                  : "border border-gray-300 text-[#000000]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-col">
          {visible.map((item) => (
            <Link
              key={item.post.postId}
              href={`/posts/${item.post.postId}`}
              className="relative flex items-center gap-3.25 border-t py-3.25"
            >
              <div className="w-16 h-16 rounded-lg bg-gray-300 shrink-0 overflow-hidden">
                {item.creatorAvatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.creatorAvatar}
                    alt={item.creatorName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <div
                  className={`text-[14px] ${
                    item.isUnread ? "font-bold text-[#000000]" : "text-gray-400"
                  }`}
                >
                  {item.creatorName}さんが活動記録を更新しました。
                </div>
                <div
                  className={`text-[13px] ${
                    item.isUnread ? "text-[#000000]" : "text-gray-400"
                  }`}
                >
                  {item.post.title}
                </div>
              </div>
              {item.isUnread && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F43939]" />
              )}
            </Link>
          ))}

          {visible.length === 0 && (
            <div className="mt-8 text-center text-[13px] text-gray-500">
              お知らせはありません。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
