"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons/icon";
import { getTags } from "@/lib/api";
import type { Tag } from "@/lib/type";

export function Header() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getTags()
      .then(setTags)
      .catch((error) => console.error("Failed to load tags:", error));
  }, []);

  return (
    <div className="w-full bg-[#FAF9F6]">
      <div className="flex items-center justify-between px-4 py-3">
        <Icon name="menu" size={22} />
        <div className="text-[20px]">Logo</div>
        <Icon name="bell" size={22} />
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        <button
          type="button"
          onClick={() => setSelected(null)}
          className={`shrink-0 px-4 py-2 rounded-full border text-[14px] ${
            selected === null
              ? "bg-[#9CA86B] text-white border-[#9CA86B]"
              : "bg-white text-black border-gray-300"
          }`}
        >
          すべて
        </button>
        {tags.map((tag) => (
          <button
            key={tag.tagId}
            type="button"
            onClick={() => setSelected(tag.tagName)}
            className={`shrink-0 px-4 py-2 rounded-full border text-[14px] ${
              selected === tag.tagName
                ? "bg-[#9CA86B] text-white border-[#9CA86B]"
                : "bg-white text-black border-gray-300"
            }`}
          >
            {tag.tagName}
          </button>
        ))}
      </div>
    </div>
  );
}
