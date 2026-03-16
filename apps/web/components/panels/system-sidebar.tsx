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
    group: "Core Surfaces",
    label: "Tasks",
    description: "Queue command requests and monitor run activation.",
  },
  {
    group: "Core Surfaces",
    label: "Agents",
    description: "Inspect routing posture and active specialist selection.",
  },
  {
    group: "Core Surfaces",
    label: "Execution Trace",
    description: "Review public orchestration events returned by the backend.",
  },
  {
    group: "Runtime",
    label: "Model Router",
    description: "Track the inferred model route and provider posture.",
  },
  {
    group: "Runtime",
    label: "System State",
    description: "See whether the console is idle, live, or awaiting response.",
  },
];

type NavSection = (typeof navSections)[number];

export function SystemSidebar({
  latestRun,
}: {
  latestRun: ChatResponse | null;
}) {
  const navGroups = navSections.reduce<
    Array<{ group: string; items: NavSection[] }>
  >((acc, section) => {
    const existing = acc.find((group) => group.group === section.group);
    if (existing) {
      existing.items.push(section);
      return acc;
    }

    acc.push({
      group: section.group,
      items: [section],
    });

    return acc;
  }, []);

  return (
    <aside className="cortex-sidebar-panel">
      <div className="cortex-sidebar-header">
        <p className="section-title">System Navigation</p>
        <h2 className="cortex-sidebar-title">Console Rail</h2>
        <p className="cortex-sidebar-copy">
          Persistent navigation for the cognitive console. The rail stays stable
          while the command surface and inspector update per run on Ridian OS.
        </p>
      </div>

      <div className="cortex-sidebar-meta">
        <span className="cortex-chip subdued">Persistent rail</span>
        <span className="cortex-chip subdued">Operator context</span>
      </div>

      <nav className="cortex-sidebar-nav" aria-label="System navigation">
        {navGroups.map((group) => (
          <details key={group.group} className="cortex-nav-group" open>
            <summary className="cortex-accordion-summary">
              <p className="nav-group-title">{group.group}</p>
              <span className="cortex-chip subdued">{group.items.length} nodes</span>
            </summary>
            <div className="cortex-nav-group-list">
              {group.items.map((section, index) => (
                <div
                  key={section.label}
                  className={`cortex-nav-card${section.label === "Tasks" ? " active" : ""}`}
                >
                  <div className="cortex-nav-topline">
                    <span className="cortex-nav-index">0{index + 1}</span>
                    <span className="cortex-nav-label">{section.label}</span>
                  </div>
                  <p className="cortex-nav-copy">{section.description}</p>
                </div>
              ))}
            </div>
          </details>
        ))}
      </nav>

      <div className="cortex-sidebar-status">
        <p className="cortex-nav-group-label">Live Status</p>
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
