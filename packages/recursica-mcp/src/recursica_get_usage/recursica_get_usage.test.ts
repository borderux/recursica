import { describe, it, expect, vi, beforeEach } from "vitest";
import { recursica_get_usage } from "./recursica_get_usage.js";
import fs from "fs";
import path from "path";

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");
  return {
    ...actual,
  };
});

const actualFs = await vi.importActual<typeof import("fs")>("fs");

describe("recursica_get_usage", () => {
  const mockContext = {
    root: "/Users/mock/recursica",
    allAdapters: [
      {
        name: "mantine",
        dirName: "mantine-adapter",
        absPath: "/Users/mock/recursica/packages/mantine-adapter",
      },
    ],
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return missing adapter warning if no adapter is installed and none detected", async () => {
    const mockPkgPath = path.resolve("./package.json");
    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      return false;
    });
    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          dependencies: {},
        });
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_get_usage.handler({}, mockContext);

    expect(result.content[0].text).toContain("No active Recursica adapter");
    expect(result.content[0].text).toContain("recursica_project_setup");
  });

  it("should return guidelines if adapter is detected as installed", async () => {
    const mockPkgPath = path.resolve("./package.json");
    const mockLlmsPath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/llms.txt",
    );
    const mockUsagePath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/USAGE.md",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockLlmsPath) return true;
      if (p === mockUsagePath) return true;
      return false;
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          dependencies: {
            "@recursica/mantine-adapter": "^0.23.0",
          },
        });
      }
      if (p === mockLlmsPath) {
        return "Mantine Adapter LLM Docs";
      }
      if (p === mockUsagePath) {
        return "## 1. Setup and Integration\nSetup details\n## 2. Importing Components\nImport details";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_get_usage.handler({}, mockContext);

    expect(result.content[0].text).toContain("MANTINE Adapter Guidelines");
    expect(result.content[0].text).toContain("Mantine Adapter LLM Docs");
    expect(result.content[0].text).toContain("Importing Components");
    expect(result.content[0].text).not.toContain("Setup and Integration");
  });

  it("should return guidelines when ui-kit is explicitly specified even if not in package dependencies", async () => {
    const mockPkgPath = path.resolve("./package.json");
    const mockLlmsPath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/llms.txt",
    );
    const mockUsagePath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/USAGE.md",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockLlmsPath) return true;
      if (p === mockUsagePath) return true;
      return false;
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        // Return empty dependencies to simulate not installed
        return JSON.stringify({ dependencies: {} });
      }
      if (p === mockLlmsPath) {
        return "Mantine Adapter LLM Docs";
      }
      if (p === mockUsagePath) {
        return "## 1. Setup and Integration\nSetup details\n## 2. Importing Components\nImport details";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_get_usage.handler(
      { "ui-kit": "mantine" },
      mockContext,
    );

    expect(result.content[0].text).toContain("MANTINE Adapter Guidelines");
    expect(result.content[0].text).toContain("Mantine Adapter LLM Docs");
    expect(result.content[0].text).not.toContain("No active Recursica adapter");
  });
});
