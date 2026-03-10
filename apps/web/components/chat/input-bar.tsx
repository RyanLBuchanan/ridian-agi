export function InputBar({
  value,
  disabled,
  onChange,
  onSubmit,
  suggestions,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  suggestions: string[];
}) {
  return (
    <div className="card command-card">
      <div className="command-toolbar">
        <div>
          <p className="section-title">Command Surface</p>
          <div className="text-sm muted">
            Ask directly, shape a plan, inspect context, or route toward a
            specialist agent without leaving the orchestration console.
          </div>
        </div>
        <span className="pill">Single-turn demo flow</span>
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
      <div className="suggestion-row">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="suggestion-chip"
            disabled={disabled}
            onClick={() => onChange(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
