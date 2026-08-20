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
  successorCount: number;
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
  reading: string | null;
  category: string | null;
  certification: string | null;
  features: string[];
  productionAreas: string[];
  successorCount: number;
  successors: UserPublic[];
  createAt: string;
};
