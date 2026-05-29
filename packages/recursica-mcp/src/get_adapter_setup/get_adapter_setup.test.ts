import { describe, it, expect, vi, beforeEach } from "vitest";
import { get_adapter_setup } from "./get_adapter_setup.js";
import fs from "fs";
import path from "path";

vi.mock("fs");

describe("get_adapter_setup", () => {
  const mockContext = {
    root: "/Users/mock/recursica",
    allAdapters: [
      {
        name: "mantine",
        dirName: "mantine-adapter",
        absPath: "/Users/mock/recursica/packages/mantine-adapter",
      },
      {
        name: "mui",
        dirName: "mui-adapter",
        absPath: "/Users/mock/recursica/packages/mui-adapter",
      },
    ],
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fail gracefully if the requested adapter is not found in the monorepo", async () => {
    const result = await get_adapter_setup.handler(
      { adapter: "unsupported-adapter" },
      mockContext,
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("was not found");
  });

  it("should detect when the adapter is already installed in package.json", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");

    vi.spyOn(fs, "existsSync").mockImplementation((p) => p === mockPkgPath);
    vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            "@recursica/mantine-adapter": "^0.23.0",
          },
        });
      }
      return "";
    });

    const result = await get_adapter_setup.handler(
      { adapter: "mantine", projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("Recursica Adapter Setup Status");
    expect(result.content[0].text).toContain(
      "is already successfully installed",
    );
  });

  it("should serve SETUP.md documentation when package is not installed", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");
    const mockSetupPath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/SETUP.md",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockSetupPath) return true;
      return false;
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            // No recursica-adapter installed
            react: "^18.0.0",
          },
        });
      }
      if (p === mockSetupPath) {
        return "# Custom SETUP.md Content";
      }
      return "";
    });

    const result = await get_adapter_setup.handler(
      { adapter: "mantine", projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toBe("# Custom SETUP.md Content");
  });

  it("should inject missing SETUP.md warning and trigger README fallback parsing", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");
    const mockReadmePath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/README.md",
    );
    const mockUsagePath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/USAGE.md",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockReadmePath) return true;
      if (p === mockUsagePath) return true;
      return false; // SETUP.md is missing!
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: { react: "^18.0.0" },
        });
      }
      if (p === mockReadmePath) {
        return "## Peer Dependencies\n- @mantine/core";
      }
      if (p === mockUsagePath) {
        return "## 1. Setup and Integration\nWrap app in Provider.";
      }
      return "";
    });

    const result = await get_adapter_setup.handler(
      {
        adapter: "@recursica/mantine-adapter",
        projectPath: "/Users/mock/project",
      },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "Warning**: The dedicated `SETUP.md` specification is missing",
    );
    expect(result.content[0].text).toContain("Peer Dependencies");
    expect(result.content[0].text).toContain("Setup and Integration");
  });
});
