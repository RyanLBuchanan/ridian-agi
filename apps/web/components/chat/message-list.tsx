import type { ChatMessage } from "@/lib/types";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="card" style={{ minHeight: 260, display: "grid", gap: 8 }}>
      <p className="section-title">Conversation</p>
      {messages.map((message, idx) => (
        <div
          key={`${message.role}-${idx}`}
          className="card"
          style={{ background: "#fff" }}
        >
          <div className="text-xs muted" style={{ marginBottom: 6 }}>
            {message.role === "user" ? "You" : "Little Ridian AGI"}
          </div>
          <div className="text-sm">{message.content}</div>
        </div>
      ))}
    </div>
  );
}
