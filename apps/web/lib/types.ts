export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  message: string;
};

export type ChatExecutionMode =
  | "direct_response"
  | "retrieval_assisted"
  | "tool_consideration"
  | "delegated_agent"
  | "verify_before_return";

export type ChatResponse = {
  response: string;
  runId?: string;
  executionMode?: ChatExecutionMode;
  selectedAgent?: string | null;
  traceSummary?: string;
  trace?: string[];
};
