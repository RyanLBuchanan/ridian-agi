import { AgentFlowVisualization } from "@/components/panels/agent-flow-visualization";
import type {
  ChatExecutionMode,
  ChatPlanStep,
  ChatResponse,
} from "@/lib/types";

function formatExecutionMode(mode: ChatExecutionMode | undefined): string {
  if (!mode) {
    return "Awaiting run";
  }

  return mode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatPlanStatus(status: ChatPlanStep["status"]): string {
  if (status === "next") {
    return "Next";
  }
  if (status === "later") {
    return "Later";
  }
  return "Ready";
}

function inferSelectedModel(latestRun: ChatResponse | null): string {
  if (!latestRun) {
    return "Awaiting model route";
  }

  if (latestRun.selectedModel) {
    return latestRun.selectedModel;
  }

  const modelTraceEntry = latestRun.trace?.find((item) =>
    item.includes("model="),
  );
  if (!modelTraceEntry) {
    return "Not surfaced by backend";
  }

  const match = modelTraceEntry.match(/model=([^\s]+)/);
  return match?.[1] ?? "Not surfaced by backend";
}

export function ExecutionInspector({
  latestRun,
  isLoading,
  requestError,
}: {
  latestRun: ChatResponse | null;
  isLoading: boolean;
  requestError: string | null;
}) {
  const planSteps = latestRun?.plan?.structuredSteps ?? [];
  const fallbackPlan = latestRun?.plan?.steps ?? [];

  return (
    <aside className="cortex-inspector-panel">
      <div className="cortex-inspector-header">
        <div>
          <p className="section-title">Execution Inspector</p>
          <h2 className="cortex-sidebar-title">Run Telemetry</h2>
          <p className="cortex-sidebar-copy">
            Structured execution data from the FastAPI orchestrator is rendered
            here after each submitted task in the Ridian OS console surface.
          </p>
        </div>
        <span className="cortex-chip subdued">
          {latestRun?.runId ? latestRun.runId : "No run yet"}
        </span>
      </div>

      <AgentFlowVisualization
        latestRun={latestRun}
        isLoading={isLoading}
        requestError={requestError}
      />

      <div className="cortex-inspector-grid">
        <div className="cortex-inspector-card">
          <span className="stat-label">Selected Agent</span>
          <span className="cortex-inspector-value">
            {latestRun?.selectedAgent ?? "Awaiting route"}
          </span>
        </div>
        <div className="cortex-inspector-card">
          <span className="stat-label">Selected Model</span>
          <span className="cortex-inspector-value">
            {inferSelectedModel(latestRun)}
          </span>
        </div>
        <div className="cortex-inspector-card">
          <span className="stat-label">Execution Mode</span>
          <span className="cortex-inspector-value">
            {formatExecutionMode(latestRun?.executionMode)}
          </span>
        </div>
      </div>

      <section className="cortex-detail-block">
        <div className="cortex-detail-header">
          <p className="section-title">Step Plan</p>
          <span className="cortex-chip subdued">
            {planSteps.length > 0 || fallbackPlan.length > 0
              ? "Visualized"
              : "Pending"}
          </span>
        </div>
        {planSteps.length > 0 ? (
          <ol className="cortex-plan-list">
            {planSteps.map((step, index) => (
              <li key={`${step.title}-${index}`} className="cortex-plan-item">
                <div className="cortex-plan-topline">
                  <span className="cortex-plan-index">{index + 1}</span>
                  <div>
                    <div className="cortex-plan-title">{step.title}</div>
                    <div className="cortex-plan-copy">{step.detail}</div>
                  </div>
                  <span className={`cortex-plan-status ${step.status}`}>
                    {formatPlanStatus(step.status)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        ) : fallbackPlan.length > 0 ? (
          <ol className="cortex-plan-list fallback">
            {fallbackPlan.map((step, index) => (
              <li key={`${step}-${index}`} className="cortex-plan-item simple">
                <div className="cortex-plan-topline">
                  <span className="cortex-plan-index">{index + 1}</span>
                  <div className="cortex-plan-title">{step}</div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="cortex-empty-state">
            Submit a task to populate the visual execution plan returned by the
            orchestrator.
          </div>
        )}
      </section>

      <section className="cortex-detail-block">
        <div className="cortex-detail-header">
          <p className="section-title">Trace Output</p>
          <span className="cortex-chip subdued">
            {latestRun?.trace?.length
              ? `${latestRun.trace.length} events`
              : "Idle"}
          </span>
        </div>
        {latestRun?.trace && latestRun.trace.length > 0 ? (
          <ul className="cortex-trace-list">
            {latestRun.trace.map((item, index) => (
              <li key={`${item}-${index}`} className="cortex-trace-item">
                <span className="cortex-trace-bullet" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="cortex-empty-state">
            Public trace events will stream into this inspector after the first
            successful backend response.
          </div>
        )}
      </section>

      <section className="cortex-detail-block emphasis">
        <p className="section-title">Trace Summary</p>
        <p className="cortex-summary-copy">
          {latestRun?.traceSummary ??
            "The execution inspector is waiting for a run summary from the orchestrator."}
        </p>
      </section>
    </aside>
  );
}
