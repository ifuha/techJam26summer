import { fetchApi } from "../utils/fetch-api";
import type { UserTag, UserTagCreateRequest } from "../type";

export const getUserTags = (userId: string): Promise<UserTag[]> =>
  fetchApi<UserTag[]>(`/api/userTag/${userId}`, "GET");

export const addUserTag = (data: UserTagCreateRequest): Promise<UserTag> =>
  fetchApi<UserTag>("/api/userTag", "POST", data);

export const removeUserTag = (tagId: string): Promise<void> =>
  fetchApi<void>(`/api/userTag/${tagId}`, "DELETE");
