import { readFileSync } from "node:fs";
import { Command } from "commander";

interface CliPackageJson {
  readonly name: string;
  readonly version: string;
}

export function readCliPackageInfo(): CliPackageJson {
  const pkgUrl = new URL("../package.json", import.meta.url);
  const raw = readFileSync(pkgUrl, "utf-8");
  const parsed = JSON.parse(raw) as Partial<CliPackageJson>;
  return {
    name: parsed.name ?? "@oryxjs/cli",
    version: parsed.version ?? "0.0.0",
  };
}

export function createProgram(): Command {
  const pkg = readCliPackageInfo();
  const program = new Command();

  program
    .name("oryxjs")
    .description("oryxjs — TypeScript-native AI Agent Harness OS CLI")
    .version(pkg.version, "-v, --version", "Output the current version")
    .configureOutput({
      writeOut: (str) => {
        process.stdout.write(str);
      },
      writeErr: (str) => {
        process.stderr.write(str);
      },
    });

  return program;
}
