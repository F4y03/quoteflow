import { NextResponse } from "next/server";
import { recordAudit } from "../../../../lib/it-support/audit";
import { diagnosticRequestSchema } from "../../../../lib/it-support/validation";
export async function POST(request: Request) { const parsed = diagnosticRequestSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง", details: parsed.error.flatten() }, { status: 400 }); await recordAudit({ action: "diagnostic.requested", entityType: "Diagnostic", metadata: parsed.data }); return NextResponse.json({ mode: "demo", message: "API รับคำขอแล้ว แต่ยังไม่รันคำสั่งบนเครื่องจริง", target: parsed.data.target }); }
