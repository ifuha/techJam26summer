// GET /api/userTag/{userId}, POST /api/userTag (response)
export type UserTag = {
  userId: string;
  tagId: string;
  tagName: string;
};

// POST /api/userTag (request)
export type UserTagCreateRequest = {
  tagId: string;
};
