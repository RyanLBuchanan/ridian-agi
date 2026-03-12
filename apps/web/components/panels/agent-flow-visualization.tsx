import type { ChatExecutionMode, ChatResponse } from "@/lib/types";

type FlowStatus = "idle" | "active" | "complete" | "stalled";

type FlowStage = {
  id: string;
  label: string;
  title: string;
  detail: string;
  status: FlowStatus;
  footing: "real" | "inferred";
};

function hasTraceStep(trace: string[] | undefined, stepName: string): boolean {
  return Boolean(
    trace?.some((item) => item.startsWith(`${stepName}:`) || item === stepName),
  );
}

function inferSelectedModel(latestRun: ChatResponse | null): string | null {
  if (!latestRun) {
    return null;
  }

  if (latestRun.selectedModel) {
    return latestRun.selectedModel;
  }

  const modelTraceEntry = latestRun.trace?.find((item) =>
    item.includes("model="),
  );
  const match = modelTraceEntry?.match(/model=([^\s]+)/);
  return match?.[1] ?? null;
}

function formatExecutionMode(mode: ChatExecutionMode | undefined): string {
  if (!mode) {
    return "Awaiting route";
  }

  return mode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function deriveFlowStages(
  latestRun: ChatResponse | null,
  isLoading: boolean,
  hasError: boolean,
): FlowStage[] {
  const trace = latestRun?.trace ?? [];
  const selectedModel = inferSelectedModel(latestRun);
  const taskReceived =
    isLoading ||
    Boolean(latestRun?.runId) ||
    hasTraceStep(trace, "run_started") ||
    hasTraceStep(trace, "input_received");
  const agentSelected =
    Boolean(latestRun?.selectedAgent) ||
    hasTraceStep(trace, "agent_consulted") ||
    hasTraceStep(trace, "agent_selected");
  const modelRouted =
    Boolean(selectedModel) ||
    hasTraceStep(trace, "model_completed") ||
    hasTraceStep(trace, "execution_mode_selected");
  const responseReturned =
    Boolean(latestRun?.response) && !isLoading && !hasError;
  const executionComplete =
    hasTraceStep(trace, "response_verified") ||
    hasTraceStep(trace, "memory_updated") ||
    responseReturned;

  return [
    {
      id: "task-received",
      label: "01",
      title: "Task Received",
      detail: taskReceived
        ? latestRun?.runId
          ? `Run ${latestRun.runId.slice(0, 8)} acknowledged by the orchestrator.`
          : "Submission is entering the orchestration spine."
        : "Waiting for the next operator task.",
      status:
        hasError && !taskReceived
          ? "stalled"
          : taskReceived
            ? "complete"
            : "idle",
      footing:
        hasTraceStep(trace, "run_started") ||
        hasTraceStep(trace, "input_received")
          ? "real"
          : "inferred",
    },
    {
      id: "planner-agent",
      label: "02",
      title: "Planner Agent",
      detail: agentSelected
        ? `${latestRun?.selectedAgent ?? "Planner posture established"} via ${formatExecutionMode(latestRun?.executionMode)}.`
        : isLoading
          ? "Selecting the orchestration posture and specialist agent."
          : "Planner selection will appear when a run is active.",
      status:
        hasError && !agentSelected
          ? "stalled"
          : agentSelected
            ? "complete"
            : isLoading
              ? "active"
              : "idle",
      footing:
        Boolean(latestRun?.selectedAgent) ||
        hasTraceStep(trace, "agent_consulted") ||
        hasTraceStep(trace, "agent_selected")
          ? "real"
          : "inferred",
    },
    {
      id: "model-router",
      label: "03",
      title: "Model Router",
      detail: modelRouted
        ? `${selectedModel ?? "Model route inferred from execution trace"}.`
        : isLoading
          ? "Routing through the model layer and execution mode heuristics."
          : "Model route not yet surfaced.",
      status:
        hasError && !modelRouted
          ? "stalled"
          : modelRouted
            ? "complete"
            : isLoading
              ? "active"
              : "idle",
      footing:
        Boolean(latestRun?.selectedModel) ||
        hasTraceStep(trace, "model_completed")
          ? "real"
          : modelRouted
            ? "inferred"
            : "inferred",
    },
    {
      id: "execution-agent",
      label: "04",
      title: "Execution Agent",
      detail: executionComplete
        ? (latestRun?.traceSummary ?? "Execution completed and verified.")
        : isLoading
          ? "Execution is in progress across the active orchestration path."
          : hasError
            ? "Execution halted before completion."
            : "Execution state will activate once the backend returns telemetry.",
      status: hasError
        ? "stalled"
        : executionComplete
          ? "complete"
          : isLoading
            ? "active"
            : "idle",
      footing:
        hasTraceStep(trace, "response_verified") ||
        hasTraceStep(trace, "memory_updated")
          ? "real"
          : isLoading || executionComplete
            ? "inferred"
            : "inferred",
    },
    {
      id: "response-returned",
      label: "05",
      title: "Response Returned",
      detail: responseReturned
        ? "Final response has been returned to the command surface and inspector."
        : hasError
          ? "No response returned because the orchestration request failed."
          : isLoading
            ? "Awaiting response payload from the backend."
            : "Response output will land here after a successful run.",
      status: hasError
        ? "stalled"
        : responseReturned
          ? "complete"
          : isLoading
            ? "active"
            : "idle",
      footing: responseReturned ? "real" : "inferred",
    },
  ];
}

export function AgentFlowVisualization({
  latestRun,
  isLoading,
  requestError,
}: {
  latestRun: ChatResponse | null;
  isLoading: boolean;
  requestError: string | null;
}) {
  const stages = deriveFlowStages(latestRun, isLoading, Boolean(requestError));

  return (
    <section className="cortex-detail-block cortex-flow-block">
      <div className="cortex-detail-header">
        <div>
          <p className="section-title">Live Agent Visualization</p>
          <p className="cortex-summary-copy">
            Planner Agent to response flow, derived from live orchestration
            telemetry.
          </p>
        </div>
        <span className="cortex-chip subdued">
          {isLoading ? "Live" : latestRun?.runId ? "Recorded" : "Standby"}
        </span>
      </div>

      <div className="cortex-flow-rail" aria-label="Live orchestration flow">
        {stages.map((stage, index) => (
          <div key={stage.id} className={`cortex-flow-stage ${stage.status}`}>
            <div className="cortex-flow-node-wrap">
              <div className={`cortex-flow-node ${stage.status}`}>
                <span className="cortex-flow-node-label">{stage.label}</span>
              </div>
              {index < stages.length - 1 ? (
                <div
                  className={`cortex-flow-connector ${stage.status}`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className="cortex-flow-card">
              <div className="cortex-flow-card-topline">
                <h3 className="cortex-flow-title">{stage.title}</h3>
                <span className={`cortex-flow-footing ${stage.footing}`}>
                  {stage.footing}
                </span>
              </div>
              <p className="cortex-flow-copy">{stage.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {requestError ? (
        <div className="cortex-inline-state error" role="alert">
          {requestError}
        </div>
      ) : null}
    </section>
  );
}
