// Thin API client. In production the frontend calls same-origin /api/* (Netlify
// proxies to the backend droplet); in dev, set NEXT_PUBLIC_API_BASE_URL to the
// local backend (e.g. http://localhost:3000).

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Fetch JSON from the API, unwrapping the { success, data } envelope. Throws with
 * the server's `message` on error. Endpoints that return raw documents (e.g.
 * /api/territories) come back as-is.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || json?.error || `Request failed (${res.status})`);
  }
  return (json && "data" in json ? json.data : json) as T;
}
