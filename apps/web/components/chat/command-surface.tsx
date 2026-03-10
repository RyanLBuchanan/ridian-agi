"use client";

import { useState } from "react";
import { InputBar } from "@/components/chat/input-bar";
import { MessageList } from "@/components/chat/message-list";
import { sendChat } from "@/lib/api-client";
import type { ChatMessage } from "@/lib/types";

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "I am ready to help with planning, memory, and execution tasks in your workspace.",
};

export function CommandSurface() {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRunId, setLastRunId] = useState<string | null>(null);

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
      setLastRunId(response.runId);
      setMessages((prev: ChatMessage[]) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch {
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
    <div style={{ display: "grid", gap: 12 }}>
      <MessageList messages={messages} />
      <InputBar
        value={input}
        disabled={isLoading}
        onChange={setInput}
        onSubmit={submit}
      />
      <div className="text-xs muted">
        {lastRunId ? `Last run: ${lastRunId}` : "No run executed yet."}
      </div>
    </div>
  );
}
