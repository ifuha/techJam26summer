"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Head } from "@/components/head";
import { Icon } from "@/components/icons/icon";
import type { UserAccount } from "@/lib/type";
import { getUserAccount } from "@/lib/api";
import { getUserId } from "@/lib/utils/access-token";
import { formatDate } from "@/lib/utils/format";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3.25">
      <div className="text-[12px] text-gray-500">{label}</div>
      <div className="mt-0.5 text-[14px] text-[#000000]">{value}</div>
    </div>
  );
}

const AccountInfo = () => {
  const router = useRouter();
  const [account, setAccount] = useState<UserAccount | null>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    getUserAccount(userId)
      .then(setAccount)
      .catch((error) => console.error("Failed to load account:", error));
  }, []);

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
          アカウント情報
        </button>

        <div className="mt-3.25 rounded-lg border overflow-hidden divide-y">
          <InfoRow label="名前" value={account?.name ?? "-"} />
          <InfoRow label="メールアドレス" value={account?.email ?? "-"} />
          <InfoRow
            label="アカウント種別"
            value={account?.jobOrCommonMan ? "継承者" : "一般ユーザー"}
          />
          <InfoRow
            label="登録日"
            value={account ? formatDate(account.createAt) : "-"}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
