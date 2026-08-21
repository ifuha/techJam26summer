"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { Post } from "@/lib/type";
import { getPosts, getUserAccount } from "@/lib/api";
import { formatDate } from "@/lib/utils/format";
import { getUserId } from "@/lib/utils/access-token";

const ALL = "すべて";

const WorksPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState(ALL);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    getUserAccount(userId)
      .then((account) => {
        if (!account.jobOrCommonMan) {
          router.replace("/");
        }
      })
      .catch((error) => console.error("Failed to load account:", error));

    getPosts()
      .then((allPosts) =>
        setPosts(
          allPosts
            .filter((post) => post.userId === userId)
            .sort(
              (a, b) =>
                new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
            ),
        ),
      )
      .catch((error) => console.error("Failed to load posts:", error));
  }, []);

  const categories = useMemo(() => {
    const names = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => names.add(tag)));
    return [ALL, ...Array.from(names)];
  }, [posts]);

  const filteredPosts =
    activeCategory === ALL
      ? posts
      : posts.filter((post) => post.tags.includes(activeCategory));

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75 pb-25">
        <div className="flex items-center justify-between">
          <div className="text-[17px] font-bold text-[#000000]">活動記録</div>
        </div>

        <div className="mt-3.25 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] cursor-pointer ${
                activeCategory === category
                  ? "bg-[#5E7231] text-white font-bold"
                  : "text-[#000000]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-3.25 flex flex-col gap-3.25">
          {filteredPosts.map((post) => (
            <div key={post.postId} className="flex gap-3">
              <div className="w-20 h-20 rounded-sm bg-gray-200 shrink-0 overflow-hidden">
                {post.media[0] &&
                  (post.media[0].type === "Movie" ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      src={post.media[0].url}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.media[0].url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ))}
              </div>
              <div className="min-w-0 flex-1">
                {post.tags[0] && (
                  <div className="w-fit px-2 py-0.5 rounded-2xl border text-[10px] text-[#000000]">
                    {post.tags[0]}
                  </div>
                )}
                <div className="mt-1 text-[13px] text-[#000000] line-clamp-2">
                  {post.reportMassege}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#F43939] text-[12px]">
                    <Icon name="heart" size={13} />
                    <span className="text-[#000000]">{post.likeCount}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {formatDate(post.createAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="mt-8 text-center text-[13px] text-gray-500">
              まだ活動記録がありません。
            </div>
          )}
        </div>
      </div>

      <div className="w-full fixed bottom-0 h-21.75 flex justify-center items-start py-3.25 bg-white px-4 shadow-[0px_0px_5px_5px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={() => router.push("/account/post")}
          className="bg-[#5E7231] text-white py-2.25 h-10 flex items-center justify-center font-bold w-full rounded-sm cursor-pointer"
        >
          活動を投稿する
        </button>
      </div>
    </div>
  );
};

export default WorksPage;
