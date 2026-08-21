import { fetchApi } from "../utils/fetch-api";
import type { Thanks, ThanksCreateRequest } from "../type";

export const sendThanks = (data: ThanksCreateRequest): Promise<Thanks> =>
  fetchApi<Thanks>("/api/thanks", "POST", data);
