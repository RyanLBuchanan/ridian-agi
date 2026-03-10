"use client";

import { useState } from "react";
import { InputBar } from "@/components/chat/input-bar";
import { MessageList } from "@/components/chat/message-list";
import { sendChat } from "@/lib/api-client";
import type { ChatExecutionMode, ChatMessage, ChatResponse } from "@/lib/types";

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "I am ready to help with planning, memory, and execution tasks in your workspace.",
};

function formatExecutionMode(mode: ChatExecutionMode | undefined): string {
  if (!mode) {
    return "Awaiting run";
  }

  return mode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CommandSurface() {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponseMeta, setLastResponseMeta] = useState<ChatResponse | null>(
    null,
  );

  const submit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setMessages((prev: ChatMessage[]) => [
      ...prev,
      { role: "user", content: trimmed },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChat({ message: trimmed });
      setLastResponseMeta(response);
      setMessages((prev: ChatMessage[]) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch {
      setLastResponseMeta(null);
      setMessages((prev: ChatMessage[]) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not reach the backend right now. Check API connectivity and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="conversation-shell">
      <MessageList messages={messages} />
      <InputBar
        value={input}
        disabled={isLoading}
        onChange={setInput}
        onSubmit={submit}
      />
      {lastResponseMeta ? (
        <div className="card meta-grid">
          <div className="panel-header">
            <div>
              <p className="section-title">Current Run</p>
              <p className="panel-copy text-sm muted">
                The latest orchestration response exposes its current execution
                posture without interrupting the conversation.
              </p>
            </div>
            <span className="pill">
              Mode: {formatExecutionMode(lastResponseMeta.executionMode)}
            </span>
          </div>
          <div className="meta-list">
            {lastResponseMeta.runId ? (
              <span className="pill">Run: {lastResponseMeta.runId}</span>
            ) : null}
            {lastResponseMeta.executionMode ? (
              <span className="pill">
                Execution: {formatExecutionMode(lastResponseMeta.executionMode)}
              </span>
            ) : null}
            {lastResponseMeta.selectedAgent ? (
              <span className="pill">
                Agent: {lastResponseMeta.selectedAgent}
              </span>
            ) : null}
            {!lastResponseMeta.runId ? (
              <span className="pill">Run ID pending</span>
            ) : null}
          </div>
          <div className="panel-note">
            {lastResponseMeta.traceSummary
              ? lastResponseMeta.traceSummary
              : "Trace metadata is not available for this response yet."}
          </div>
          <div className="meta-card">
            <p className="section-title">Trace / Activity</p>
            {lastResponseMeta.trace && lastResponseMeta.trace.length > 0 ? (
              <ul className="trace-list">
                {lastResponseMeta.trace.slice(0, 5).map((item: string) => (
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
        <div className="panel-note">
          No run has been executed yet. The first response will populate
          execution mode, selected agent, run ID, and trace activity here.
        </div>
      )}
    </div>
  );
}
