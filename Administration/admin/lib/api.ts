import { getAdminToken } from "./auth";

const DEFAULT_API_BASE_URL = "https://portfolio-1-ypt3.onrender.com/api";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

export function apiUrl(path: string) {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export function apiHealthUrl() {
  return `${API_ORIGIN}/health`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  const token = getAdminToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiUrl(path), { ...init, headers });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      responseText || `La requête API a échoué (${response.status}).`,
    );
  }

  if (!responseText) {
    return undefined as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    return responseText as T;
  }
}
