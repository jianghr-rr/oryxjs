export interface AppInfo {
  readonly name: string;
  readonly version: string;
}

export interface HealthPayload {
  readonly status: "ok";
  readonly uptimeSeconds: number;
  readonly timestamp: string;
}
