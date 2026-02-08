import { useEffect, useState } from "react";
import FullscreenGate from "./components/FullscreenGate";
import WarningModal from "./components/WarningModal";
import { MAX_VIOLATIONS } from "./config/constants";
import { useAuditLogger } from "./hooks/useAuditLogger";
import { useFocusBlocker } from "./hooks/useFocusBlocker";
import { useClipboardBlocker } from "./hooks/useClipboardBlocker";
import { flushLogsAndLock, useLogBatcher } from "./hooks/useLogBatcher";
import { resetSubmitted } from "./services/logService";

export default function App() {
  const [violations, setViolations] = useState(0);
  const [warningOpen, setWarningOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [terminated, setTerminated] = useState(false);

  const { logEvent } = useAuditLogger("ATTEMPT_001");

  // 🔹 ALL hooks must be here (before any return)
  useLogBatcher(!terminated);
  useFocusBlocker(handleViolation);
  useClipboardBlocker(handleViolation);

  useEffect(() => {
    resetSubmitted();
  }, []);

  useEffect(() => {
    logEvent("FULLSCREEN_REQUESTED");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // SINGLE termination entry point
  const terminateTest = async () => {
    logEvent("TEST_TERMINATED");
    await flushLogsAndLock();
    setTerminated(true);
  };

  function handleViolation(reason: string) {
    logEvent("VIOLATION", { reason });

    setReason(reason);
    setViolations((v) => v + 1);
    setWarningOpen(true);
  }

  const acknowledgeWarning = async () => {
    setWarningOpen(false);

    if (violations >= MAX_VIOLATIONS) {
      await terminateTest();
      return;
    }

    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  };

  // 🔹 conditional return comes LAST
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