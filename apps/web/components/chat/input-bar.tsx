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
          <p className="section-title">Task Input</p>
          <div className="text-sm muted">
            Type an objective, request a plan, or direct a builder-style task
            into the Ridian Cortex orchestration layer.
          </div>
        </div>
        <span className="pill">Backend Orchestrator</span>
      </div>
      <div className="row" style={{ alignItems: "stretch" }}>
        <input
          className="command-input"
          placeholder="Describe the task you want the Cortex console to route..."
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
          {disabled ? "Routing" : "Dispatch"}
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
