export const ADMIN_TOKEN_KEY = "vnatech-admin-token";
export const ADMIN_AUTH_EVENT = "vnatech-admin-auth-change";

export function getAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function clearAdminToken() {
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

export function isAdminTokenValid(token: string) {
  try {
    const [, encodedPayload] = token.split(".");

    if (!encodedPayload) {
      return false;
    }

    const normalizedPayload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );
    const payload = JSON.parse(window.atob(paddedPayload)) as {
      exp?: number;
    };

    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
