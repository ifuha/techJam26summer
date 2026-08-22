"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icons/icon";
import { Sidebar } from "./sidebar";
import { getUserId } from "@/lib/utils/access-token";

export type HeadProps = {
  shadow?: boolean;
};

export function Head({ shadow = true }: HeadProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getUserId() !== null);
  }, []);

  return (
    <div
      className={`w-full bg-[#FAF9F6] text-black flex items-center justify-between px-4 py-3 ${
        shadow ? "shadow-[0_4px_4px_rgba(0,0,0,0.1)]" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="cursor-pointer"
      >
        <Icon name="menu" size={22} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Logo" className="h-6 w-auto" />
      {isLoggedIn ? (
        <button
          type="button"
          onClick={() => router.push("/notifications")}
          className="cursor-pointer"
        >
          <Icon name="bell" size={22} />
        </button>
      ) : (
        <div className="w-5.5 h-5.5" />
      )}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
