import { fetchApi } from "../utils/fetch-api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../type";

export const register = (data: RegisterRequest): Promise<AuthResponse> =>
  fetchApi<AuthResponse>("/api/register", "POST", data);

export const login = (data: LoginRequest): Promise<AuthResponse> =>
  fetchApi<AuthResponse>("/api/login", "POST", data);
