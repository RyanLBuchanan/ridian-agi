"use client";

import { useState } from "react";
import { CommandSurface } from "@/components/chat/command-surface";
import { ExecutionInspector } from "@/components/panels/execution-inspector";
import { SystemSidebar } from "@/components/panels/system-sidebar";
import type { ChatResponse } from "@/lib/types";

export function CortexConsole() {
  const [latestRun, setLatestRun] = useState<ChatResponse | null>(null);

  return (
    <main className="cortex-shell">
      <header className="cortex-topbar">
        <div className="cortex-brand-block">
          <div className="cortex-brand-mark">RC</div>
          <div>
            <p className="cortex-overline">Ridian Technologies</p>
            <h1 className="cortex-title">Ridian Cortex Console</h1>
            <p className="cortex-subtitle">
              A cognitive console for orchestrated task execution, agent
              routing, and trace-aware operator control.
            </p>
          </div>
        </div>
        <div className="cortex-status-row">
          <span className="cortex-chip live">
            <span className="cortex-chip-dot" />
            Orchestrator Link Ready
          </span>
          <span className="cortex-chip">Mission Control Surface</span>
          <span className="cortex-chip">Dark Console UI</span>
        </div>
      </header>

      <div className="cortex-grid">
        <SystemSidebar latestRun={latestRun} />

        <section className="cortex-center-column">
          <section className="cortex-hero-panel">
            <div>
              <p className="section-title">Console Overview</p>
              <h2 className="cortex-hero-title">
                Route tasks through the orchestration spine and inspect how the
                system thinks.
              </h2>
            </div>
            <div className="cortex-hero-metrics">
              <div className="cortex-metric-card">
                <span className="stat-label">Task State</span>
                <span className="cortex-metric-value">
                  {latestRun?.runId ? "Run captured" : "Awaiting task"}
                </span>
              </div>
              <div className="cortex-metric-card">
                <span className="stat-label">Agent Route</span>
                <span className="cortex-metric-value">
                  {latestRun?.selectedAgent ?? "Pending selection"}
                </span>
              </div>
              <div className="cortex-metric-card">
                <span className="stat-label">Trace Visibility</span>
                <span className="cortex-metric-value">
                  {latestRun?.trace?.length
                    ? `${latestRun.trace.length} events`
                    : "Idle"}
                </span>
              </div>
            </div>
          </section>

          <CommandSurface latestRun={latestRun} onRunUpdate={setLatestRun} />
        </section>

        <ExecutionInspector latestRun={latestRun} />
      </div>
    </main>
  );
}
