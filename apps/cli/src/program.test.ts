import { describe, expect, it } from "vitest";
import { createProgram, readCliPackageInfo } from "./program.js";

describe("@oryxjs/cli smoke tests", () => {
  it("outputs the version from package.json on --version", () => {
    const pkg = readCliPackageInfo();
    let stdout = "";

    const program = createProgram();
    program.exitOverride();
    program.configureOutput({
      writeOut: (str) => {
        stdout += str;
      },
      writeErr: () => {},
    });

    expect(() => program.parse(["node", "oryxjs", "--version"])).toThrow();
    expect(stdout.trim()).toBe(pkg.version);
  });
});
