import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession } from "../../../../../lib/it-support/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { token?: unknown } | null;
  const configured = process.env.IT_SUPPORT_ADMIN_TOKEN;
  const token = typeof body?.token === "string" ? body.token : "";
  if (!configured) return NextResponse.json({ error: "ยังไม่ได้ตั้ง IT_SUPPORT_ADMIN_TOKEN ในไฟล์ .env" }, { status: 503 });
  const provided = Buffer.from(token);
  const expected = Buffer.from(configured);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return NextResponse.json({ error: "รหัสผู้ดูแลระบบไม่ถูกต้อง" }, { status: 401 });
  const response = NextResponse.json({ message: "เข้าสู่ระบบแล้ว" });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
