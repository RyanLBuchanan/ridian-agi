const navSections = [
  {
    title: "Core",
    items: [
      {
        label: "Command Center",
        copy: "Primary conversation and orchestration surface.",
        active: true,
      },
      {
        label: "Memory",
        copy: "Session, preference, project, and episode context.",
      },
      {
        label: "Plans",
        copy: "Emerging execution steps and task structure.",
      },
    ],
  },
  {
    title: "Systems",
    items: [
      {
        label: "Tools",
        copy: "Governed capabilities behind the safety wall.",
      },
      {
        label: "Agents",
        copy: "Specialist routing profiles for different kinds of work.",
      },
      {
        label: "Runs",
        copy: "Execution traces, audit posture, and outcomes.",
      },
    ],
  },
  {
    title: "Controls",
    items: [
      {
        label: "Settings",
        copy: "Future configuration for memory, policy, and routing.",
      },
    ],
  },
];

export function LeftNav() {
  return (
    <aside className="panel left">
      <div className="nav-section">
        <p className="section-title">Workspace Rail</p>
        <div className="meta-list">
          <span className="pill">Persistent Navigation</span>
          <span className="pill">Ridian Cortex</span>
        </div>
        {navSections.map((section) => (
          <div key={section.title} className="nav-section">
            <p className="nav-group-title">{section.title}</p>
            <div style={{ display: "grid", gap: 8 }}>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className={`nav-item${item.active ? " active" : ""}`}
                >
                  <div className="nav-item-label">{item.label}</div>
                  <div className="nav-item-copy">{item.copy}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
