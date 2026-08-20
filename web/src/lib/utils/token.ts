import Cookies from "js-cookie";

const TOKEN_KEY = "token";

/** APIから返されたトークンをCookieへ保存する。 */
export function setToken(token: string): void {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    throw new Error("保存するトークンが空です。");
  }

  Cookies.set(TOKEN_KEY, normalizedToken, {
    expires: 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

/** Cookieに保存されたトークンを取得する。 */
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}
