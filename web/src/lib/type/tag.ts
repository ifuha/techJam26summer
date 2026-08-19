// POST /api/tag, GET /api/tags
export type Tag = {
  tagId: string;
  tagName: string;
  createAt: string;
  userId: string;
};

// POST /api/tag (request)
export type TagCreateRequest = {
  tagName: string;
};
