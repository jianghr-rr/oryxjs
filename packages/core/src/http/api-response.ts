import { ZodError } from "zod";
import { isOryxError } from "../errors/oryx-error.js";

export interface ApiResponse<T> {
  readonly code: string;
  readonly message: string;
  readonly data: T;
  readonly timestamp: string;
}

export interface ValidationIssueItem {
  readonly path: string;
  readonly message: string;
  readonly code: string;
}

export interface MappedApiError {
  readonly status: number;
  readonly body: ApiResponse<unknown>;
}

export function createSuccessResponse<T>(data: T, message = "OK"): ApiResponse<T> {
  return {
    code: "OK",
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse<T = null>(
  code: string,
  message: string,
  data: T = null as T,
): ApiResponse<T> {
  return {
    code,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function formatZodError(error: ZodError): ValidationIssueItem[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
    code: issue.code,
  }));
}

export function mapErrorToApiResponse(error: unknown): MappedApiError {
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: createErrorResponse("VALIDATION_ERROR", "Request validation failed", {
        issues: formatZodError(error),
      }),
    };
  }

  if (isOryxError(error)) {
    return {
      status: error.statusCode,
      body: createErrorResponse(error.code, error.message, error.details ?? null),
    };
  }

  return {
    status: 500,
    body: createErrorResponse("INTERNAL_ERROR", "Internal server error", null),
  };
}
