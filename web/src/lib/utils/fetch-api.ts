import { getToken } from "./access-token";

type apiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function fetchApi<T>(
  endpoint: string,
  method: apiMethod = "GET",
  body?: unknown,
): Promise<T> {
  const token = getToken();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? ""}${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}
