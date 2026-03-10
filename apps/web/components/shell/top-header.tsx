export function TopHeader() {
  return (
    <header className="panel header">
      <div className="row">
        <div className="brand-mark">R</div>
        <div className="brand-stack">
          <div className="text-xs muted">Ridian Technologies</div>
          <h1 className="header-title">Little Ridian AGI</h1>
          <p className="header-copy">
            Elegant workspace intelligence for memory, planning, and controlled
            execution.
          </p>
        </div>
      </div>
      <div className="header-actions">
        <span className="status-pill">
          <span className="status-dot" />
          Safety Wall Active
        </span>
        <span className="pill">Single-User v1</span>
        <span className="pill">Trace-Aware</span>
      </div>
    </header>
  );
}
