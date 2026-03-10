import type { ChatPlanStep, ChatResponse } from "@/lib/types";

function formatPlanStatus(status: ChatPlanStep["status"]): string {
  if (status === "next") {
    return "Next";
  }
  if (status === "later") {
    return "Later";
  }
  return "Ready";
}

export function PlansPanel({ latestRun }: { latestRun: ChatResponse | null }) {
  const planSteps = latestRun?.plan?.structuredSteps ?? [];
  const hasPlan = planSteps.length > 0;

  return (
    <section className="card panel-shell">
      <div className="panel-header">
        <div>
          <p className="section-title">Plans</p>
          <p className="panel-copy text-sm muted">
            Builder-oriented runs can surface a modest structured plan here so
            the workspace behaves like planning intelligence, not only chat.
          </p>
        </div>
        <span className="pill">{hasPlan ? "Live plan" : "Structured"}</span>
      </div>
      {hasPlan ? (
        <>
          <div className="panel-note premium-note">
            {latestRun?.plan?.summary ??
              "A builder plan was prepared for the latest run."}
          </div>
          <ul className="panel-list plan-list">
            {planSteps.map((step, index) => (
              <li
                key={`${step.title}-${index}`}
                className="panel-item plan-item"
              >
                <div className="plan-item-topline">
                  <div className="text-sm">{step.title}</div>
                  <span className={`plan-status ${step.status}`}>
                    {formatPlanStatus(step.status)}
                  </span>
                </div>
                <div className="text-xs muted">{step.detail}</div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
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
            Placeholder state: a live plan appears here when the latest request
            is routed as a builder-style run.
          </div>
        </>
      )}
    </section>
  );
}
