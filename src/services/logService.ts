import type { AuditEvent } from "../types/audit";

const STORAGE_KEY = "audit_logs";
const SUBMITTED_KEY = "logs_submitted";

const API_URL = import.meta.env.VITE_AUDIT_API_URL ?? "";

export function getStoredLogs(): AuditEvent[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function appendLog(event: AuditEvent) {
  if (isSubmitted()) return;

  const logs = getStoredLogs();
  logs.push(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  console.log("[Audit] Event stored:", event.eventType, event);
}

export async function sendLogsBatch(logs: AuditEvent[]) {
  if (!API_URL) {
    console.warn("[Audit] VITE_AUDIT_API_URL is not set – logs not sent. Add it to .env and restart the dev server.");
    return;
  }
  const url = `${API_URL.replace(/\/$/, "")}/auditLogs`;
  console.log("[Audit] Sending batch to", url, "count:", logs.length);

  const results = await Promise.all(
    logs.map(async (log) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
      if (!res.ok) {
        throw new Error(`Audit API error ${res.status}: ${res.statusText}`);
      }
      return res;
    })
  );
  console.log("[Audit] Batch sent successfully:", results.length, "events");
}

export function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
}

export function markSubmitted() {
  localStorage.setItem(SUBMITTED_KEY, "true");
}

export function isSubmitted(): boolean {
  return localStorage.getItem(SUBMITTED_KEY) === "true";
}

export function resetSubmitted() {
  localStorage.removeItem(SUBMITTED_KEY);
}