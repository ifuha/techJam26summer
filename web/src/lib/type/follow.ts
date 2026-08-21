// POST /api/follow/{targetId}, GET /api/follow/{targetId}/status
export type FollowStatus = {
  isFollowing: boolean;
};

// GET /api/follow/{userId}/followers
export type FollowerCount = {
  count: number;
};

// GET /api/follow/mine
export type MyFollow = {
  followId: string;
  followedUserId: string;
  followedName: string;
  followedAvatar: string | null;
  followedProductName: string | null;
  followedPrefecture: string | null;
  followedAddress: string | null;
  createAt: string;
};
