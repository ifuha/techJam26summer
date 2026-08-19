// POST /api/follow/{targetId}, GET /api/follow/{targetId}/status
export type FollowStatus = {
  isFollowing: boolean;
};

// GET /api/follow/{userId}/followers
export type FollowerCount = {
  count: number;
};
