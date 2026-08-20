export type PostMediaType = "Image" | "Movie";

// PostDto.media
export type PostMedia = {
  postMediaId: string;
  url: string;
  type: PostMediaType;
  sortOrder: number;
};

// used when creating/patching a post's media list
export type PostMediaInput = {
  url: string;
  type: PostMediaType;
};

// GET /api/Posts, GET /api/Post/{id}
export type Post = {
  postId: string;
  title: string;
  userId: string;
  reportMassege: string;
  subscription: string | null;
  createAt: string;
  supportId: string;
  likeCount: number;
  tags: string[];
  media: PostMedia[];
};

// POST /api/Post
export type PostCreateRequest = {
  title: string;
  reportMassege: string;
  subscription?: string | null;
  supportId: string;
  media?: PostMediaInput[] | null;
};

// PATCH /api/Post/Patch/{id}
export type PostPatchRequest = {
  title?: string | null;
  reportMassege?: string | null;
  subscription?: string | null;
  supportId?: string | null;
  media?: PostMediaInput[] | null;
};
