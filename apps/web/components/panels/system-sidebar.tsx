import type { ChatExecutionMode, ChatResponse } from "@/lib/types";

function formatExecutionMode(mode: ChatExecutionMode | undefined): string {
  if (!mode) {
    return "Standby";
  }

  return mode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const navSections = [
  {
    label: "Tasks",
    description: "Queue command requests and monitor run activation.",
  },
  {
    label: "Agents",
    description: "Inspect routing posture and active specialist selection.",
  },
  {
    label: "Execution Trace",
    description: "Review public orchestration events returned by the backend.",
  },
  {
    label: "Model Router",
    description: "Track the inferred model route and provider posture.",
  },
  {
    label: "System State",
    description: "See whether the console is idle, live, or awaiting response.",
  },
];

export function SystemSidebar({
  latestRun,
}: {
  latestRun: ChatResponse | null;
}) {
  return (
    <aside className="cortex-sidebar-panel">
      <div className="cortex-sidebar-header">
        <p className="section-title">System Navigation</p>
        <h2 className="cortex-sidebar-title">Console Rail</h2>
        <p className="cortex-sidebar-copy">
          Persistent navigation for the cognitive console. The rail stays stable
          while the command surface and inspector update per run.
        </p>
      </div>

      <nav className="cortex-sidebar-nav" aria-label="System navigation">
        {navSections.map((section, index) => (
          <div
            key={section.label}
            className={`cortex-nav-card${index === 0 ? " active" : ""}`}
          >
            <div className="cortex-nav-topline">
              <span className="cortex-nav-index">0{index + 1}</span>
              <span className="cortex-nav-label">{section.label}</span>
            </div>
            <p className="cortex-nav-copy">{section.description}</p>
          </div>
        ))}
      </nav>

      <div className="cortex-sidebar-status">
        <div className="cortex-sidebar-stat">
          <span className="stat-label">Execution Mode</span>
          <span className="cortex-sidebar-value">
            {formatExecutionMode(latestRun?.executionMode)}
          </span>
        </div>
        <div className="cortex-sidebar-stat">
          <span className="stat-label">Active Agent</span>
          <span className="cortex-sidebar-value">
            {latestRun?.selectedAgent ?? "Awaiting route"}
          </span>
        </div>
        <div className="cortex-sidebar-stat">
          <span className="stat-label">System State</span>
          <span className="cortex-sidebar-value">
            {latestRun?.runId ? "Live orchestration" : "Idle and listening"}
          </span>
        </div>
      </div>
    </aside>
  );
}
