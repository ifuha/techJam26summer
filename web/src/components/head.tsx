"use client";

import { useState } from "react";
import { Icon } from "./icons/icon";
import { Sidebar } from "./sidebar";

export function Head() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full bg-[#FAF9F6] text-black flex items-center justify-between px-4 py-3">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="cursor-pointer"
      >
        <Icon name="menu" size={22} />
      </button>
      <div className="text-[20px] text-black">Logo</div>
      <div className="cursor-pointer">
        <Icon name="bell" size={22} />
      </div>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
