import { AgentActivityPanel } from "@/components/panels/agent-activity-panel";
import { MemoryPanel } from "@/components/panels/memory-panel";
import { PlansPanel } from "@/components/panels/plans-panel";
import { ToolsPanel } from "@/components/panels/tools-panel";
import type { ChatResponse } from "@/lib/types";

export function RightContextPanel({
  latestRun,
}: {
  latestRun: ChatResponse | null;
}) {
  return (
    <aside className="panel right">
      <AgentActivityPanel latestRun={latestRun} />
      <div className="context-stack">
        <MemoryPanel />
        <PlansPanel latestRun={latestRun} />
        <ToolsPanel />
      </div>
    </aside>
  );
}
