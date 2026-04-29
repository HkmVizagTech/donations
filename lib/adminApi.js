const TOKEN_KEY = "iskcon_admin_token";
const ADMIN_KEY = "iskcon_admin_user";

export const ADMIN_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

export function getAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredAdmin() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(ADMIN_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function storeAdminSession(token, admin) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_KEY);
}

export async function adminRequest(path, options = {}) {
  if (!ADMIN_API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const token = getAdminToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${ADMIN_API_URL}${path}`, {
    ...options,
    headers,
    credentials: "omit"
  });

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
  }

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
}
