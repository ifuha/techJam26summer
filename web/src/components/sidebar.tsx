"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconProps } from "./icons/icon";
import type { UserAccount } from "@/lib/type";
import { getUserAccount } from "@/lib/api";
import { getUserId, removeToken } from "@/lib/utils/access-token";
import { cn } from "@/lib/utils/cn";

export type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

type MenuItem = {
  label: string;
  icon: IconProps["name"];
  href: string;
  matchPath?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "ホーム", icon: "home", href: "/", matchPath: "/" },
  { label: "探す", icon: "search", href: "/search" },
  { label: "応援中", icon: "heart", href: "/heart" },
  { label: "お気に入り", icon: "bookmark", href: "/bookmark" },
  { label: "設定", icon: "settings", href: "/settings" },
  { label: "ヘルプ", icon: "help", href: "/help" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [account, setAccount] = useState<UserAccount | null>(null);

  useEffect(() => {
    if (!open) return;
    const userId = getUserId();
    if (!userId) return;
    getUserAccount(userId)
      .then(setAccount)
      .catch((error) => console.error("Failed to load account:", error));
  }, [open]);

  const handleLogout = () => {
    removeToken();
    onClose();
    router.push("/");
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/80 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute top-0 left-0 h-full w-75 max-w-60 bg-[#FAF9F6] shadow-xl transition-transform duration-200 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <div className="w-14 h-14 rounded-full bg-gray-300 shrink-0" />
          <div className="min-w-0">
            <div className="text-[16px] font-bold text-[#000000] truncate">
              {account?.name ?? "ユーザー名"}
            </div>
            <div className="text-[12px] text-gray-500 truncate">
              @{account?.email.split("@")[0] ?? "username"}
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button
            type="button"
            className="w-full py-2 rounded-full border border-black text-[13px] text-[#000000] cursor-pointer"
          >
            プロフィールを編集
          </button>
        </div>
        <div className="border-t border-[#EEEEEE]" />
        <nav className="px-2 py-2 cursor-pointer">
          {MENU_ITEMS.map((item) => {
            const active = item.href !== undefined && pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-lg text-[15px]",
                  active
                    ? "bg-[#E4E9D6] text-[#5E7231] font-bold"
                    : "text-[#000000]",
                )}
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-[15px] text-[#000000] text-left cursor-pointer"
          >
            <Icon name="logout" size={20} />
            ログアウト
          </button>
        </nav>
      </div>
    </div>
  );
}
