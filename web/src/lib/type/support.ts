// POST /api/support, GET /api/support/{id}/status
export type Support = {
  supportId: string;
  isMonthly: boolean;
  amount: number;
  createAt: string;
  userId: string;
};

// POST /api/support (request)
export type SupportCreateRequest = {
  isMonthly: boolean;
  amount: number;
};
