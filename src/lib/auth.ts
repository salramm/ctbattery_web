// Admin auth: Firebase email/password → exchange the ID token at the backend for
// an API JWT, which the admin dashboards send as a Bearer token.
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { API_BASE } from "./api";

const TOKEN_KEY = "ctbs_api_jwt"; // read by the admin dashboards
const USER_KEY = "gs_session"; // portal gate marker (email)

/** Sign in with Firebase, then swap the ID token for the backend admin JWT. */
export async function signIn(email: string, password: string): Promise<string> {
  const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  const idToken = await cred.user.getIdToken();

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    // Backend rejects non-allowlisted accounts with NOT_AUTHORIZED.
    await signOut(getFirebaseAuth()).catch(() => {});
    throw new Error(json?.message || "Sign-in failed");
  }
  const { token, user } = json.data as { token: string; user: { email: string } };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, user.email);
  return user.email;
}

export function getSessionUser(): string | null {
  if (typeof window === "undefined") return null;
  const t = localStorage.getItem(TOKEN_KEY);
  const u = localStorage.getItem(USER_KEY);
  return t && u ? u : null;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export async function clearSession(): Promise<void> {
  try {
    await signOut(getFirebaseAuth());
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

// Guard so a burst of concurrent 401s (several dashboards loading at once) only
// clears the session and redirects once.
let loggingOut = false;

/**
 * Hard logout: wipe the stored session (API JWT + Firebase) and send the user to
 * /login so they can sign back in. Called when the API rejects our token as
 * expired/invalid — leaving a dead token in place would strand the user in a
 * portal that can't load anything.
 */
export async function forceLogout(reason?: string): Promise<void> {
  if (loggingOut) return;
  loggingOut = true;
  await clearSession();
  if (typeof window !== "undefined") {
    const q = reason ? `?reason=${encodeURIComponent(reason)}` : "";
    window.location.assign(`/login${q}`);
  }
}

/**
 * Fetch an admin API endpoint with the JWT attached. If there is no token, or the
 * server rejects it as expired/invalid (401), log the user out completely and
 * redirect to /login. Returns the raw Response so callers can parse JSON or a
 * blob (e.g. LOI PDF) as before.
 */
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (!token) {
    await forceLogout("expired");
    throw new Error("Session expired — please sign in again.");
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}` },
  });
  // 401 is the backend's NO_TOKEN / INVALID_TOKEN (expired JWT). 403 is a wrong
  // role, not an expired token, so it must NOT trigger a logout.
  if (res.status === 401) {
    await forceLogout("expired");
    throw new Error("Session expired — please sign in again.");
  }
  return res;
}
