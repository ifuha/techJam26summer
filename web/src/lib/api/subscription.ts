import { fetchApi } from "../utils/fetch-api";
import type { SubscriptionCreateRequest, SubscriptionStatus } from "../type";

export const subscribe = (data: SubscriptionCreateRequest): Promise<SubscriptionStatus> =>
  fetchApi<SubscriptionStatus>("/api/SubScription", "POST", data);

export const unsubscribe = (id: string): Promise<void> =>
  fetchApi<void>(`/api/SubScription/${id}`, "DELETE");

export const getSubscriptionStatus = (id: string): Promise<SubscriptionStatus> =>
  fetchApi<SubscriptionStatus>(`/api/SubScription/${id}/status`, "GET");
