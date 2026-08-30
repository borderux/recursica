import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import net from "node:net";
import type { HarnessWebServerConfig } from "./harness/mantineSourceOfTruth.js";

/**
 * Boots a target's Storybook and discovers the real port it ends up on,
 * instead of pinning one via `-p`/`--port`. Storybook silently falls back to
 * an OS-assigned port whenever its default/configured one is taken (this is
 * what caused the flaky `webServer` timeouts noted in mui-adapter), so the
 * only reliable source of truth is the URL it prints in its own startup
 * banner. Used by both the automated/headless run (cli.ts) and Dev Mode
 * (devServer.ts) — neither pins a port anymore.
 */

export interface LaunchTarget {
  /** Human-readable name used in log lines. */
  name: string;
  command: string;
  cwd: string;
  /** Reuse an already-running instance (detected via the last-known-port
   * cache) instead of spawning a new one. Mirrors the old `reuseExistingServer`
   * behavior, which used to just probe the one fixed configured port. */
  reuseExistingServer: boolean;
  /** File the discovered port is cached in between runs, so a later
   * `reuseExistingServer` run knows where to look. One per target. */
  cacheFile: string;
  timeoutMs?: number;
}

export interface DiscoveredServer {
  url: string;
  port: number;
  /** The process we spawned, or `null` if an already-running instance was
   * reused — callers should only kill what they started. */
  process: ChildProcess | null;
}

// Storybook prints its bound address in its startup banner wrapped in ANSI
// color codes and box-drawing chars, e.g.:
//   │ │   - Local:                http://localhost:57496/                │ │
// Strip ANSI first, then match the URL itself.
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;
const LOCAL_URL_PATTERN = /Local:\s*(https?:\/\/localhost:\d+)/;

function isPortActive(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(200);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, "127.0.0.1");
  });
}

function readCachedPort(cacheFile: string): number | undefined {
  try {
    const port = JSON.parse(readFileSync(cacheFile, "utf8")).port;
    return typeof port === "number" ? port : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedPort(cacheFile: string, port: number): void {
  mkdirSync(dirname(cacheFile), { recursive: true });
  writeFileSync(cacheFile, JSON.stringify({ port }));
}

/** Spawns `target.command`, streaming its output to the console like before,
 * and resolves once it reports the URL it actually bound to. */
function spawnAndDetect(
  target: LaunchTarget,
  timeoutMs: number,
): Promise<DiscoveredServer> {
  return new Promise((resolve, reject) => {
    const child = spawn(target.command, {
      cwd: target.cwd,
      stdio: "pipe",
      shell: true,
    });

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(
        new Error(
          `Timed out after ${timeoutMs}ms waiting for ${target.name}'s Storybook to report its URL (no "Local: http://localhost:<port>" line seen in its output).`,
        ),
      );
    }, timeoutMs);

    const handleOutput = (data: Buffer, isError: boolean) => {
      const text = data.toString();
      for (const line of text.split("\n")) {
        if (line.trim()) {
          const label = isError
            ? `${target.name} SB ERROR`
            : `${target.name} SB`;
          (isError ? console.error : console.log)(`[${label}] ${line.trim()}`);
        }
      }
      if (settled) return;
      const match = text.replace(ANSI_PATTERN, "").match(LOCAL_URL_PATTERN);
      if (match) {
        settled = true;
        clearTimeout(timer);
        // Non-null: LOCAL_URL_PATTERN has exactly one capture group, and a
        // match only happens when it participated.
        const url = match[1]!;
        const port = Number(new URL(url).port);
        writeCachedPort(target.cacheFile, port);
        resolve({ url, port, process: child });
      }
    };
    child.stdout?.on("data", (data: Buffer) => handleOutput(data, false));
    child.stderr?.on("data", (data: Buffer) => handleOutput(data, true));
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on("exit", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(
        new Error(
          `${target.name}'s Storybook exited (code ${code}) before reporting its URL.`,
        ),
      );
    });
  });
}

/** Adapts a resolved `HarnessWebServerConfig` into a `LaunchTarget`. */
export function toLaunchTarget(
  name: string,
  server: HarnessWebServerConfig,
): LaunchTarget {
  return {
    name,
    command: server.command,
    cwd: server.cwd,
    reuseExistingServer: server.reuseExistingServer,
    cacheFile: server.cacheFile,
    timeoutMs: server.timeout,
  };
}

/** Reuses an already-running Storybook if `reuseExistingServer` is set and
 * the last-known-port cache points at something still listening; otherwise
 * spawns `target.command` fresh and detects the real port from its output. */
export async function launchAndDetectStorybook(
  target: LaunchTarget,
): Promise<DiscoveredServer> {
  if (target.reuseExistingServer) {
    const cachedPort = readCachedPort(target.cacheFile);
    if (cachedPort !== undefined && (await isPortActive(cachedPort))) {
      console.log(
        `[Dev Launcher] ${target.name} is already running on port ${cachedPort} (reused).`,
      );
      return {
        url: `http://localhost:${cachedPort}`,
        port: cachedPort,
        process: null,
      };
    }
  }
  console.log(`[Dev Launcher] Launching Storybook for ${target.name}...`);
  return spawnAndDetect(target, target.timeoutMs ?? 120 * 1000);
}
