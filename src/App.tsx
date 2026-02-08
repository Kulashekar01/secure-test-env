import { useState } from "react";
import FullscreenGate from "./components/FullscreenGate";
import WarningModal from "./components/WarningModal";
import { MAX_VIOLATIONS } from "./config/constants";
import { useAuditLogger } from "./hooks/useAuditLogger";
import { useFocusBlocker } from "./hooks/useFocusBlocker";
import { useClipboardBlocker } from "./hooks/useClipboardBlocker";

export default function App() {
  const [violations, setViolations] = useState(0);
  const [warningOpen, setWarningOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [terminated, setTerminated] = useState(false);

  const { logEvent } = useAuditLogger("ATTEMPT_001");

  const handleViolation = (reason: string) => {
    logEvent("VIOLATION", { reason });

    setReason(reason);
    setViolations(v => v + 1);
    setWarningOpen(true);
  };

  const acknowledgeWarning = async () => {
    setWarningOpen(false);

    if (violations >= MAX_VIOLATIONS) {
      logEvent("TEST_TERMINATED");
      setTerminated(true);
      return;
    }

    // Force fullscreen re-entry
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  };

  useFocusBlocker(handleViolation);
  useClipboardBlocker(handleViolation);

  if (terminated) {
    return <h1>❌ Test Terminated Due to Violations</h1>;
  }

  return (
    <>
      <FullscreenGate onViolation={handleViolation} />

      <WarningModal
        open={warningOpen}
        reason={reason}
        violations={violations}
        maxViolations={MAX_VIOLATIONS}
        onAcknowledge={acknowledgeWarning}
      />

      <h2>Assessment Content (Mock)</h2>
      <p>This represents the test area.</p>
    </>
  );
}