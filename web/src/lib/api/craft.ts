import { fetchApi } from "../utils/fetch-api";
import type { CraftDetail, CraftSummary } from "../type";

export const getCrafts = (): Promise<CraftSummary[]> =>
  fetchApi<CraftSummary[]>("/api/crafts", "GET");

export const getCraft = (id: string): Promise<CraftDetail> =>
  fetchApi<CraftDetail>(`/api/craft/${id}`, "GET");
