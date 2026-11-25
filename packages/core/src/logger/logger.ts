import { createRequire } from "node:module";
import pino, { type DestinationStream, type Logger, type LoggerOptions } from "pino";
import { getTraceId } from "../context/request-context.js";

const require = createRequire(import.meta.url);

function resolvePinoPrettyTarget(): string | undefined {
  try {
    return require.resolve("pino-pretty");
  } catch {
    return undefined;
  }
}

export interface CreateLoggerOptions {
  readonly name?: string;
  readonly level?: string;
  readonly pretty?: boolean;
  readonly destination?: DestinationStream;
}

const REDACT_PATHS = [
  "password",
  "token",
  "apiKey",
  "secret",
  "authorization",
  "*.password",
  "*.token",
  "*.apiKey",
  "*.secret",
  "*.authorization",
];

export function createLogger(options: CreateLoggerOptions = {}): Logger {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const level = options.level ?? process.env.LOG_LEVEL ?? "info";
  const usePretty = options.pretty ?? (nodeEnv === "development" && !options.destination);

  const prettyTarget = usePretty ? resolvePinoPrettyTarget() : undefined;

  const pinoOptions: LoggerOptions = {
    name: options.name ?? "oryxjs",
    level,
    redact: {
      paths: REDACT_PATHS,
      censor: "[REDACTED]",
    },
    mixin() {
      const traceId = getTraceId();
      return traceId ? { traceId } : {};
    },
    ...(prettyTarget
      ? {
          transport: {
            target: prettyTarget,
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          },
        }
      : {}),
  };

  return options.destination ? pino(pinoOptions, options.destination) : pino(pinoOptions);
}

export type { Logger };
