const navItems = [
  "Command Center",
  "Memory",
  "Plans",
  "Tools",
  "Agents",
  "Runs",
  "Settings",
];

export function LeftNav() {
  return (
    <aside className="panel left">
      <p className="section-title">Workspace</p>
      <div style={{ display: "grid", gap: 8 }}>
        {navItems.map((item) => (
          <div key={item} className="card text-sm">
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}
