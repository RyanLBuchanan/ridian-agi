import { CommandSurface } from "@/components/chat/command-surface";
import { LeftNav } from "@/components/shell/left-nav";
import { RightContextPanel } from "@/components/shell/right-context-panel";
import { TopHeader } from "@/components/shell/top-header";

export function WorkspaceShell() {
  return (
    <main className="app-shell">
      <TopHeader />
      <LeftNav />
      <section className="panel main">
        <div className="shell-intro">
          <section className="intro-card">
            <div className="intro-eyebrow">Workspace Intelligence Layer</div>
            <h2 className="intro-title">
              Calm orchestration for thinking, building, and memory.
            </h2>
            <p className="intro-copy">
              Little Ridian AGI is designed as a restrained workspace-native
              system: clear enough for daily use, structured enough for serious
              implementation, and warm enough to feel like a trusted operating
              layer.
            </p>
          </section>
          <section className="card stats-card">
            <div className="stat-block">
              <span className="stat-label">Primary Mode</span>
              <span className="stat-value">Workspace Copilot</span>
            </div>
            <div className="stat-block">
              <span className="stat-label">Execution Posture</span>
              <span className="stat-value">
                Observed, traced, and restrained
              </span>
            </div>
            <div className="stat-block">
              <span className="stat-label">Current Phase</span>
              <span className="stat-value">Foundational cognitive stack</span>
            </div>
          </section>
        </div>
        <CommandSurface />
      </section>
      <RightContextPanel />
    </main>
  );
}
