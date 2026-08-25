import type { DeviceStatus, Severity } from "../_lib/types";

const labels: Record<DeviceStatus | Severity, string> = { online: "ออนไลน์", offline: "ออฟไลน์", warning: "เตือน", info: "ข้อมูล", critical: "วิกฤต", success: "ผ่าน" };
export function StatusBadge({ status }: { status: DeviceStatus | Severity }) { return <span className={`its-status its-status-${status}`}><span aria-hidden="true">●</span>{labels[status]}</span>; }
