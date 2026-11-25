import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <span className="inline-block rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 font-mono text-xs text-emerald-400">
          oryxjs foundation ready
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-white">oryxjs</h1>
        <p className="text-neutral-400">
          TypeScript-native, self-hostable AI Agent Harness OS — engineering skeleton &amp;
          observability baseline.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <a
          href="/health"
          className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 transition hover:border-neutral-700"
        >
          <div className="font-mono text-sm text-white">GET /health</div>
          <div className="mt-1 text-xs text-neutral-400">Liveness &amp; uptime</div>
        </a>
        <a
          href="/info"
          className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 transition hover:border-neutral-700"
        >
          <div className="font-mono text-sm text-white">GET /info</div>
          <div className="mt-1 text-xs text-neutral-400">App name &amp; version</div>
        </a>
        <a
          href="/metrics"
          className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 transition hover:border-neutral-700"
        >
          <div className="font-mono text-sm text-white">GET /metrics</div>
          <div className="mt-1 text-xs text-neutral-400">Prometheus metrics</div>
        </a>
      </section>
    </main>
  );
}
