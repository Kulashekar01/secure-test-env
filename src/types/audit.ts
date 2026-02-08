export type AuditEventType =
  | "FULLSCREEN_REQUESTED"
  | "FULLSCREEN_ENTERED"
  | "FULLSCREEN_EXITED"
  | "TAB_SWITCH"
  | "WINDOW_BLUR"
  | "WINDOW_FOCUS"
  | "COPY_ATTEMPT"
  | "PASTE_ATTEMPT"
  | "VIOLATION"
  | "TEST_TERMINATED";

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  timestamp: number;
  attemptId: string;
  metadata?: Record<string, any>;
}