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

const COMMON_MENU_ITEMS: MenuItem[] = [
  { label: "ホーム", icon: "home", href: "/", matchPath: "/" },
  { label: "探す", icon: "search", href: "/search", matchPath: "/search" },
  { label: "応援中", icon: "heart", href: "/heart", matchPath: "/heart" },
  {
    label: "お気に入り",
    icon: "bookmark",
    href: "/bookmark",
    matchPath: "/bookmark",
  },
  { label: "設定", icon: "settings", href: "/settings", matchPath: "/settings" },
  { label: "ヘルプ", icon: "help", href: "/" },
];

// 継承者(Job)アカウントには消費者向け機能(地図/お気に入り)は不要なので、
// 代わりに自分のアカウント詳細(応援状況・活動記録・売り上げ)を表示するページに誘導する。
const JOB_MENU_ITEMS: MenuItem[] = [
  { label: "ホーム", icon: "home", href: "/account", matchPath: "/account" },
  {
    label: "活動記録",
    icon: "document",
    href: "/account/works",
    matchPath: "/account/works",
  },
  {
    label: "応援",
    icon: "heart",
    href: "/account/supporter",
    matchPath: "/account/supporter",
  },
  { label: "売り上げ", icon: "chart", href: "/account/sales", matchPath: "/account/sales" },
  { label: "設定", icon: "settings", href: "/settings", matchPath: "/settings" },
  { label: "ヘルプ", icon: "help", href: "/" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getUserId() !== null);
  }, []);

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

  const LOGGED_IN_ONLY_LABELS = ["応援中", "お気に入り", "設定"];
  const menuItems = (
    account?.jobOrCommonMan ? JOB_MENU_ITEMS : COMMON_MENU_ITEMS
  ).filter((item) => isLoggedIn || !LOGGED_IN_ONLY_LABELS.includes(item.label));

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
        {isLoggedIn && (
          <>
            <div className="flex items-center gap-3 px-4 pt-6 pb-4">
              <div className="w-14 h-14 rounded-full bg-gray-300 shrink-0 overflow-hidden">
                {account?.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[16px] font-bold text-[#000000] truncate">
                  {account?.name ?? "ユーザー名"}
                </div>
                <div className="text-[12px] text-gray-500 truncate">
                  @{account?.email.split("@")[0] ?? "username"}
                </div>
              </div>
            </div>
            <div className="px-4 pb-4 flex flex-col gap-2">
              <Link
                href="/account/profile"
                onClick={onClose}
                className="block w-full py-2 rounded-full border border-black text-[13px] text-center text-[#000000]"
              >
                プロフィールを編集
              </Link>
            </div>
          </>
        )}
        <div className="border-t border-[#EEEEEE]" />
        <nav className="px-2 py-2 cursor-pointer">
          {menuItems.map((item) => {
            const active = item.matchPath !== undefined && pathname === item.matchPath;
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
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-[15px] text-[#000000] text-left cursor-pointer"
            >
              <Icon name="logout" size={20} />
              ログアウト
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
