import { describe, it, expect, vi, beforeEach } from "vitest";
import { recursica_get_component_doc } from "./recursica_get_component_doc.js";
import fs from "fs";
import path from "path";
import * as utils from "../common/utils.js";

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");
  return {
    ...actual,
  };
});

const actualFs = await vi.importActual<typeof import("fs")>("fs");

describe("recursica_get_component_doc", () => {
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

  it("should fail with setup suggestion when no adapter is specified and auto-detection fails", async () => {
    // Spy on auto-detection to simulate a clean project with no adapters installed
    vi.spyOn(utils, "detectAdapterAndUiKit").mockReturnValue({
      dependencies: {},
      targetAdapter: null,
      isInstalled: false,
    });

    const result = await recursica_get_component_doc.handler(
      { componentName: "Button" },
      mockContext,
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("No active Recursica adapter");
    expect(result.content[0].text).toContain("recursica_project_setup");
  });

  it("should succeed and load USAGE.md if auto-detection succeeds", async () => {
    // Spies to mock active adapter detection of 'mui'
    vi.spyOn(utils, "detectAdapterAndUiKit").mockReturnValue({
      dependencies: { "@recursica/mui-adapter": "0.15.0" },
      targetAdapter: "mui",
      isInstalled: true,
    });

    vi.spyOn(utils, "getCleanAdapterName").mockImplementation((name) =>
      name.replace("-adapter", ""),
    );

    vi.spyOn(utils, "getKnowledgeComponentsDir").mockReturnValue(
      "/mock/knowledge/components",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.includes("knowledge") || filename.includes("mui-adapter")) {
        return true;
      }
      return false;
    });

    vi.spyOn(fs, "readdirSync").mockImplementation((p) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.includes("knowledge")) {
        return ["Button"] as any;
      }
      if (filename.includes("mui-adapter")) {
        return ["Button"] as any;
      }
      return [];
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.endsWith("Button/DOCS.md")) {
        return "# Button\n\n**A clickable element.**";
      }
      if (filename.includes("mui-adapter") && filename.endsWith("USAGE.md")) {
        return "### MUI Component Usage\n\nUse `<Button onClick={...}>` in MUI.";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_get_component_doc.handler(
      { componentName: "Button" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "Component Documentation: `Button`",
    );
    expect(result.content[0].text).toContain(
      "Design Specification & Guidelines",
    );
    expect(result.content[0].text).toContain("MUI Component Usage");
  });

  it("should respect explicit adapter argument and skip auto-detection", async () => {
    // Even if auto-detection returns nothing, explicit adapter should bypass it
    const spyDetect = vi.spyOn(utils, "detectAdapterAndUiKit");

    vi.spyOn(utils, "getKnowledgeComponentsDir").mockReturnValue(
      "/mock/knowledge/components",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (
        filename.includes("knowledge") ||
        filename.includes("mantine-adapter")
      ) {
        return true;
      }
      return false;
    });

    vi.spyOn(fs, "readdirSync").mockImplementation((p) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (
        filename.includes("knowledge") ||
        filename.includes("mantine-adapter")
      ) {
        return ["Button"] as any;
      }
      return [];
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.endsWith("Button/DOCS.md")) {
        return "# Button\n\n**A clickable element.**";
      }
      if (
        filename.includes("mantine-adapter") &&
        filename.endsWith("USAGE.md")
      ) {
        return "### Mantine Component Usage\n\nUse `<Button>` in Mantine.";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_get_component_doc.handler(
      { componentName: "Button", adapter: "mantine" },
      mockContext,
    );

    expect(spyDetect).not.toHaveBeenCalled();
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("Mantine Component Usage");
    expect(result.content[0].text).not.toContain("MUI Component Usage");
  });

  it("should fail and return generic unsupported message without DOCS.md when USAGE.md is missing", async () => {
    vi.spyOn(utils, "detectAdapterAndUiKit").mockReturnValue({
      dependencies: { "@recursica/mui-adapter": "0.15.0" },
      targetAdapter: "mui",
      isInstalled: true,
    });

    vi.spyOn(utils, "getKnowledgeComponentsDir").mockReturnValue(
      "/mock/knowledge/components",
    );

    // Mock existsSync such that USAGE.md does NOT exist
    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.includes("knowledge") || filename.includes("mui-adapter")) {
        // Explicitly return false if it's USAGE.md to simulate missing usage
        if (filename.endsWith("USAGE.md")) {
          return false;
        }
        return true;
      }
      return false;
    });

    vi.spyOn(fs, "readdirSync").mockImplementation((p) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.includes("knowledge") || filename.includes("mui-adapter")) {
        return ["Button"] as any;
      }
      return [];
    });

    // Mock readFileSync
    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.endsWith("Button/DOCS.md")) {
        return "# Button\n\n**A clickable element.**";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_get_component_doc.handler(
      { componentName: "Button" },
      mockContext,
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      'does not have usage details for the "mui" adapter and is currently not supported',
    );
    // Ensure it does NOT contain design guidelines or description details from DOCS.md
    expect(result.content[0].text).not.toContain(
      "Design Specification & Guidelines",
    );
    expect(result.content[0].text).not.toContain("A clickable element");
  });

  it("should fail gracefully when an explicit adapter is requested but not installed/active", async () => {
    const emptyContext = {
      root: "/Users/mock/recursica",
      allAdapters: [], // no active adapters in the workspace
    };

    const result = await recursica_get_component_doc.handler(
      { componentName: "Button", adapter: "mui" },
      emptyContext,
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      'specified adapter "mui" is not installed or active',
    );
    expect(result.content[0].text).toContain("recursica_project_setup");
  });
});
