import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { withApiHandler } from "~/server/http";

const pingQuerySchema = z.object({
  echo: z.string().max(64).optional(),
});

export const Route = createFileRoute("/api/v1/ping")({
  server: {
    handlers: {
      GET: ({ request }) =>
        withApiHandler(request, () => {
          const url = new URL(request.url);
          const parsed = pingQuerySchema.parse({
            echo: url.searchParams.get("echo") ?? undefined,
          });
          return {
            pong: true,
            ...(parsed.echo !== undefined ? { echo: parsed.echo } : {}),
          };
        }),
    },
  },
});
