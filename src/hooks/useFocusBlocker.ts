import { useEffect } from "react";
import { useAuditLogger } from "./useAuditLogger";

export function useFocusBlocker(onViolation: (reason: string) => void) {
  const { logEvent } = useAuditLogger("ATTEMPT_001");

  useEffect(() => {
    const onBlur = () => {
      logEvent("WINDOW_BLUR");
      logEvent("VIOLATION", { reason: "WINDOW_BLUR" });
      onViolation("Window lost focus");
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") {
        logEvent("TAB_SWITCH");
        logEvent("VIOLATION", { reason: "TAB_SWITCH" });
        onViolation("Tab switched");
      }
    };

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
}