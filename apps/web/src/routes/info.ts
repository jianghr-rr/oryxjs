import type { AppInfo } from "@oryxjs/core";
import { createFileRoute } from "@tanstack/react-router";
import { jsonResponse } from "~/server/http";
import packageJson from "../../package.json";

export const Route = createFileRoute("/info")({
  server: {
    handlers: {
      GET: () => {
        const payload: AppInfo = {
          name: "oryxjs",
          version: packageJson.version,
        };
        return jsonResponse(payload);
      },
    },
  },
});
