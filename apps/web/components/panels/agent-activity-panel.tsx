export function AgentActivityPanel() {
  return (
    <section className="card panel-shell">
      <div className="panel-header">
        <div>
          <p className="section-title">Trace / Activity</p>
          <p className="panel-copy text-sm muted">
            Agent consultation, selected execution mode, and trace activity will
            settle here as a more legible operational timeline.
          </p>
        </div>
        <span className="pill">Observed</span>
      </div>
      <ul className="panel-list">
        <li className="panel-item">
          <div className="text-sm">Current Execution Mode</div>
          <div className="text-xs muted">
            Displayed from the latest orchestrator response.
          </div>
        </li>
        <li className="panel-item">
          <div className="text-sm">Selected Agent</div>
          <div className="text-xs muted">
            Shows which agent profile shaped the latest response.
          </div>
        </li>
        <li className="panel-item">
          <div className="text-sm">Run Trace</div>
          <div className="text-xs muted">
            A compact activity summary with room for richer step-by-step
            inspection later.
          </div>
        </li>
      </ul>
      <div className="panel-note">
        Placeholder state: live streaming activity and expanded trace history
        can be added later.
      </div>
    </section>
  );
}
