// POST /api/register
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  jobOrCommonMan: boolean;
  avatar: string | null;
  address: string | null;
  prefecture: string | null;
  productName: string | null;
  bio: string | null;
};

// POST /api/login
export type LoginRequest = {
  email: string;
  password: string;
};

// POST /api/register, POST /api/login
export type AuthResponse = {
  token: string;
  userId: string;
  name: string;
  email: string;
};
