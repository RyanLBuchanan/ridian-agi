export function ToolsPanel() {
  return (
    <section className="card panel-shell">
      <div className="panel-header">
        <div>
          <p className="section-title">Tools</p>
          <p className="panel-copy text-sm muted">
            Tool access is governed by the safety wall. This panel is
            intentionally informative in the current phase so the demo shows
            governed capability without pretending to be fully interactive.
          </p>
        </div>
        <span className="pill">Governed</span>
      </div>
      <ul className="panel-list">
        <li className="panel-item">
          <div className="text-sm">File Read</div>
          <div className="text-xs muted">
            Moderate risk, enabled by default.
          </div>
        </li>
        <li className="panel-item">
          <div className="text-sm">Project File List</div>
          <div className="text-xs muted">Low risk, enabled by default.</div>
        </li>
        <li className="panel-item">
          <div className="text-sm">Shell Command</div>
          <div className="text-xs muted">
            Critical risk, disabled by default and approval-gated.
          </div>
        </li>
      </ul>
      <div className="panel-note">
        Placeholder state: a later pass can show live tool decisions and
        approval posture per run. The registry and permission wall behind this
        panel are already implemented.
      </div>
    </section>
  );
}
