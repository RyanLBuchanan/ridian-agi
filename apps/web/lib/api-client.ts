import type { ChatRequest, ChatResponse } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function sendChat(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  const payload = (await response.json()) as Partial<ChatResponse>;

  if (typeof payload.response !== "string") {
    throw new Error("Chat response payload is invalid");
  }

  return {
    response: payload.response,
    runId: typeof payload.runId === "string" ? payload.runId : undefined,
    executionMode: payload.executionMode,
    selectedAgent: payload.selectedAgent ?? null,
    selectedModel:
      typeof payload.selectedModel === "string"
        ? payload.selectedModel
        : undefined,
    traceSummary:
      typeof payload.traceSummary === "string"
        ? payload.traceSummary
        : undefined,
    trace: Array.isArray(payload.trace) ? payload.trace : [],
    plan:
      payload.plan && typeof payload.plan === "object"
        ? {
            title:
              typeof payload.plan.title === "string"
                ? payload.plan.title
                : undefined,
            summary:
              typeof payload.plan.summary === "string"
                ? payload.plan.summary
                : undefined,
            steps: Array.isArray(payload.plan.steps) ? payload.plan.steps : [],
            structuredSteps: Array.isArray(payload.plan.structuredSteps)
              ? payload.plan.structuredSteps.filter(
                  (
                    step,
                  ): step is {
                    title: string;
                    detail: string;
                    status: "next" | "ready" | "later";
                  } =>
                    Boolean(step) &&
                    typeof step === "object" &&
                    typeof step.title === "string" &&
                    typeof step.detail === "string" &&
                    (step.status === "next" ||
                      step.status === "ready" ||
                      step.status === "later"),
                )
              : [],
          }
        : null,
  };
}
