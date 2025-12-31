// utils/auth.js
export function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function msUntilExpiry(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return 0;
  const nowMs = Date.now();
  return Math.max(0, payload.exp * 1000 - nowMs);
}
