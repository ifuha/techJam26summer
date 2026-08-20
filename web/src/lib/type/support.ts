// POST /api/support, GET /api/support/{id}/status, GET /api/support/creator/{userId}
export type Support = {
  supportId: string;
  name: string;
  isMonthly: boolean;
  amount: number;
  benefits: string[];
  createAt: string;
  userId: string;
};

// POST /api/support (request)
export type SupportCreateRequest = {
  name: string;
  isMonthly: boolean;
  amount: number;
  benefits?: string[] | null;
};
