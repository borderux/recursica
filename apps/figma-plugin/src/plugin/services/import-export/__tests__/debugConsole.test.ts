import { debugConsole } from "../debugConsole";
import { describe, it, expect, beforeEach } from "vitest";
import packageJson from "../../../../../package.json";

describe("debugConsole", () => {
  beforeEach(() => {
    debugConsole.clear();
  });

  it("should initialize and clear log buffer with the plugin version", () => {
    const logs = debugConsole.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toEqual({
      type: "log",
      message: `Plugin version: ${packageJson.version}`,
    });
  });

  it("should collect logs in order, keeping plugin version as the first line", () => {
    debugConsole.log("test log 1");
    debugConsole.warning("test warning 1");
    debugConsole.error("test error 1");

    const logs = debugConsole.getLogs();
    expect(logs).toHaveLength(4);
    expect(logs[0].message).toBe(`Plugin version: ${packageJson.version}`);
    expect(logs[1]).toEqual({ type: "log", message: "test log 1" });
    expect(logs[2]).toEqual({ type: "warning", message: "test warning 1" });
    expect(logs[3]).toEqual({ type: "error", message: "test error 1" });
  });

  it("should clear the logs and add the plugin version back", () => {
    debugConsole.log("test log 1");
    debugConsole.clear();

    const logs = debugConsole.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe(`Plugin version: ${packageJson.version}`);
  });

  it("should flush logs and reset to empty before the next session clear", () => {
    debugConsole.log("test log 1");
    const flushed = debugConsole.flush();
    expect(flushed).toHaveLength(2);
    expect(flushed[0].message).toBe(`Plugin version: ${packageJson.version}`);
    expect(flushed[1].message).toBe("test log 1");

    // After flush, log buffer is empty
    expect(debugConsole.getLogs()).toHaveLength(0);

    // After clear, it starts with version again
    debugConsole.clear();
    expect(debugConsole.getLogs()).toHaveLength(1);
    expect(debugConsole.getLogs()[0].message).toBe(
      `Plugin version: ${packageJson.version}`,
    );
  });
});
