import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { InspectionReport } from "./inspection";
const reportPath = path.join(process.cwd(), "data", "it-support-reports.json");
async function readReports(): Promise<InspectionReport[]> { try { const value = JSON.parse(await readFile(reportPath, "utf8")); return Array.isArray(value) ? value : []; } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; } }
async function writeReports(reports: InspectionReport[]) { await mkdir(path.dirname(reportPath), { recursive: true }); await writeFile(reportPath, JSON.stringify(reports, null, 2), { encoding: "utf8", mode: 0o600 }); }
export async function listReports() { return readReports(); }
export async function saveReport(report: InspectionReport) { const reports = [report, ...(await readReports())].slice(0, 100); await writeReports(reports); return report; }
export async function deleteReport(id: string) { const reports = await readReports(); const next = reports.filter((report) => report.id !== id); await writeReports(next); return next.length !== reports.length; }
