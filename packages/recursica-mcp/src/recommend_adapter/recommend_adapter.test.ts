import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { recommend_adapter } from "./recommend_adapter.js";
import fs from "fs";
import path from "path";

vi.mock("fs");

describe("recommend_adapter", () => {
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

  describe("Explicit UI Kit inputs", () => {
    it("should recommend MUI adapter directly when MUI kit is specified", async () => {
      const result = await recommend_adapter.handler(
        { uiKit: "MUI", version: "6.0.0" },
        mockContext,
      );

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain("Material UI (MUI)");
      expect(result.content[0].text).toContain("@recursica/mui-adapter");
    });

    it("should recommend Mantine adapter with compatibility warning for old versions", async () => {
      const result = await recommend_adapter.handler(
        { uiKit: "Mantine", version: "7.0.0" },
        mockContext,
      );

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain("Mantine");
      expect(result.content[0].text).toContain("@recursica/mantine-adapter");
      expect(result.content[0].text).toContain(
        "requires Mantine 8.0.0 or higher",
      );
    });

    it("should recommend Mantine adapter as fully compatible for version 8", async () => {
      const result = await recommend_adapter.handler(
        { uiKit: "Mantine", version: "8.1.0" },
        mockContext,
      );

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain("Fully compatible");
    });

    it("should report unsupported UI kits and direct to GitHub issues", async () => {
      const result = await recommend_adapter.handler(
        { uiKit: "antd" },
        mockContext,
      );

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain("Unsupported UI Kit Specified");
      expect(result.content[0].text).toContain("Ant Design");
      expect(result.content[0].text).toContain(
        "https://github.com/borderux/recursica/issues",
      );
    });
  });

  describe("Automatic project dependency scanning (package.json)", () => {
    it("should detect Mantine dependency and verify compatibility", async () => {
      const mockPkgPath = path.resolve("/Users/mock/project/package.json");

      vi.spyOn(fs, "existsSync").mockImplementation((p) => p === mockPkgPath);
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (p === mockPkgPath) {
          return JSON.stringify({
            name: "mock-project",
            dependencies: {
              "@mantine/core": "^8.0.0",
            },
          });
        }
        return "";
      });

      const result = await recommend_adapter.handler(
        { projectPath: "/Users/mock/project" },
        mockContext,
      );

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain("Mantine");
      expect(result.content[0].text).toContain(
        "Fully compatible with @recursica/mantine-adapter",
      );
    });

    it("should detect MUI dependencies and recommend MUI adapter", async () => {
      const mockPkgPath = path.resolve("/Users/mock/project/package.json");

      vi.spyOn(fs, "existsSync").mockImplementation((p) => p === mockPkgPath);
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (p === mockPkgPath) {
          return JSON.stringify({
            name: "mock-project",
            dependencies: {
              "@mui/material": "^6.0.0",
            },
          });
        }
        return "";
      });

      const result = await recommend_adapter.handler(
        { projectPath: "/Users/mock/project" },
        mockContext,
      );

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain("Material UI (MUI)");
      expect(result.content[0].text).toContain("@recursica/mui-adapter");
    });

    it("should walk up directory tree to find package.json", async () => {
      const mockPkgPath = path.resolve("/Users/mock/package.json");

      vi.spyOn(fs, "existsSync").mockImplementation((p) => p === mockPkgPath);
      vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
        if (p === mockPkgPath) {
          return JSON.stringify({
            name: "parent-project",
            dependencies: {
              "@mantine/core": "^8.0.0",
            },
          });
        }
        return "";
      });

      const result = await recommend_adapter.handler(
        { projectPath: "/Users/mock/nested/subfolder" },
        mockContext,
      );

      expect(result.isError).toBeUndefined();
      expect(result.content[0].text).toContain("/Users/mock/package.json");
      expect(result.content[0].text).toContain("Mantine");
    });
  });
});
