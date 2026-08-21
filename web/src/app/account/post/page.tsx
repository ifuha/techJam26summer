"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { PostMediaInput, Support, Tag } from "@/lib/type";
import {
  createPost,
  createPostTag,
  getSupportsByCreator,
  getTags,
  getUserAccount,
  uploadImage,
  uploadMovie,
} from "@/lib/api";
import { getUserId } from "@/lib/utils/access-token";

type Step = "form" | "confirm";

const TITLE_MAX = 50;
const BODY_MAX = 1000;

const CreatePost = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [categoryTagId, setCategoryTagId] = useState("");
  const [supports, setSupports] = useState<Support[]>([]);
  const [supportId, setSupportId] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const mediaPreviews = useMemo(
    () => mediaFiles.map((file) => URL.createObjectURL(file)),
    [mediaFiles],
  );

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

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

    getTags()
      .then(setTags)
      .catch((error) => console.error("Failed to load tags:", error));
    getSupportsByCreator(userId)
      .then(setSupports)
      .catch((error) => console.error("Failed to load supports:", error));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const categoryName = tags.find((t) => t.tagId === categoryTagId)?.tagName;
  const visibilityLabel = supportId
    ? (supports.find((s) => s.supportId === supportId)?.name ?? "限定公開")
    : "全員に公開";

  const canProceed = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = () => {
    setSubmitting(true);

    const uploadMedia = (): Promise<PostMediaInput[] | undefined> => {
      if (mediaFiles.length === 0) return Promise.resolve(undefined);
      return Promise.all(
        mediaFiles.map((file) => {
          const isVideo = file.type.startsWith("video/");
          const upload = isVideo ? uploadMovie(file) : uploadImage(file);
          return upload.then(
            (result) =>
              ({ url: result.url, type: isVideo ? "Movie" : "Image" }) as PostMediaInput,
          );
        }),
      );
    };

    uploadMedia()
      .then((media) =>
        createPost({
          title,
          reportMassege: body,
          supportId,
          media,
        }),
      )
      .then((post) => {
        if (categoryTagId) {
          return createPostTag({ postId: post.postId, tagId: categoryTagId }).then(
            () => post,
          );
        }
        return post;
      })
      .then(() => router.push("/account"))
      .catch((error) => console.error("Failed to create post:", error))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75 pb-25">
        <button
          type="button"
          onClick={() => (step === "confirm" ? setStep("form") : router.back())}
          className="flex items-center gap-1 text-[15px] font-bold text-[#000000]"
        >
          {step === "confirm" && <Icon name="chevron-right" size={10} />}
          新しい活動記録
        </button>

        {step === "form" ? (
          <div className="mt-3.25 flex flex-col gap-3.25">
            <div>
              <div className="grid grid-cols-2 gap-2">
                {mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-video rounded-sm overflow-hidden bg-gray-100"
                  >
                    {file.type.startsWith("video/") ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video
                        src={mediaPreviews[index]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaPreviews[index]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[12px] flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <label className="block">
                  <div className="w-full aspect-video rounded-sm border-2 border-dashed border-[#5E7231] flex flex-col items-center justify-center gap-1 bg-[#C9DAA5]/15 text-[#5E7231]">
                    <Icon name="plus" size={28} />
                    <span className="text-[12px]">写真・動画を追加</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {mediaFiles.length > 0 && (
                <div className="mt-1 text-[11px] text-gray-500">
                  {mediaFiles.length}枚選択中
                </div>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-bold text-[#000000]">
                  タイトル
                </span>
                <span className="text-[11px] text-gray-500">
                  {title.length}/{TITLE_MAX}
                </span>
              </div>
              <input
                type="text"
                value={title}
                maxLength={TITLE_MAX}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="タイトルを入力してください。"
                className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-bold text-[#000000]">
                  本文
                </span>
                <span className="text-[11px] text-gray-500">
                  {body.length}/{BODY_MAX}
                </span>
              </div>
              <textarea
                value={body}
                maxLength={BODY_MAX}
                onChange={(event) => setBody(event.target.value)}
                placeholder="本文を入力してください。"
                rows={5}
                className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
              />
            </div>

            <div>
              <span className="text-[13px] font-bold text-[#000000]">
                カテゴリ
              </span>
              <select
                value={categoryTagId}
                onChange={(event) => setCategoryTagId(event.target.value)}
                className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
              >
                <option value="">選択されていません</option>
                {tags.map((tag) => (
                  <option key={tag.tagId} value={tag.tagId}>
                    {tag.tagName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-[13px] font-bold text-[#000000]">
                公開範囲
              </span>
              <select
                value={supportId ?? ""}
                onChange={(event) =>
                  setSupportId(event.target.value || null)
                }
                className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
              >
                <option value="">全員に公開</option>
                {supports.map((support) => (
                  <option key={support.supportId} value={support.supportId}>
                    {support.name}の応援者限定
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!canProceed}
              onClick={() => setStep("confirm")}
              className="mt-2 w-full py-3 rounded-full bg-[#EE8978] text-[#FFFFFF] text-[14px] disabled:opacity-50"
            >
              確認画面へ
            </button>
          </div>
        ) : (
          <div className="mt-3.25 flex flex-col gap-3.25">
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {mediaFiles.map((file, index) => (
                  <div
                    key={index}
                    className="w-full aspect-video rounded-sm overflow-hidden bg-gray-100"
                  >
                    {file.type.startsWith("video/") ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video
                        src={mediaPreviews[index]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaPreviews[index]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div>
              <div className="text-[13px] font-bold text-[#000000]">
                タイトル
              </div>
              <div className="mt-1 text-[14px] text-[#000000]">{title}</div>
            </div>

            <div>
              <div className="text-[13px] font-bold text-[#000000]">本文</div>
              <div className="mt-1 text-[14px] text-[#000000] whitespace-pre-wrap">
                {body}
              </div>
            </div>

            <div>
              <div className="text-[13px] font-bold text-[#000000]">
                カテゴリ
              </div>
              <div className="mt-1 text-[14px] text-[#000000]">
                {categoryName ?? "なし"}
              </div>
            </div>

            <div>
              <div className="text-[13px] font-bold text-[#000000]">
                公開範囲
              </div>
              <div className="mt-1 text-[14px] text-[#000000]">
                {visibilityLabel}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-2 w-full py-3 rounded-full bg-[#EE8978] text-[#FFFFFF] text-[14px] disabled:opacity-50"
            >
              投稿する
            </button>
            <button
              type="button"
              onClick={() => setStep("form")}
              disabled={submitting}
              className="w-full py-3 rounded-full border text-[#000000] text-[14px] disabled:opacity-50"
            >
              修正する
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
