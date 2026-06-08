import { describe, it, expect, vi, beforeEach } from "vitest";
import { recursica_list_components } from "./recursica_list_components.js";
import fs from "fs";
import path from "path";

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
    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p.toString().includes("components_directory_header.md")) return true;
      return false;
    });

    const result = await recursica_list_components.handler({}, mockContext);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Internal Error");
  });

  it("should load and consolidate all documented markdown components", async () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p.toString().includes("components_directory_header.md")) return true;
      return true;
    });
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "Accordion.md" as any,
      "Modal.md" as any,
    ]);

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      const filename = path.basename(p as string);
      if (filename === "Accordion.md") {
        return "# Accordion\nAlternate Names: collapse\nSimple collapsible list.";
      }
      if (filename === "Modal.md") {
        return "# Modal\nAlternate Names: popup\nOverlay blocking window.";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_list_components.handler({}, mockContext);

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("Recursica Components Directory");
    expect(result.content[0].text).toContain("# Accordion");
    expect(result.content[0].text).toContain("Alternate Names: collapse");
    expect(result.content[0].text).toContain("# Modal");
    expect(result.content[0].text).toContain("Alternate Names: popup");
  });

  it("should display adapter metadata details when filter is applied", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readdirSync").mockReturnValue(["Accordion.md" as any]);
    vi.spyOn(fs, "readFileSync").mockReturnValue("# Accordion\nDescription");

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
