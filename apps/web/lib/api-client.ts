import type { ChatRequest, ChatResponse } from "@/lib/types";

const LOCAL_API_BASE_URL = "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 15000;

export class ApiClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiClientError";
  }
}

function resolveApiBaseUrl(): string | null {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (typeof window === "undefined") {
    return LOCAL_API_BASE_URL;
  }

  const { hostname } = window.location;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0";

  return isLocalHost ? LOCAL_API_BASE_URL : null;
}

export async function sendChat(request: ChatRequest): Promise<ChatResponse> {
  const apiBaseUrl = resolveApiBaseUrl();
  if (!apiBaseUrl) {
    throw new ApiClientError(
      "Backend endpoint is not configured. Set NEXT_PUBLIC_API_BASE_URL to your deployed API origin.",
    );
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
  } catch (error) {
    window.clearTimeout(timeout);

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError(
        "The backend took too long to respond. Confirm the API is reachable and try again.",
      );
    }

    throw new ApiClientError(
      "The backend is unavailable right now. Confirm NEXT_PUBLIC_API_BASE_URL points to a reachable backend.",
    );
  }

  window.clearTimeout(timeout);

  if (!response.ok) {
    throw new ApiClientError(
      `The backend returned ${response.status}. The project surface is reachable, but the orchestration API is not healthy.`,
    );
  }

  const payload = (await response.json()) as Partial<ChatResponse>;

  if (typeof payload.response !== "string") {
    throw new ApiClientError("The backend response payload is invalid.");
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
