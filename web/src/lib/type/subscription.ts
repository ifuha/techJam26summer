// POST /api/SubScription (request)
export type SubscriptionCreateRequest = {
  supportId: string;
};

// POST /api/SubScription, GET /api/SubScription/{id}/status (response)
export type SubscriptionStatus = {
  isSubscribed: boolean;
  status: boolean | null;
  expiresAt: string | null;
};

// GET /api/SubScription/creator/stats
export type CreatorSubscriptionStats = {
  subscriberCount: number;
  thisMonthCount: number;
};

// GET /api/SubScription/mine
export type MySubscription = {
  subscriptionId: string;
  supportId: string;
  supportName: string;
  amount: number;
  isMonthly: boolean;
  creatorUserId: string;
  creatorName: string;
  creatorAvatar: string | null;
  creatorProductName: string | null;
  creatorPrefecture: string | null;
  creatorAddress: string | null;
  createAt: string;
};
