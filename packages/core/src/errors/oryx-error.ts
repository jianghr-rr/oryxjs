export type OryxErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export interface OryxErrorOptions {
  readonly code: OryxErrorCode;
  readonly statusCode?: number;
  readonly details?: unknown;
  readonly cause?: unknown;
}

const DEFAULT_STATUS_BY_CODE: Record<OryxErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export class OryxError extends Error {
  readonly code: OryxErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(message: string, options: OryxErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "OryxError";
    this.code = options.code;
    this.statusCode = options.statusCode ?? DEFAULT_STATUS_BY_CODE[options.code];
    this.details = options.details;
  }
}

export function isOryxError(error: unknown): error is OryxError {
  return error instanceof OryxError;
}
