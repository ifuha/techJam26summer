import { fetchApi } from "../utils/fetch-api";
import type { CraftFavoriteStatus, MyCraftFavorite } from "../type";

export const addCraftFavorite = (craftId: string): Promise<CraftFavoriteStatus> =>
  fetchApi<CraftFavoriteStatus>(`/api/craftFavorite/${craftId}`, "POST");

export const removeCraftFavorite = (craftId: string): Promise<void> =>
  fetchApi<void>(`/api/craftFavorite/${craftId}`, "DELETE");

export const getCraftFavoriteStatus = (craftId: string): Promise<CraftFavoriteStatus> =>
  fetchApi<CraftFavoriteStatus>(`/api/craftFavorite/${craftId}/status`, "GET");

export const getMyCraftFavorites = (): Promise<MyCraftFavorite[]> =>
  fetchApi<MyCraftFavorite[]>("/api/craftFavorite/mine", "GET");
