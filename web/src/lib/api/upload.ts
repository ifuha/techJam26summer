import { getToken } from "../utils/access-token";
import type { UploadResult } from "../type";

const uploadFile = async (endpoint: string, file: File): Promise<UploadResult> => {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail ?? errorBody?.message ?? `Request failed: ${res.status}`);
  }

  return (await res.json()) as UploadResult;
};

export const uploadImage = (file: File): Promise<UploadResult> =>
  uploadFile("/api/upload/image", file);

export const uploadMovie = (file: File): Promise<UploadResult> =>
  uploadFile("/api/upload/movie", file);
