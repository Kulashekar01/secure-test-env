import { useEffect } from "react";
import { useAuditLogger } from "./useAuditLogger";

export function useClipboardBlocker(
  onViolation: (reason: string) => void
) {
  const { logEvent } = useAuditLogger("ATTEMPT_001");

  useEffect(() => {
    const block = (
      e: ClipboardEvent,
      type: "COPY_ATTEMPT" | "PASTE_ATTEMPT"
    ) => {
      e.preventDefault();
      logEvent(type);
      onViolation(type === "COPY_ATTEMPT" ? "Copy attempt" : "Paste attempt");
    };

    const onCopy = (e: ClipboardEvent) => block(e, "COPY_ATTEMPT");
    const onPaste = (e: ClipboardEvent) => block(e, "PASTE_ATTEMPT");

    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);

    return () => {
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onPaste);
    };
  }, []);
}