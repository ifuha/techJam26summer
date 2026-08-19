import { fetchApi } from "../utils/fetch-api";
import type { Tag, TagCreateRequest } from "../type";

export const createTag = (data: TagCreateRequest): Promise<Tag> =>
  fetchApi<Tag>("/api/tag", "POST", data);

export const getTags = (): Promise<Tag[]> => fetchApi<Tag[]>("/api/tags", "GET");
