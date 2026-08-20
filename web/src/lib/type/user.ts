// GET /api/Users, GET /api/User/{id}
export type UserPublic = {
  userId: string;
  name: string;
  avatar: string | null;
  jobOrCommonMan: boolean;
  productName: string | null;
  bio: string | null;
  address: string | null;
  prefecture: string | null;
  latitude: number | null;
  longitude: number | null;
  craftId: string | null;
  tags: string[];
  createAt: string;
};

// GET /api/User/account/{id}, PATCH /api/User/Patch (response)
export type UserAccount = {
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  jobOrCommonMan: boolean;
  address: string | null;
  prefecture: string | null;
  latitude: number | null;
  longitude: number | null;
  productName: string | null;
  bio: string | null;
  tags: string[];
  createAt: string;
};

// PATCH /api/User/Patch (request)
export type UserPatchRequest = {
  name?: string | null;
  avatar?: string | null;
  address?: string | null;
  prefecture?: string | null;
  productName?: string | null;
  bio?: string | null;
};
