import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getToken = (): string | undefined => {
  return Cookies.get("token");
};

export const setToken = (token: string) =>
  Cookies.set("token", token, { expires: 7 });
export const removeToken = () => Cookies.remove("token");

export const getUserId = (): string | null => {
  const token = getToken();
  if (!token) return null;
  const decoded = jwtDecode<{ [key: string]: string }>(token);
  const nameId =
    decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  return nameId ?? null;
};

export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;
  const decoded = jwtDecode<{ [key: string]: string }>(token);
  const role =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return role ?? null;
};
