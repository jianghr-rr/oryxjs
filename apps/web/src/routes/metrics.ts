import { createFileRoute } from "@tanstack/react-router";
import { renderMetrics } from "~/server/metrics";

export const Route = createFileRoute("/metrics")({
  server: {
    handlers: {
      GET: async () => {
        const { contentType, body } = await renderMetrics();
        return new Response(body, {
          status: 200,
          headers: {
            "content-type": contentType,
          },
        });
      },
    },
  },
});
