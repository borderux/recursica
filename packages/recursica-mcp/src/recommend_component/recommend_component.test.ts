import { describe, it, expect, vi, beforeEach } from "vitest";
import { recommend_component } from "./recommend_component.js";
import fs from "fs";
import path from "path";

vi.mock("fs");

describe("recommend_component", () => {
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

  it("should recommend Accordion component for collapsible accordion queries", async () => {
    const mockMantinePath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/src/components/Accordion",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => p === mockMantinePath);

    const result = await recommend_component.handler(
      { requirement: "a collapsible details list of FAQs" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "Recommended Component: `<Accordion>`",
    );
    expect(result.content[0].text).toContain(
      "MANTINE Adapter**: Supported! ✅",
    );
    expect(result.content[0].text).toContain(
      "MUI Adapter**: *Not yet implemented* ❌",
    );
  });

  it("should recommend Modal component for dialog/popup queries", async () => {
    const mockMuiPath = path.resolve(
      "/Users/mock/recursica/packages/mui-adapter/src/components/Modal",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => p === mockMuiPath);

    const result = await recommend_component.handler(
      { requirement: "a blocking popup settings wizard" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "Recommended Component: `<Modal>`",
    );
    expect(result.content[0].text).toContain("MUI Adapter**: Supported! ✅");
  });

  it("should suggest fallback strategies when no component matches", async () => {
    const result = await recommend_component.handler(
      { requirement: "unmatched-custom-3d-canvas-layout" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "No Specific Component Matched Directly",
    );
    expect(result.content[0].text).toContain(
      "compose it using general primitives",
    );
  });
});
