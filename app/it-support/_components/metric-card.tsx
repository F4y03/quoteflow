import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "./status-badge";
import type { Severity } from "../_lib/types";
export function MetricCard({ icon: Icon, label, value, detail, severity }: { icon: LucideIcon; label: string; value: string; detail: string; severity: Severity }) { return <article className="its-metric"><div className="its-metric-icon"><Icon aria-hidden="true" size={21} /></div><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div><StatusBadge status={severity} /></article>; }
