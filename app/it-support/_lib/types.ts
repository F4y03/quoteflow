export type DeviceStatus = "online" | "offline" | "warning";
export type Severity = "info" | "warning" | "critical" | "success";

export interface Device { id: string; hostname: string; user: string; ip: string; mac: string; os: string; cpu: number; ram: number; disk: number; status: DeviceStatus; lastSeen: string; gateway: string; dns: string; uptime: string; }
export interface DiagnosticStep { id: string; title: string; detail: string; status: "pass" | "failed" | "pending"; }
export interface DiagnosticResult { target: string; steps: DiagnosticStep[]; diagnosis: string; confidence: number; commands: string[]; }
export interface PingResult { target: string; address: string; status: "online" | "offline"; sent: number; received: number; loss: number; average: number; min: number; max: number; }
export interface DnsResult { domain: string; responseTime: number; records: Array<{ type: string; value: string }> }
export interface PortResult { host: string; port: number; open: boolean; service: string; latency: number }
