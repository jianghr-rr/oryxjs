import { Writable } from "node:stream";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  createLogger,
  createSuccessResponse,
  getTraceId,
  mapErrorToApiResponse,
  OryxError,
  runWithRequestContext,
} from "./index.js";

describe("@oryxjs/core smoke tests", () => {
  it("propagates traceId via AsyncLocalStorage and injects it into structured logs", () => {
    const chunks: string[] = [];
    const destination = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(String(chunk));
        callback();
      },
    });

    const logger = createLogger({
      name: "core-test",
      level: "info",
      pretty: false,
      destination,
    });

    const observedTraceId = runWithRequestContext({ traceId: "trace-smoke-001" }, () => {
      logger.info({ apiKey: "dummy-secret-value" }, "smoke log entry");
      return getTraceId();
    });

    expect(observedTraceId).toBe("trace-smoke-001");
    expect(getTraceId()).toBeUndefined();

    const parsed = JSON.parse(chunks.join("")) as Record<string, unknown>;
    expect(parsed.traceId).toBe("trace-smoke-001");
    expect(parsed.apiKey).toBe("[REDACTED]");
    expect(parsed.msg).toBe("smoke log entry");
  });

  it("maps ZodError and OryxError into unified ApiResponse payloads", () => {
    const ok = createSuccessResponse({ alive: true });
    expect(ok.code).toBe("OK");
    expect(ok.data).toEqual({ alive: true });

    const schema = z.object({ name: z.string().min(1) });
    const parsed = schema.safeParse({ name: "" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const mapped = mapErrorToApiResponse(parsed.error);
      expect(mapped.status).toBe(400);
      expect(mapped.body.code).toBe("VALIDATION_ERROR");
    }

    const domainErr = mapErrorToApiResponse(
      new OryxError("Resource missing", { code: "NOT_FOUND" }),
    );
    expect(domainErr.status).toBe(404);
    expect(domainErr.body.code).toBe("NOT_FOUND");
  });
});
