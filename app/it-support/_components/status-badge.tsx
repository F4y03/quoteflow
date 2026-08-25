import type { DeviceStatus, Severity } from "../_lib/types";

const labels: Record<DeviceStatus | Severity, string> = { online: "ONLINE", offline: "OFFLINE", warning: "WARNING", info: "INFO", critical: "CRITICAL", success: "PASS" };
export function StatusBadge({ status }: { status: DeviceStatus | Severity }) { return <span className={`its-status its-status-${status}`}><span aria-hidden="true">●</span>{labels[status]}</span>; }
