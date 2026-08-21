import { fetchApi } from "../utils/fetch-api";
import type { FollowerCount, FollowStatus, MyFollow } from "../type";

export const follow = (targetId: string): Promise<FollowStatus> =>
  fetchApi<FollowStatus>(`/api/follow/${targetId}`, "POST");

export const getMyFollows = (): Promise<MyFollow[]> =>
  fetchApi<MyFollow[]>("/api/follow/mine", "GET");

export const unfollow = (targetId: string): Promise<void> =>
  fetchApi<void>(`/api/follow/${targetId}`, "DELETE");

export const getFollowerCount = (userId: string): Promise<FollowerCount> =>
  fetchApi<FollowerCount>(`/api/follow/${userId}/followers`, "GET");

export const getFollowStatus = (targetId: string): Promise<FollowStatus> =>
  fetchApi<FollowStatus>(`/api/follow/${targetId}/status`, "GET");
