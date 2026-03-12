"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="route-state-shell">
      <section className="route-state-card error">
        <p className="section-title">Ridian Cortex</p>
        <h1 className="route-state-title">Project surface unavailable</h1>
        <p className="route-state-copy">
          The Ridian Cortex shell hit an application error. Reload the project
          surface or try the orchestrator again.
        </p>
        <button
          type="button"
          className="primary-btn route-state-button"
          onClick={reset}
        >
          Reload surface
        </button>
      </section>
    </main>
  );
}
