import {
  type ApiResponse,
  createSuccessResponse,
  createTraceId,
  mapErrorToApiResponse,
  runWithRequestContext,
} from "@oryxjs/core";
import { webLogger } from "./logger";

export function jsonResponse(body: unknown, status = 200, headers?: HeadersInit): Response {
  const mergedHeaders = new Headers(headers);
  if (!mergedHeaders.has("content-type")) {
    mergedHeaders.set("content-type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: mergedHeaders,
  });
}

export async function withApiHandler<T>(
  request: Request,
  handler: () => Promise<T> | T,
): Promise<Response> {
  const incomingTraceId = request.headers.get("x-trace-id")?.trim();
  const traceId = incomingTraceId && incomingTraceId.length > 0 ? incomingTraceId : createTraceId();

  return runWithRequestContext({ traceId }, async () => {
    try {
      const data = await handler();
      const payload: ApiResponse<T> = createSuccessResponse(data);
      return jsonResponse(payload, 200, { "x-trace-id": traceId });
    } catch (error) {
      const mapped = mapErrorToApiResponse(error);
      webLogger.error({ status: mapped.status, code: mapped.body.code }, mapped.body.message);
      return jsonResponse(mapped.body, mapped.status, { "x-trace-id": traceId });
    }
  });
}
