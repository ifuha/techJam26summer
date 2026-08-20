import type { UserPublic } from "./user";

// GET /api/crafts
export type CraftSummary = {
  craftId: string;
  productName: string;
  address: string | null;
  prefecture: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
};

// GET /api/craft/{id}
export type CraftDetail = {
  craftId: string;
  productName: string;
  address: string | null;
  prefecture: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  description: string | null;
  successorCount: number;
  successors: UserPublic[];
  createAt: string;
};
