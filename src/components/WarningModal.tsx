interface Props {
  open: boolean;
  reason: string;
  violations: number;
  maxViolations: number;
  onAcknowledge: () => void;
}

export default function WarningModal({
  open,
  reason,
  violations,
  maxViolations,
  onAcknowledge
}: Props) {
  if (!open) return null;

  return (
    <div style={backdrop}>
      <div style={modal}>
        <h2>⚠️ Rule Violation Detected</h2>

        <p>
          <strong>Reason:</strong> {reason}
        </p>

        <p>
          Attempts remaining:{" "}
          <strong>{maxViolations - violations}</strong>
        </p>

        <button onClick={onAcknowledge}>
          I Understand – Resume Test
        </button>
      </div>
    </div>
  );
}

const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: "8px",
  width: "400px",
  textAlign: "center"
};