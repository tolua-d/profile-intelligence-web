import { API_BASE_URL } from "./config";

const VERSION_HEADER = { "X-API-Version": "1" };

export async function apiGet(path: string, withVersion = false) {
  const headers: HeadersInit = withVersion ? VERSION_HEADER : {};
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

export async function apiPost(path: string, body: unknown, csrfToken?: string, withVersion = false) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(withVersion ? VERSION_HEADER : {}),
  };
  if (csrfToken) headers["X-CSRFToken"] = csrfToken;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json();
}

async function extractError(res: Response) {
  try {
    const body = await res.json();
    return body.message || body.error || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}
