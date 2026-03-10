export function PlansPanel() {
  return (
    <section className="card panel-shell">
      <div className="panel-header">
        <div>
          <p className="section-title">Plans</p>
          <p className="panel-copy text-sm muted">
            This column will eventually reflect decomposition, execution mode,
            and next-action structure from the orchestrator.
          </p>
        </div>
        <span className="pill">Structured</span>
      </div>
      <ul className="panel-list">
        <li className="panel-item">
          <div className="text-sm">Receive Request</div>
          <div className="text-xs muted">
            Capture intent and establish execution posture.
          </div>
        </li>
        <li className="panel-item">
          <div className="text-sm">Gather Context</div>
          <div className="text-xs muted">
            Consult memory, retrieval, agent registry, and tool policy.
          </div>
        </li>
        <li className="panel-item">
          <div className="text-sm">Assemble Response</div>
          <div className="text-xs muted">
            Shape the reply, verify output, and return trace metadata.
          </div>
        </li>
      </ul>
      <div className="panel-note">
        Placeholder state: future versions can render per-run plan steps
        directly from the backend.
      </div>
    </section>
  );
}
