import type { ChatRequest, ChatResponse } from "@/lib/types";

const LOCAL_API_BASE_URL = "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 15000;

export class ApiClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiClientError";
  }
}

function resolveChatEndpoint(apiBaseUrl: string): string {
  const normalizedBaseUrl = apiBaseUrl.replace(/\/$/, "");
  return normalizedBaseUrl.endsWith("/api")
    ? `${normalizedBaseUrl}/chat`
    : `${normalizedBaseUrl}/api/chat`;
}

function formatNetworkError(error: unknown, endpoint: string): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "The backend took too long to respond. Confirm the API is reachable and try again.";
  }

  const detail = error instanceof Error && error.message ? ` (${error.message})` : "";
  return `Unable to reach the backend endpoint${detail}. This is commonly caused by CORS rejection or an unreachable API host. Confirm NEXT_PUBLIC_API_BASE_URL points to the API origin and that the API CORS allowlist includes your site origin. Endpoint: ${endpoint}`;
}

async function formatHttpError(response: Response): Promise<string> {
  let detail = "";

  try {
    const payload = (await response.json()) as { detail?: unknown };
    if (typeof payload.detail === "string") {
      detail = payload.detail;
    }
  } catch {
    try {
      const fallbackText = await response.text();
      if (fallbackText.trim()) {
        detail = fallbackText.trim();
      }
    } catch {
      // Ignore body parsing issues and fall back to status text.
    }
  }

  const tail = detail || response.statusText || "Unknown backend error.";
  return `Backend request failed with ${response.status}: ${tail}`;
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

  const chatEndpoint = resolveChatEndpoint(apiBaseUrl);

  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  let response: Response;

  try {
    response = await fetch(chatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
  } catch (error) {
    window.clearTimeout(timeout);
    throw new ApiClientError(
      formatNetworkError(error, chatEndpoint),
    );
  }

  window.clearTimeout(timeout);

  if (!response.ok) {
    throw new ApiClientError(await formatHttpError(response));
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
