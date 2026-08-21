// POST /api/thanks (request)
export type ThanksCreateRequest = {
  subscriptionId: string;
};

// POST /api/thanks (response)
export type Thanks = {
  thanksId: string;
  subscriptionId: string;
  createAt: string;
};
