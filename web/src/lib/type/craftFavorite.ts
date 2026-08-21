// POST /api/craftFavorite/{craftId}, GET /api/craftFavorite/{craftId}/status
export type CraftFavoriteStatus = {
  isFavorited: boolean;
};

// GET /api/craftFavorite/mine
export type MyCraftFavorite = {
  craftFavoriteId: string;
  craftId: string;
  craftProductName: string;
  craftAddress: string | null;
  craftPrefecture: string | null;
  craftImage: string | null;
  successorCount: number;
  createAt: string;
};
