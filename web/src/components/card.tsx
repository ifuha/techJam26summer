"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons/icon";
import { BottomSheet } from "./bottom-sheet";
import type { UserPublic } from "@/lib/type";
import { getFollowerCount, getUsers } from "@/lib/api";
import { formatDuration } from "@/lib/utils/format";

export type CardProps = {
  user: UserPublic;
  onSelectUser?: (user: UserPublic) => void;
};

type SimilarUserCardProps = {
  user: UserPublic;
  followerCount: number | null;
  onSelect?: () => void;
};

function SimilarUserCard({ user, followerCount, onSelect }: SimilarUserCardProps) {
  return (
    <div className="border-t pt-3.25 mt-3.25">
      <div className="flex gap-2">
        <div className="w-17.5 h-17.5 rounded-full bg-gray-400 shrink-0" />
        <div>
          {user.tags[0] && (
            <div className="px-1.5 py-0.5 rounded-2xl border w-fit text-[9px] text-[#000000]">
              {user.tags[0]}
            </div>
          )}
          <div className="text-[20px] font-bold text-[#000000]">{user.name}</div>
          {(user.productName || user.prefecture || user.address) && (
            <div className="flex items-center">
              {user.productName && (
                <div className="pt-1 pr-2 border-r text-[12px] text-[#000000]">
                  {user.productName}
                </div>
              )}
              {(user.prefecture || user.address) && (
                <div className="pt-1 pl-2 text-[12px] text-[#000000]">
                  {[user.prefecture, user.address].filter(Boolean).join(" ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-3.25 pb-2.75 border-b">
        <div className="flex items-center">
          <div className="flex justify-center items-center">
            <Icon name="group" size={16} />
            <p className="pr-2 text-[#000000] text-[11px]">活動歴</p>
          </div>
          <p className="text-[#000000] text-[11px]">
            {formatDuration(user.createAt)}
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <Icon name="heart" size={12} />
          <div className="pr-2 text-[#000000] text-[11px]">応援数</div>
          <div className="text-[#000000] text-[11px]">{followerCount ?? "-"}</div>
        </div>
      </div>
      <div className="flex justify-between mt-3.25">
        <button
          type="button"
          onClick={onSelect}
          className="w-full max-w-41.25 h-10 rounded-sm border bg-[#FFFFFF] text-[#000000] text-[14px]"
        >
          詳細を見る
        </button>
        <button className="w-full max-w-41.25 h-10 rounded-sm bg-[#EE8978] text-[#FFFFFF] text-[14px]">
          応援する
        </button>
      </div>
    </div>
  );
}

export function Card({ user, onSelectUser }: CardProps) {
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [similarUsers, setSimilarUsers] = useState<UserPublic[]>([]);
  const [similarFollowerCounts, setSimilarFollowerCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    setFollowerCount(null);
    getFollowerCount(user.userId)
      .then((result) => setFollowerCount(result.count))
      .catch((error) => console.error("Failed to load follower count:", error));
  }, [user.userId]);

  useEffect(() => {
    setSimilarUsers([]);
    setSimilarFollowerCounts({});

    getUsers()
      .then((users) => {
        const distanceTo = (candidate: UserPublic): number => {
          if (
            user.latitude === null ||
            user.longitude === null ||
            candidate.latitude === null ||
            candidate.longitude === null
          ) {
            return Infinity;
          }
          return (
            (candidate.latitude - user.latitude) ** 2 +
            (candidate.longitude - user.longitude) ** 2
          );
        };

        const others = users
          .filter(
            (candidate) =>
              candidate.userId !== user.userId &&
              candidate.jobOrCommonMan &&
              user.prefecture !== null &&
              candidate.prefecture === user.prefecture,
          )
          .sort((a, b) => distanceTo(a) - distanceTo(b));
        setSimilarUsers(others);

        return Promise.all(
          others.map((other) =>
            getFollowerCount(other.userId).then(
              (result) => [other.userId, result.count] as const,
            ),
          ),
        );
      })
      .then((entries) => {
        setSimilarFollowerCounts(Object.fromEntries(entries));
      })
      .catch((error) => console.error("Failed to load similar users:", error));
  }, [user]);

  return (
    <BottomSheet
      resetKey={user.userId}
      header={
        <div key={user.userId} className="flex gap-2 animate-card-content">
          <div className="w-17.5 h-17.5 rounded-full bg-gray-400 shrink-0" />
          <div>
            {user.tags[0] && (
              <div className="px-1.5 py-0.5 rounded-2xl border w-fit text-[9px] text-[#000000]">
                {user.tags[0]}
              </div>
            )}
            <div className="text-[20px] font-bold text-[#000000]">
              {user.name}
            </div>
            {(user.productName || user.prefecture || user.address) && (
              <div className="flex items-center">
                {user.productName && (
                  <div className="pt-1 pr-2 border-r text-[12px] text-[#000000]">
                    {user.productName}
                  </div>
                )}
                {(user.prefecture || user.address) && (
                  <div className="pt-1 pl-2 text-[12px] text-[#000000]">
                    {[user.prefecture, user.address].filter(Boolean).join(" ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      }
    >
      <div key={user.userId} className="animate-card-content">
        <div className="flex gap-4 mt-3.25 pb-2.75 border-b">
          <div className="flex items-center">
            <div className="flex justify-center items-center">
              <Icon name="group" size={16} />
              <p className="pr-2 text-[#000000] text-[11px]">活動歴</p>
            </div>
            <p className="text-[#000000] text-[11px]">
              {formatDuration(user.createAt)}
            </p>
          </div>
          <div className="flex items-center shrink-0">
            <Icon name="heart" size={12} />
            <div className="pr-2 text-[#000000] text-[11px]">応援数</div>
            <div className="text-[#000000] text-[11px]">
              {followerCount ?? "-"}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-3.25">
          <button className="w-full max-w-41.25 h-10 rounded-sm border bg-[#FFFFFF] text-[#000000] text-[14px]">
            詳細を見る
          </button>
          <button className="w-full max-w-41.25 h-10 rounded-sm bg-[#EE8978] text-[#FFFFFF] text-[14px]">
            応援する
          </button>
        </div>

        {similarUsers.map((similar) => (
          <SimilarUserCard
            key={similar.userId}
            user={similar}
            followerCount={similarFollowerCounts[similar.userId] ?? null}
            onSelect={() => onSelectUser?.(similar)}
          />
        ))}

        <div className="pb-12" />
      </div>
    </BottomSheet>
  );
}
