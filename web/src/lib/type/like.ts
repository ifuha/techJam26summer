// POST /api/Like (request)
export type LikeCreateRequest = {
  postId: string;
};

// POST /api/Like, GET /api/like/{id}/status (response)
export type LikeStatus = {
  isLiked: boolean;
};
