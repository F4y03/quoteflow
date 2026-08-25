export type AuditEvent = { action: string; entityType: string; entityId?: string; actorId?: string; metadata?: Record<string, unknown> };
export async function recordAudit(event: AuditEvent) { console.info("[it-support:audit]", JSON.stringify({ ...event, occurredAt: new Date().toISOString() })); }
