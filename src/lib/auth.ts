// Client-side auth for static-hosted portal.
// Credentials are static and visible in the bundle — internal-tool grade only.

const STORAGE_KEY = "gs_session";

const VALID_PAIRS: Record<string, string> = {
  Ramil: "Ramil",
  Andrew: "Andrew",
};

export function isValidLogin(username: string, password: string): boolean {
  if (!username || !password) return false;
  const expected = VALID_PAIRS[username];
  return expected !== undefined && expected === password;
}

export function setSession(username: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, username);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getSessionUser(): string | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (!v || !(v in VALID_PAIRS)) return null;
  return v;
}
