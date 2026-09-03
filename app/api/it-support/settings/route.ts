import { NextResponse } from "next/server";
import { recordAudit } from "../../../../lib/it-support/audit";
import { writeSystemEnv } from "../../../../lib/it-support/env-file";
import { adminSessionFromRequest } from "../../../../lib/it-support/session";
import { systemSettingsSchema } from "../../../../lib/it-support/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = systemSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "ข้อมูลการตั้งค่าไม่ถูกต้อง", details: parsed.error.flatten() }, { status: 400 });
  if (!process.env.IT_SUPPORT_ADMIN_TOKEN) return NextResponse.json({ error: "ยังไม่ได้กำหนด IT_SUPPORT_ADMIN_TOKEN ในไฟล์ .env" }, { status: 503 });
  if (!adminSessionFromRequest(request)) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบผู้ดูแลก่อนบันทึก" }, { status: 401 });

  await writeSystemEnv(parsed.data);
  await recordAudit({ action: "settings.env.updated", entityType: "SystemSettings", metadata: { allowedNetworks: parsed.data.allowedNetworks, intervalMinutes: parsed.data.intervalMinutes, demoMode: parsed.data.demoMode, databaseConfigured: Boolean(parsed.data.databaseUrl) } });
  return NextResponse.json({ message: "บันทึกไฟล์ .env แล้ว กรุณารีสตาร์ตเซิร์ฟเวอร์เพื่อให้ค่ามีผล" });
}
