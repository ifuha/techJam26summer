import { fetchApi } from "../utils/fetch-api";
import type { PostTag, PostTagCreateRequest } from "../type";

export const getPostTags = (postId: string): Promise<PostTag[]> =>
  fetchApi<PostTag[]>(`/api/postTag/${postId}`, "GET");

export const createPostTag = (data: PostTagCreateRequest): Promise<PostTag> =>
  fetchApi<PostTag>("/api/postTag", "POST", data);

export const deletePostTag = (postId: string, tagId: string): Promise<void> =>
  fetchApi<void>(`/api/postTag/${postId}/${tagId}`, "DELETE");
