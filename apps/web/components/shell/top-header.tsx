export function TopHeader() {
  return (
    <header className="panel header">
      <div>
        <div className="text-xs muted">Ridian Technologies</div>
        <h1 style={{ margin: "4px 0 0", fontSize: "1.1rem" }}>
          Little Ridian AGI
        </h1>
      </div>
      <div className="row">
        <span className="pill">Mode: Workspace Copilot</span>
        <span className="pill">Safety: On</span>
      </div>
    </header>
  );
}
