import type { IAuthenticatedUser } from "../types/auth.type";
import { getToken, removeToken } from "./auth-storage";

function decodeTokenPayload(token: string) {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);
    return JSON.parse(decodedPayload) as Partial<IAuthenticatedUser>;
  } catch {
    return null;
  }
}

export function getAuthenticatedUser() {
  const token = getToken();

  if (!token) {
    return null;
  }

  const payload = decodeTokenPayload(token);

  if (!payload?.id || !payload.email || !payload.role) {
    removeToken();
    return null;
  }

  return payload as IAuthenticatedUser;
}

export function getCurrentUserRole() {
  return getAuthenticatedUser()?.role ?? null;
}

export function isAuthenticated() {
  return getAuthenticatedUser() !== null;
}
