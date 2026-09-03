import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "it_support_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function signingKey() {
  return process.env.IT_SUPPORT_SESSION_SECRET || process.env.IT_SUPPORT_ADMIN_TOKEN || "";
}

function signature(payload: string) {
  return createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `ADMIN.${expiresAt}`;
  return `${payload}.${signature(payload)}`;
}

export function isAdminSession(value?: string) {
  if (!value || !signingKey()) return false;
  const [role, expiresText, providedSignature] = value.split(".");
  const payload = `${role}.${expiresText}`;
  const expectedSignature = signature(payload);
  if (role !== "ADMIN" || !expiresText || !providedSignature || Number(expiresText) < Math.floor(Date.now() / 1000)) return false;
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export function adminSessionFromRequest(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  return isAdminSession(cookie?.slice(ADMIN_SESSION_COOKIE.length + 1));
}
