import { collectDefaultMetrics, Registry } from "prom-client";

interface GlobalWithMetricsRegistry {
  __oryxjsMetricsRegistry?: Registry;
}

function getOrCreateRegistry(): Registry {
  const g = globalThis as GlobalWithMetricsRegistry;
  if (!g.__oryxjsMetricsRegistry) {
    const registry = new Registry();
    registry.setDefaultLabels({ app: "oryxjs" });
    collectDefaultMetrics({ register: registry });
    g.__oryxjsMetricsRegistry = registry;
  }
  return g.__oryxjsMetricsRegistry;
}

export const metricsRegistry = getOrCreateRegistry();

export async function renderMetrics(): Promise<{
  readonly contentType: string;
  readonly body: string;
}> {
  return {
    contentType: metricsRegistry.contentType,
    body: await metricsRegistry.metrics(),
  };
}
