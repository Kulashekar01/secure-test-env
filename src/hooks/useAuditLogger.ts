import type { AuditEvent, AuditEventType } from "../types/audit";
import { appendLog, isSubmitted } from "../services/logService";

export function useAuditLogger(attemptId: string) {
  const logEvent = (
    eventType: AuditEventType,
    metadata: Record<string, any> = {}
  ) => {
    if (isSubmitted()) return;

    const event: AuditEvent = {
      id: crypto.randomUUID(),
      eventType,
      timestamp: Date.now(),
      attemptId,
      metadata
    };

    console.log("[Audit] Logging event:", eventType, metadata);
    appendLog(event);
  };

  return { logEvent };
}