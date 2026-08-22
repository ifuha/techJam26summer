import type { IconName } from "@/components/icons/icon";

// POST /api/support, GET /api/support/{id}/status, GET /api/support/creator/{userId}
export type Support = {
  supportId: string;
  name: string;
  icon: IconName;
  isMonthly: boolean;
  amount: number;
  benefits: string[];
  createAt: string;
  userId: string;
};

// POST /api/support (request)
export type SupportCreateRequest = {
  name: string;
  icon?: IconName | null;
  isMonthly: boolean;
  amount: number;
  benefits?: string[] | null;
};

// PATCH /api/support/{id} (request)
export type SupportPatchRequest = {
  name?: string | null;
  icon?: IconName | null;
  isMonthly?: boolean | null;
  amount?: number | null;
  benefits?: string[] | null;
};
