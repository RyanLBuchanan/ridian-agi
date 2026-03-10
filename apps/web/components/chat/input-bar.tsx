export function InputBar({
  value,
  disabled,
  onChange,
  onSubmit,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="card command-card">
      <div className="command-toolbar">
        <div>
          <p className="section-title">Command Surface</p>
          <div className="text-sm muted">
            Ask directly, shape a plan, inspect context, or route toward a
            specialist agent.
          </div>
        </div>
        <span className="pill">Single turn orchestration</span>
      </div>
      <div className="row" style={{ alignItems: "stretch" }}>
        <input
          className="command-input"
          placeholder="Ask, plan, or delegate work..."
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
        />
        <button
          type="button"
          className="primary-btn"
          disabled={disabled}
          onClick={onSubmit}
        >
          {disabled ? "Working" : "Send"}
        </button>
      </div>
    </div>
  );
}
