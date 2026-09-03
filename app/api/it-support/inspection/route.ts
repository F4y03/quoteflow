import { NextResponse } from "next/server";
import { inspectTarget } from "../../../../lib/it-support/inspection";
import { deleteReport, listReports, saveReport } from "../../../../lib/it-support/report-store";
export const runtime = "nodejs";
export async function GET() { return NextResponse.json({ reports: await listReports() }); }
export async function POST(request: Request) { try { const report = await inspectTarget(await request.json().catch(() => null) ?? {}); await saveReport(report); return NextResponse.json({ report }, { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "ตรวจสอบปลายทางไม่สำเร็จ" }, { status: 400 }); } }
export async function DELETE(request: Request) { const id = new URL(request.url).searchParams.get("id"); if (!id) return NextResponse.json({ error: "ไม่พบรหัสรายงาน" }, { status: 400 }); return NextResponse.json({ deleted: await deleteReport(id) }); }
