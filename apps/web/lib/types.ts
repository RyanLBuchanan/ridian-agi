export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  message: string;
};

export type ChatResponse = {
  runId: string;
  response: string;
  executionMode:
    | "direct_response"
    | "retrieval_assisted"
    | "tool_consideration"
    | "delegated_agent"
    | "verify_before_return";
  selectedAgent?: string | null;
  traceSummary: string;
  trace: string[];
};
