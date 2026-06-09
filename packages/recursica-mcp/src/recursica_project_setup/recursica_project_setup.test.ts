import { describe, it, expect, vi, beforeEach } from "vitest";
import { recursica_project_setup } from "./recursica_project_setup.js";
import fs from "fs";
import path from "path";

vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");
  return {
    ...actual,
  };
});

const actualFs = await vi.importActual<typeof import("fs")>("fs");

describe("recursica_project_setup", () => {
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
    const result = await recursica_project_setup.handler(
      { "ui-kit": "unsupported-adapter" },
      mockContext,
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("was not found");
  });

  it("should detect when the adapter is already installed in package.json", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      return actualFs.existsSync(p);
    });
    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            "@recursica/mantine-adapter": "^0.23.0",
          },
        });
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_project_setup.handler(
      { "ui-kit": "mantine", projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "is already successfully installed",
    );
    expect(result.content[0].text).toContain("recursica_get_usage");
  });

  it("should serve SETUP.md documentation when package is not installed but auto-detected via UI kit", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");
    const mockSetupPath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/SETUP.md",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockSetupPath) return true;
      return actualFs.existsSync(p);
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            "@mantine/core": "^8.0.0",
          },
        });
      }
      if (p === mockSetupPath) {
        return "# Custom SETUP.md Content";
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_project_setup.handler(
      { projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toBe("# Custom SETUP.md Content");
  });

  it("should suggest installing supported UI kits when no adapter or UI kit is detected", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      return actualFs.existsSync(p);
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            lodash: "^4.17.21",
          },
        });
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_project_setup.handler(
      { projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.content[0].text).toContain(
      "No supported UI Kit or Recursica Adapter detected",
    );
    expect(result.content[0].text).toContain(
      "explicitly specify the `ui-kit` parameter",
    );
  });

  it("should suggest installing supported UI kits when no package.json exists at all", async () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);

    const result = await recursica_project_setup.handler(
      { projectPath: "/Users/mock/nonexistent" },
      mockContext,
    );

    expect(result.content[0].text).toContain(
      "No supported UI Kit or Recursica Adapter detected",
    );
  });

  it("should return warning if target adapter is selected/detected but SETUP.md is missing", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");
    const mockSetupPath = path.resolve(
      "/Users/mock/recursica/packages/mantine-adapter/SETUP.md",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockSetupPath) return false; // missing!
      return actualFs.existsSync(p);
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            "@mantine/core": "^8.0.0",
          },
        });
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_project_setup.handler(
      { projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain(
      "Warning**: The SETUP.md for adapter",
    );
  });

  it("should warn if recursica_variables_scoped.css is missing", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");
    const mockCssPath = path.resolve(
      "/Users/mock/project/recursica_variables_scoped.css",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockCssPath) return false; // CSS is missing in root
      return actualFs.existsSync(p);
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            "@recursica/mantine-adapter": "^0.23.0",
          },
        });
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_project_setup.handler(
      { "ui-kit": "mantine", projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "is already successfully installed",
    );
    expect(result.content[0].text).toContain(
      "`recursica_variables_scoped.css` is missing",
    );
    expect(result.content[0].text).toContain(
      "Please run `npm install` to create it",
    );
  });

  it("should not warn if recursica_variables_scoped.css is present", async () => {
    const mockPkgPath = path.resolve("/Users/mock/project/package.json");
    const mockCssPath = path.resolve(
      "/Users/mock/project/recursica_variables_scoped.css",
    );

    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      if (p === mockPkgPath) return true;
      if (p === mockCssPath) return true; // CSS is present in root
      return actualFs.existsSync(p);
    });

    vi.spyOn(fs, "readFileSync").mockImplementation((p, options) => {
      if (p === mockPkgPath) {
        return JSON.stringify({
          name: "my-app",
          dependencies: {
            "@recursica/mantine-adapter": "^0.23.0",
          },
        });
      }
      return actualFs.readFileSync(p, options);
    });

    const result = await recursica_project_setup.handler(
      { "ui-kit": "mantine", projectPath: "/Users/mock/project" },
      mockContext,
    );

    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain(
      "is already successfully installed",
    );
    expect(result.content[0].text).not.toContain(
      "recursica_variables_scoped.css is missing",
    );
  });
});
