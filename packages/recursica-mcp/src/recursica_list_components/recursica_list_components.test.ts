import { describe, it, expect, vi, beforeEach } from "vitest";
import { recursica_list_components } from "./recursica_list_components.js";
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

describe("recursica_list_components", () => {
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

  it("should fail gracefully if components directory does not exist", async () => {
    vi.spyOn(utils, "getKnowledgeComponentsDir").mockReturnValue(
      "/mock/knowledge/components",
    );
    vi.spyOn(fs, "existsSync").mockReturnValue(false);

    const result = await recursica_list_components.handler({}, mockContext);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Internal Error");
  });

  it("should load and consolidate all documented components with brief descriptions", async () => {
    vi.spyOn(utils, "getKnowledgeComponentsDir").mockReturnValue(
      "/mock/knowledge/components",
    );
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      { name: "Accordion", isDirectory: () => true } as any,
      { name: "Modal", isDirectory: () => true } as any,
    ]);

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      const filename = (p as string).replace(/\\/g, "/");
      if (filename.includes("Accordion/DOCS.md")) {
        return "# Accordion\n\n**Simple collapsible list.**";
      }
      if (filename.includes("Modal/DOCS.md")) {
        return "# Modal\n\n**Overlay blocking window.**";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_list_components.handler({}, mockContext);

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("Recursica Components List");
    expect(result.content[0].text).toContain(
      "- **Accordion**: Simple collapsible list.",
    );
    expect(result.content[0].text).toContain(
      "- **Modal**: Overlay blocking window.",
    );
  });

  it("should display adapter metadata details when filter is applied", async () => {
    vi.spyOn(utils, "getKnowledgeComponentsDir").mockReturnValue(
      "/mock/knowledge/components",
    );
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      { name: "Accordion", isDirectory: () => true } as any,
    ]);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      "# Accordion\n\n**Description**",
    );

    const result = await recursica_list_components.handler(
      { adapter: "mantine" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "Active Adapter: **`@recursica/mantine-adapter`**",
    );
  });
});
