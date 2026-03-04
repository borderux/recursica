import { migrateExportData } from "../index";
import { CURRENT_EXPORT_FORMAT_VERSION } from "../../constants";
import * as semver from "semver";
import { describe, it, expect } from "vitest";

describe("JSON Migration Pipeline", () => {
  it("should accept valid current version payload without changes", () => {
    const validJson = {
      metadata: {
        exportFormatVersion: CURRENT_EXPORT_FORMAT_VERSION,
      },
      pageData: { name: "Test" },
    };

    const migrated = migrateExportData(validJson);
    expect(migrated).toEqual(validJson);
  });

  it("should default unversioned payloads to 1.0.0", () => {
    const unversionedJson = {
      pageData: { name: "Test" },
    };

    const migrated = migrateExportData(unversionedJson);
    expect(migrated.metadata.exportFormatVersion).toBe("1.0.0");
  });

  it("should throw error if payload is a newer unsupported version", () => {
    // Generate a future version
    const futureSemver = semver.inc(CURRENT_EXPORT_FORMAT_VERSION, "major");

    const futureJson = {
      metadata: {
        exportFormatVersion: futureSemver,
      },
      pageData: { name: "Test" },
    };

    expect(() => migrateExportData(futureJson)).toThrow(
      /Unsupported newer file version/,
    );
  });
});
