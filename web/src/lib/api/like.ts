import { fetchApi } from "../utils/fetch-api";
import type { LikeCreateRequest, LikeStatus } from "../type";

export const like = (data: LikeCreateRequest): Promise<LikeStatus> =>
  fetchApi<LikeStatus>("/api/Like", "POST", data);

export const unlike = (id: string): Promise<void> =>
  fetchApi<void>(`/api/Like/${id}`, "DELETE");

export const getLikeStatus = (id: string): Promise<LikeStatus> =>
  fetchApi<LikeStatus>(`/api/like/${id}/status`, "GET");
