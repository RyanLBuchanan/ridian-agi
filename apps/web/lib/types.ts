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

export type ChatPlanStepStatus = "next" | "ready" | "later";

export type ChatPlanStep = {
  title: string;
  detail: string;
  status: ChatPlanStepStatus;
};

export type ChatPlan = {
  title?: string;
  summary?: string;
  steps: string[];
  structuredSteps?: ChatPlanStep[];
};

export type ChatResponse = {
  response: string;
  runId?: string;
  executionMode?: ChatExecutionMode;
  selectedAgent?: string | null;
  traceSummary?: string;
  trace?: string[];
  plan?: ChatPlan | null;
};
