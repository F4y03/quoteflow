import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "../../../../../lib/it-support/session";

export async function POST() {
  const response = NextResponse.json({ message: "ออกจากระบบแล้ว" });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
