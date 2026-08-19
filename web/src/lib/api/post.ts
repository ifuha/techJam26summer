import { fetchApi } from "../utils/fetch-api";
import type { Post, PostCreateRequest, PostPatchRequest } from "../type";

export const getPosts = (): Promise<Post[]> => fetchApi<Post[]>("/api/Posts", "GET");

export const getPost = (id: string): Promise<Post> =>
  fetchApi<Post>(`/api/Post/${id}`, "GET");

export const createPost = (data: PostCreateRequest): Promise<Post> =>
  fetchApi<Post>("/api/Post", "POST", data);

export const patchPost = (id: string, data: PostPatchRequest): Promise<Post> =>
  fetchApi<Post>(`/api/Post/Patch/${id}`, "PATCH", data);

export const deletePost = (id: string): Promise<void> =>
  fetchApi<void>(`/api/Post/Delete/${id}`, "DELETE");
