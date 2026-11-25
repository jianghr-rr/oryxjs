import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

export interface ProfileContext {
  readonly profileId?: string;
  readonly workspaceDir?: string;
}

export interface RequestContext {
  readonly traceId: string;
  readonly profile?: ProfileContext;
}

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function createTraceId(): string {
  return randomUUID();
}

export function runWithRequestContext<T>(
  input: { readonly traceId?: string; readonly profile?: ProfileContext },
  fn: () => T,
): T {
  const context: RequestContext = {
    traceId: input.traceId ?? createTraceId(),
    ...(input.profile !== undefined ? { profile: input.profile } : {}),
  };
  return requestContextStorage.run(context, fn);
}

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

export function getTraceId(): string | undefined {
  return requestContextStorage.getStore()?.traceId;
}
