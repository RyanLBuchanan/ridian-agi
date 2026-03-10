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
    <div className="card">
      <p className="section-title">Command Surface</p>
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
          Send
        </button>
      </div>
    </div>
  );
}
