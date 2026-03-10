import type { ChatExecutionMode, ChatResponse } from "@/lib/types";

function formatExecutionMode(mode: ChatExecutionMode | undefined): string {
  if (!mode) {
    return "Awaiting run";
  }

  return mode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AgentActivityPanel({
  latestRun,
}: {
  latestRun: ChatResponse | null;
}) {
  return (
    <section className="card panel-shell">
      <div className="panel-header">
        <div>
          <p className="section-title">Run Context</p>
          <p className="panel-copy text-sm muted">
            The context rail keeps the latest run legible during a demo without
            competing with the main conversation.
          </p>
        </div>
        <span className="pill">Observed</span>
      </div>
      <div className="context-kpi-grid">
        <div className="context-kpi-card">
          <span className="run-kpi-label">Execution Mode</span>
          <span className="run-kpi-value">
            {formatExecutionMode(latestRun?.executionMode)}
          </span>
        </div>
        <div className="context-kpi-card">
          <span className="run-kpi-label">Selected Agent</span>
          <span className="run-kpi-value">
            {latestRun?.selectedAgent ?? "Awaiting route"}
          </span>
        </div>
        <div className="context-kpi-card">
          <span className="run-kpi-label">Run ID</span>
          <span className="run-kpi-value">{latestRun?.runId ?? "Pending"}</span>
        </div>
      </div>
      <div className="panel-note premium-note">
        {latestRun?.traceSummary
          ? latestRun.traceSummary
          : "Trace summary will appear after the first successful run."}
      </div>
      <div className="meta-card">
        <p className="section-title">Trace / Activity</p>
        {latestRun?.trace && latestRun.trace.length > 0 ? (
          <ul className="trace-list compact-trace-list">
            {latestRun.trace.slice(0, 5).map((item) => (
              <li key={item} className="trace-item text-xs muted">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="panel-note">
            Live streaming activity remains placeholder. The current demo shows
            the latest recorded trace steps only when the backend returns them.
          </div>
        )}
      </div>
    </section>
  );
}
