export function MemoryPanel() {
  return (
    <section className="card panel-shell">
      <div className="panel-header">
        <div>
          <p className="section-title">Memory</p>
          <p className="panel-copy text-sm muted">
            Session, project, preference, and episode memory are framed here so
            the demo suggests where retrieval-backed state will surface next.
          </p>
        </div>
        <span className="pill">Disciplined</span>
      </div>
      <ul className="panel-list">
        <li className="panel-item">
          <div className="text-sm">Current Session</div>
          <div className="text-xs muted">
            Temporary context, next steps, and active constraints.
          </div>
        </li>
        <li className="panel-item">
          <div className="text-sm">Project Memory</div>
          <div className="text-xs muted">
            Stable architecture facts, conventions, and durable implementation
            notes.
          </div>
        </li>
        <li className="panel-item">
          <div className="text-sm">User Preferences</div>
          <div className="text-xs muted">
            Communication style and durable collaboration preferences.
          </div>
        </li>
      </ul>
      <div className="panel-note">
        Placeholder state: retrieval-backed memory cards are not rendered yet,
        but the backend memory discipline and write policy are already real.
      </div>
    </section>
  );
}
