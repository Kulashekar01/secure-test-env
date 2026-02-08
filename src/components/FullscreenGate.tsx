import { useEffect } from "react";
import { useAuditLogger } from "../hooks/useAuditLogger";

interface Props {
  onViolation: (reason: string) => void;
}

export default function FullscreenGate({ onViolation }: Props) {
  const { logEvent } = useAuditLogger("ATTEMPT_001");

  const requestFullscreen = async () => {
    logEvent("FULLSCREEN_REQUESTED");
    await document.documentElement.requestFullscreen();
  };

  useEffect(() => {
    const handler = () => {
      const active = !!document.fullscreenElement;
      logEvent(active ? "FULLSCREEN_ENTERED" : "FULLSCREEN_EXITED");

      if (!active) {
        onViolation("Exited fullscreen mode");
      }
    };

    document.addEventListener("fullscreenchange", handler);
    return () =>
      document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!document.fullscreenElement) {
    return (
      <div style={overlayStyle}>
        <h2>Fullscreen Required</h2>
        <button onClick={requestFullscreen}>Start Test</button>
      </div>
    );
  }

  return null;
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "#000",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};
