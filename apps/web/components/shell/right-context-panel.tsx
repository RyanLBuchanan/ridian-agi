import { AgentActivityPanel } from "@/components/panels/agent-activity-panel";
import { MemoryPanel } from "@/components/panels/memory-panel";
import { PlansPanel } from "@/components/panels/plans-panel";
import { ToolsPanel } from "@/components/panels/tools-panel";

export function RightContextPanel() {
  return (
    <aside className="panel right">
      <div style={{ display: "grid", gap: 12 }}>
        <MemoryPanel />
        <PlansPanel />
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <ToolsPanel />
        <AgentActivityPanel />
      </div>
    </aside>
  );
}
