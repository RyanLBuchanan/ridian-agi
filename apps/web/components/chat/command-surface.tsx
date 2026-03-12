"use client";

import { useState } from "react";
import { InputBar } from "@/components/chat/input-bar";
import { MessageList } from "@/components/chat/message-list";
import { ApiClientError, sendChat } from "@/lib/api-client";
import type { ChatExecutionMode, ChatMessage, ChatResponse } from "@/lib/types";

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "Ridian Cortex is online, built on Ridian OS, and ready to route tasks through the orchestration spine.",
};

const starterPrompts = [
  "Map the current workspace architecture and call out the strongest demo points.",
  "Plan the next implementation pass and show the execution posture you would use.",
  "Summarize what is production-ready versus placeholder in Ridian Cortex today.",
];

function formatExecutionMode(mode: ChatExecutionMode | undefined): string {
  if (!mode) {
    return "Awaiting run";
  }

  return mode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CommandSurface({
  latestRun,
  onRunUpdate,
  onLoadingChange,
  onRequestErrorChange,
}: {
  latestRun: ChatResponse | null;
  onRunUpdate: (response: ChatResponse | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onRequestErrorChange: (message: string | null) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setMessages((prev: ChatMessage[]) => [
      ...prev,
      { role: "user", content: trimmed },
    ]);
    setRequestError(null);
    onRequestErrorChange(null);
    setInput("");
    setIsLoading(true);
    onLoadingChange(true);

    try {
      const response = await sendChat({ message: trimmed });
      onRunUpdate(response);
      onRequestErrorChange(null);
      setMessages((prev: ChatMessage[]) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch (error) {
      onRunUpdate(null);
      const message =
        error instanceof ApiClientError
          ? error.message
          : "The backend is unavailable right now. Verify the deployed API target and try again.";
      setRequestError(message);
      onRequestErrorChange(message);
      setMessages((prev: ChatMessage[]) => [
        ...prev,
        {
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <div className="conversation-shell cortex-command-shell">
      <section className="card orchestration-console cortex-command-panel">
        <div className="console-header">
          <div>
            <p className="section-title">Command Surface</p>
            <h3 className="console-title">Ridian Cortex Command Interface</h3>
            <p className="console-copy">
              Submit tasks in natural language, trigger the backend
              orchestrator, and inspect the resulting routing, plan, and trace
              behavior without leaving the Ridian OS project surface.
            </p>
          </div>
          <div className="console-badges">
            <span className="status-pill">
              <span className="status-dot" />
              Task-linked execution
            </span>
            <span className="status-pill">Built on Ridian OS</span>
          </div>
        </div>
        <div className="console-stats">
          <div className="console-stat-card">
            <span className="stat-label">Execution Mode</span>
            <span className="console-stat-value">
              {formatExecutionMode(latestRun?.executionMode)}
            </span>
          </div>
          <div className="console-stat-card">
            <span className="stat-label">Selected Agent</span>
            <span className="console-stat-value">
              {latestRun?.selectedAgent ?? "Ready to route"}
            </span>
          </div>
          <div className="console-stat-card">
            <span className="stat-label">Run Summary</span>
            <span className="console-stat-value console-stat-copy">
              {latestRun?.traceSummary ??
                "The first task will surface orchestration notes here."}
            </span>
          </div>
        </div>
      </section>
      {isLoading ? (
        <div className="cortex-inline-state" aria-live="polite">
          Routing task through the backend orchestrator and waiting for run
          telemetry.
        </div>
      ) : null}
      {requestError ? (
        <div className="cortex-inline-state error" role="alert">
          {requestError}
        </div>
      ) : null}
      <MessageList messages={messages} />
      <InputBar
        value={input}
        disabled={isLoading}
        onChange={setInput}
        onSubmit={submit}
        suggestions={starterPrompts}
      />
      {latestRun ? (
        <div className="card meta-grid premium-meta-grid cortex-run-deck">
          <div className="panel-header">
            <div>
              <p className="section-title">Command Response</p>
              <p className="panel-copy text-sm muted">
                The response text remains visible in the command lane while the
                execution inspector renders the structured orchestration data.
              </p>
            </div>
            <span className="pill">
              Mode: {formatExecutionMode(latestRun.executionMode)}
            </span>
          </div>
          <div className="run-kpi-grid">
            <div className="run-kpi-card">
              <span className="run-kpi-label">Run ID</span>
              <span className="run-kpi-value">
                {latestRun.runId ?? "Pending"}
              </span>
            </div>
            <div className="run-kpi-card">
              <span className="run-kpi-label">Execution</span>
              <span className="run-kpi-value">
                {formatExecutionMode(latestRun.executionMode)}
              </span>
            </div>
            <div className="run-kpi-card">
              <span className="run-kpi-label">Agent</span>
              <span className="run-kpi-value">
                {latestRun.selectedAgent ?? "Not surfaced"}
              </span>
            </div>
          </div>
          {latestRun.plan?.structuredSteps &&
          latestRun.plan.structuredSteps.length > 0 ? (
            <div className="meta-card builder-plan-preview">
              <p className="section-title">Plan Preview</p>
              <div className="panel-note premium-note">
                {latestRun.plan.summary ??
                  "A planning sequence is attached to this run."}
              </div>
              <ul className="trace-list compact-trace-list">
                {latestRun.plan.structuredSteps
                  .slice(0, 3)
                  .map((step, index) => (
                    <li
                      key={`${step.title}-${index}`}
                      className="trace-item text-xs muted"
                    >
                      {index + 1}. {step.title}: {step.detail}
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
          <div className="panel-note premium-note">
            {latestRun.traceSummary
              ? latestRun.traceSummary
              : "Trace metadata is not available for this response yet."}
          </div>
          <div className="meta-card">
            <p className="section-title">Trace Snapshot</p>
            {latestRun.trace && latestRun.trace.length > 0 ? (
              <ul className="trace-list">
                {latestRun.trace.slice(0, 5).map((item: string) => (
                  <li key={item} className="trace-item text-xs muted">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="panel-note">
                Trace details are omitted for this response, but the run surface
                remains stable.
              </div>
            )}
          </div>
        </div>
      ) : (
        <section className="card preflight-card cortex-preflight-card">
          <div className="panel-header">
            <div>
              <p className="section-title">Console Preflight</p>
              <p className="panel-copy text-sm muted">
                The first command will activate the execution inspector, trace
                telemetry, and plan visualization so the UI reads like a live
                cognitive console built on Ridian OS.
              </p>
            </div>
            <span className="pill">Ready</span>
          </div>
          <div className="meta-list">
            <span className="pill">Run ID pending</span>
            <span className="pill">Execution mode pending</span>
            <span className="pill">Agent selection pending</span>
          </div>
        </section>
      )}
    </div>
  );
}
