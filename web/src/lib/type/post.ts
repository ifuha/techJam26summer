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
  // null when the viewer hasn't unlocked this post (see isLocked)
  reportMassege: string | null;
  subscription: string | null;
  createAt: string;
  // null means this post is public (not gated behind a support plan)
  supportId: string | null;
  isLocked: boolean;
  likeCount: number;
  tags: string[];
  media: PostMedia[];
};

// POST /api/Post
export type PostCreateRequest = {
  title: string;
  reportMassege: string;
  subscription?: string | null;
  // omit or null to make the post public
  supportId?: string | null;
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
