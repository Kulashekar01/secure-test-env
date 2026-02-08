import type { AuditEvent, AuditEventType } from "../types/audit";

const STORAGE_KEY = "audit_logs";

export function useAuditLogger(attemptId: string) {
  const logEvent = (
    eventType: AuditEventType,
    metadata: Record<string, any> = {}
  ) => {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      eventType,
      timestamp: Date.now(),
      attemptId,
      metadata
    };

    const existing =
      JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as AuditEvent[];

    existing.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  };

  const getLogs = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as AuditEvent[];

  const clearLogs = () => localStorage.removeItem(STORAGE_KEY);

  return { logEvent, getLogs, clearLogs };
}