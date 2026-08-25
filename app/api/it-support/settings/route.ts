import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { recordAudit } from "../../../../lib/it-support/audit";
import { writeSystemEnv } from "../../../../lib/it-support/env-file";
import { systemSettingsSchema } from "../../../../lib/it-support/validation";

export const runtime = "nodejs";

function matchesAdminToken(value: string) {
  const configured = process.env.IT_SUPPORT_ADMIN_TOKEN;
  if (!configured) return false;
  const providedBuffer = Buffer.from(value);
  const configuredBuffer = Buffer.from(configured);
  return providedBuffer.length === configuredBuffer.length && timingSafeEqual(providedBuffer, configuredBuffer);
}

export async function POST(request: Request) {
  const parsed = systemSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "ข้อมูลการตั้งค่าไม่ถูกต้อง", details: parsed.error.flatten() }, { status: 400 });

  if (!process.env.IT_SUPPORT_ADMIN_TOKEN) {
    return NextResponse.json({ error: "ยังไม่ได้กำหนด IT_SUPPORT_ADMIN_TOKEN ในไฟล์ .env" }, { status: 503 });
  }
  if (!matchesAdminToken(parsed.data.adminToken)) {
    return NextResponse.json({ error: "รหัสผู้ดูแลระบบไม่ถูกต้อง" }, { status: 403 });
  }

  await writeSystemEnv(parsed.data);
  await recordAudit({
    action: "settings.env.updated",
    entityType: "SystemSettings",
    metadata: { allowedNetworks: parsed.data.allowedNetworks, intervalMinutes: parsed.data.intervalMinutes, demoMode: parsed.data.demoMode },
  });
  return NextResponse.json({ message: "บันทึกไฟล์ .env แล้ว กรุณารีสตาร์ตเซิร์ฟเวอร์เพื่อให้ค่ามีผล" });
}
