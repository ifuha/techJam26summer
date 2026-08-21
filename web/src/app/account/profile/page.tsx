"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import type { UserAccount } from "@/lib/type";
import { getUserAccount, patchUser, uploadImage } from "@/lib/api";
import { getUserId } from "@/lib/utils/access-token";
import { PREFECTURES } from "@/lib/utils/prefectures";

const ProfileEdit = () => {
  const router = useRouter();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    getUserAccount(userId)
      .then((result) => {
        setAccount(result);
        setName(result.name);
        setAvatar(result.avatar);
        setProductName(result.productName ?? "");
        setPrefecture(result.prefecture ?? "");
        setAddress(result.address ?? "");
        setBio(result.bio ?? "");
      })
      .catch((error) => console.error("Failed to load account:", error));
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    uploadImage(file)
      .then((result) => setAvatar(result.url))
      .catch((error) => console.error("Failed to upload avatar:", error))
      .finally(() => setUploading(false));
  };

  const handleSave = () => {
    setSaving(true);
    patchUser({
      name,
      avatar,
      address: address || null,
      prefecture: prefecture || null,
      productName: account?.jobOrCommonMan ? productName || null : undefined,
      bio: bio || null,
    })
      .then(() => router.back())
      .catch((error) => console.error("Failed to save profile:", error))
      .finally(() => setSaving(false));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />

      <div className="px-4 pt-2.75 pb-25">
        <div className="text-[17px] font-bold text-[#000000]">
          プロフィールを編集
        </div>

        <label className="mt-3.25 flex flex-col items-center gap-2 w-fit mx-auto">
          <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-[12px] text-[#5E7231]">
            {uploading ? "アップロード中..." : "画像を変更"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>

        <div className="mt-4.25 flex flex-col gap-3.25">
          <div>
            <div className="text-[13px] font-bold text-[#000000]">名前</div>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>

          {account?.jobOrCommonMan && (
            <div>
              <div className="text-[13px] font-bold text-[#000000]">
                伝統工芸品名
              </div>
              <input
                type="text"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="例: 美濃焼"
                className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
              />
            </div>
          )}

          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              都道府県
            </div>
            <select
              value={prefecture}
              onChange={(event) => setPrefecture(event.target.value)}
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            >
              <option value="">選択されていません</option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-[13px] font-bold text-[#000000]">住所</div>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="住所(市区町村など)"
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>

          <div>
            <div className="text-[13px] font-bold text-[#000000]">
              自己紹介・活動内容
            </div>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              placeholder="自己紹介・活動内容を入力してください。"
              className="mt-1 w-full border rounded-sm p-2 text-[14px] text-black"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploading}
          className="mt-4.25 w-full py-3 rounded-full bg-[#5E7231] text-white text-[14px] font-bold disabled:opacity-50"
        >
          保存する
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
