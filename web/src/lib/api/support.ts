import { fetchApi } from "../utils/fetch-api";
import type { Support, SupportCreateRequest, SupportPatchRequest } from "../type";

export const createSupport = (data: SupportCreateRequest): Promise<Support> =>
  fetchApi<Support>("/api/support", "POST", data);

export const patchSupport = (id: string, data: SupportPatchRequest): Promise<Support> =>
  fetchApi<Support>(`/api/support/${id}`, "PATCH", data);

export const getSupportsByCreator = (userId: string): Promise<Support[]> =>
  fetchApi<Support[]>(`/api/support/creator/${userId}`, "GET");

export const getSupportStatus = (id: string): Promise<Support> =>
  fetchApi<Support>(`/api/support/${id}/status`, "GET");

export const unSupport = (id: string): Promise<void> =>
  fetchApi<void>(`/api/support/${id}`, "DELETE");
