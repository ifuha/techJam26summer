import { fetchApi } from "../utils/fetch-api";
import type { UserAccount, UserPatchRequest, UserPublic } from "../type";

export const getUsers = (): Promise<UserPublic[]> =>
  fetchApi<UserPublic[]>("/api/Users", "GET");

export const getUser = (id: string): Promise<UserPublic> =>
  fetchApi<UserPublic>(`/api/User/${id}`, "GET");

export const getUserAccount = (id: string): Promise<UserAccount> =>
  fetchApi<UserAccount>(`/api/User/account/${id}`, "GET");

export const patchUser = (data: UserPatchRequest): Promise<UserAccount> =>
  fetchApi<UserAccount>("/api/User/Patch", "PATCH", data);

export const deleteUser = (): Promise<void> =>
  fetchApi<void>("/api/User/delete", "DELETE");
