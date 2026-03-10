"use client";

import { useState } from "react";
import { CommandSurface } from "@/components/chat/command-surface";
import { LeftNav } from "@/components/shell/left-nav";
import { RightContextPanel } from "@/components/shell/right-context-panel";
import { TopHeader } from "@/components/shell/top-header";
import type { ChatResponse } from "@/lib/types";

export function WorkspaceShell() {
  const [latestRun, setLatestRun] = useState<ChatResponse | null>(null);

  return (
    <main className="app-shell">
      <TopHeader />
      <LeftNav />
      <section className="panel main">
        <div className="shell-intro">
          <section className="intro-card">
            <div className="intro-eyebrow">Workspace Intelligence Layer</div>
            <h2 className="intro-title">
              A composed orchestration console for thinking, building, and
              memory.
            </h2>
            <p className="intro-copy">
              Little Ridian AGI is designed as a restrained workspace-native
              system: deliberate enough for internal demos, structured enough
              for serious implementation, and calm enough to feel like a trusted
              operating layer.
            </p>
            <div className="intro-highlights">
              <div className="highlight-chip">Visible execution posture</div>
              <div className="highlight-chip">Agent-aware response routing</div>
              <div className="highlight-chip">
                Memory, plans, and tools in view
              </div>
            </div>
          </section>
          <section className="card stats-card">
            <div className="stat-block">
              <span className="stat-label">Latest Execution Mode</span>
              <span className="stat-value">
                {latestRun?.executionMode
                  ? latestRun.executionMode
                      .split("_")
                      .map(
                        (part) => part.charAt(0).toUpperCase() + part.slice(1),
                      )
                      .join(" ")
                  : "Awaiting first run"}
              </span>
            </div>
            <div className="stat-block">
              <span className="stat-label">Selected Agent</span>
              <span className="stat-value">
                {latestRun?.selectedAgent ?? "Workspace Concierge"}
              </span>
            </div>
            <div className="stat-block">
              <span className="stat-label">Run Visibility</span>
              <span className="stat-value">
                {latestRun?.runId
                  ? `Tracked as ${latestRun.runId}`
                  : "Run metadata ready"}
              </span>
            </div>
          </section>
        </div>
        <CommandSurface onRunUpdate={setLatestRun} latestRun={latestRun} />
      </section>
      <RightContextPanel latestRun={latestRun} />
    </main>
  );
}
