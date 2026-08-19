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
