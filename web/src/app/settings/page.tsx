"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { UserAccount } from "@/lib/type";
import { deleteUser, getUserAccount } from "@/lib/api";
import { getUserId, removeToken } from "@/lib/utils/access-token";

function SettingsRow({
  label,
  danger,
  onClick,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3.25 text-[14px] cursor-pointer ${
        danger ? "text-[#F47A65]" : "text-[#000000]"
      }`}
    >
      {label}
      <div className={danger ? "text-[#F47A65]" : "text-black"}>
        <Icon name="chevron-right" size={10} />
      </div>
    </button>
  );
}

const Settings = () => {
  const router = useRouter();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    getUserAccount(userId)
      .then(setAccount)
      .catch((error) => console.error("Failed to load account:", error));
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  const handleDelete = () => {
    if (deleting) return;
    const confirmed = window.confirm(
      "本当にアカウントを削除しますか?この操作は取り消せません。",
    );
    if (!confirmed) return;

    setDeleting(true);
    deleteUser()
      .then(() => {
        removeToken();
        router.push("/");
      })
      .catch((error) => console.error("Failed to delete account:", error))
      .finally(() => setDeleting(false));
  };

  return (
    <div className="w-screen min-h-dvh bg-[#FAF9F6]">
      <Head />
      <div className="px-4 pt-2.75 pb-8">
        <div className="text-[20px] font-bold text-[#000000]">設定</div>
        <div className="mt-3.25 text-[13px] font-bold text-[#000000]">
          アカウント
        </div>
        <div className="mt-1.5 rounded-lg border border-[#BBBBBB] overflow-hidden divide-y divide-[#BBBBBB]">
          <SettingsRow
            label="プロフィール編集"
            onClick={() => router.push("/account/profile")}
          />
          <SettingsRow
            label="アカウント情報"
            onClick={() => router.push("/settings/account")}
          />
        </div>
        <div className="mt-4.25 text-[13px] font-bold text-[#000000]">
          その他
        </div>
        <div className="mt-1.5 rounded-lg border border-[#BBBBBB] overflow-hidden divide-y divide-[#BBBBBB]">
          <SettingsRow label="ログアウト" onClick={handleLogout} />
          <SettingsRow label="アカウント削除" danger onClick={handleDelete} />
        </div>
        {account && (
          <div className="mt-4.25 text-[11px] text-gray-400">
            {account.email}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
