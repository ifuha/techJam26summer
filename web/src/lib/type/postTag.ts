// GET /api/postTag/{postId}, POST /api/postTag (response)
export type PostTag = {
  postId: string;
  tagId: string;
  tagName: string;
};

// POST /api/postTag (request)
export type PostTagCreateRequest = {
  postId: string;
  tagId: string;
};
