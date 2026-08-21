"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { Post, UserPublic } from "@/lib/type";
import { getPost, getUser } from "@/lib/api";
import { formatDate } from "@/lib/utils/format";

const PostDetail = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [creator, setCreator] = useState<UserPublic | null>(null);

  useEffect(() => {
    if (!params.id) return;
    getPost(params.id)
      .then((result) => {
        setPost(result);
        return getUser(result.userId);
      })
      .then(setCreator)
      .catch((error) => console.error("Failed to load post:", error));
  }, [params.id]);

  if (!post) {
    return (
      <div className="w-screen min-h-dvh bg-[#FAF9F6]">
        <Head />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75 pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[15px] font-bold text-[#000000] cursor-pointer"
        >
          <span className="text-black rotate-180">
            <Icon name="chevron-right" size={10} />
          </span>
          活動記録
        </button>

        {creator && (
          <Link
            href={`/details/${creator.userId}`}
            className="mt-3.25 flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0 overflow-hidden">
              {creator.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="text-[14px] font-bold text-[#000000]">
              {creator.name}
            </div>
          </Link>
        )}

        {post.isLocked ? (
          <div className="mt-4.25 flex flex-col items-center gap-2 py-12 text-gray-500">
            <Icon name="lock" size={24} />
            <div className="text-[13px]">
              応援すると閲覧できる活動記録です。
            </div>
          </div>
        ) : (
          <>
            {post.media.length > 0 && (
              <div className="mt-3.25 grid grid-cols-2 gap-2">
                {post.media.map((media) => (
                  <div
                    key={media.postMediaId}
                    className="w-full aspect-video rounded-sm overflow-hidden bg-gray-100"
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
            )}

            <div className="mt-3.25 text-[18px] font-bold text-[#000000]">
              {post.title}
            </div>
            <div className="mt-1.5 text-[14px] text-[#000000] whitespace-pre-wrap leading-relaxed">
              {post.reportMassege}
            </div>

            <div className="mt-3.25 flex items-center justify-between text-[12px] text-gray-500">
              <div className="flex items-center gap-1">
                <div className="text-[#F43939]">
                  <Icon name="heart" size={13} />
                </div>
                {post.likeCount}
              </div>
              <div>{formatDate(post.createAt)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
