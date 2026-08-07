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
