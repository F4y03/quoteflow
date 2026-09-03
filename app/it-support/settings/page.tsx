import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "../../../lib/it-support/session";
import { SystemSettings } from "./system-settings";

export const metadata: Metadata = { title: "ตั้งค่าระบบ | IT Support" };

export default async function SystemSettingsPage() {
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAdminSession(session)) redirect("/it-support/login");
  return <SystemSettings />;
}
