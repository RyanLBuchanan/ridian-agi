import type { ChatMessage } from "@/lib/types";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="card conversation-list">
      <p className="section-title">Conversation</p>
      {messages.map((message, idx) => (
        <div
          key={`${message.role}-${idx}`}
          className={`message-card ${message.role}`}
        >
          <div className="message-meta">
            <div className="text-xs muted">
              {message.role === "user" ? "You" : "Little Ridian AGI"}
            </div>
            <div className="text-xs muted">
              {message.role === "user" ? "Request" : "Response"}
            </div>
          </div>
          <div className="text-sm message-content">{message.content}</div>
        </div>
      ))}
    </div>
  );
}
