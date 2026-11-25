import type { HealthPayload } from "@oryxjs/core";
import { createFileRoute } from "@tanstack/react-router";
import { jsonResponse } from "~/server/http";

export const Route = createFileRoute("/health")({
  server: {
    handlers: {
      GET: () => {
        const payload: HealthPayload = {
          status: "ok",
          uptimeSeconds: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
        };
        return jsonResponse(payload);
      },
    },
  },
});
