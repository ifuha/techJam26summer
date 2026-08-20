import { fetchApi } from "../utils/fetch-api";
import type { Support, SupportCreateRequest } from "../type";

export const createSupport = (data: SupportCreateRequest): Promise<Support> =>
  fetchApi<Support>("/api/support", "POST", data);

export const getSupportStatus = (id: string): Promise<Support> =>
  fetchApi<Support>(`/api/support/${id}/status`, "GET");

export const unSupport = (id: string): Promise<void> =>
  fetchApi<void>(`/api/support/${id}`, "DELETE");
