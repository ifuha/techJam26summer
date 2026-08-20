import { fetchApi } from "../utils/fetch-api";
import type { FollowerCount, FollowStatus } from "../type";

export const follow = (targetId: string): Promise<FollowStatus> =>
  fetchApi<FollowStatus>(`/api/follow/${targetId}`, "POST");

export const unfollow = (targetId: string): Promise<void> =>
  fetchApi<void>(`/api/follow/${targetId}`, "DELETE");

export const getFollowerCount = (userId: string): Promise<FollowerCount> =>
  fetchApi<FollowerCount>(`/api/follow/${userId}/followers`, "GET");

export const getFollowStatus = (targetId: string): Promise<FollowStatus> =>
  fetchApi<FollowStatus>(`/api/follow/${targetId}/status`, "GET");
