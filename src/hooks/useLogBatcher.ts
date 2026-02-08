import { useEffect } from "react";
import {
  getStoredLogs,
  clearLogs,
  sendLogsBatch,
  markSubmitted
} from "../services/logService";

export function useLogBatcher(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    console.log("[Audit] Log batcher started (interval 5s)");

    const interval = setInterval(async () => {
      const logs = getStoredLogs();
      if (!logs.length) return;

      try {
        await sendLogsBatch(logs);
        clearLogs();
      } catch (err) {
        // keep logs locally if network fails
        console.error("[Audit] Failed to send logs batch", err);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      console.log("[Audit] Log batcher stopped");
    };
  }, [enabled]);
}

export async function flushLogsAndLock() {
  const logs = getStoredLogs();
  if (logs.length) {
    await sendLogsBatch(logs);
    clearLogs();
  }

  markSubmitted();
}