/* eslint-disable @typescript-eslint/no-explicit-any */
import * as semver from "semver";
import { CURRENT_EXPORT_FORMAT_VERSION } from "../constants";

// Define a type for a single migration step
export interface Migration {
  // The version this migration upgrades FROM
  fromVersion: string;
  // The version this migration upgrades TO
  toVersion: string;
  // The actual migration logic
  migrate: (data: any) => any;
}

// Registry of all migrations, ordered typically from oldest to newest
export const migrations: Migration[] = [
  {
    fromVersion: "1.0.0",
    toVersion: "1.1.0",
    migrate: (data) => {
      // 1.1.0 adds support for exporting SECTION nodes.
      // Older 1.0.0 exports will not contain SECTION nodes, so no structural
      // data transformation is needed for backward compatibility.
      // Just bumping the version natively informs the parser it can receive SECTIONs.
      if (data.metadata) {
        data.metadata.exportFormatVersion = "1.1.0";
      }
      return data;
    },
  },
  // Example for future use:
  // {
  //   fromVersion: "1.1.0",
  //   toVersion: "1.2.0",
  //   migrate: (data) => {
  //     // Migrate data shape here
  //     if (data.metadata) {
  //       data.metadata.exportFormatVersion = "1.2.0";
  //     }
  //     return data;
  //   },
  // },
];

/**
 * Validates and migrates imported JSON payload to the current supported schema version.
 *
 * @param parsedJson The raw parsed JSON from the imported file
 * @returns The migrated JSON, guaranteed to match CURRENT_EXPORT_FORMAT_VERSION
 * @throws Error if the JSON is from an unsupported newer version
 */
export function migrateExportData(parsedJson: any): any {
  if (!parsedJson || typeof parsedJson !== "object") {
    throw new Error("Invalid import data: Not a valid JSON object");
  }

  // Handle missing metadata entirely (very old unversioned exports)
  let importedVersion = "1.0.0";
  if (parsedJson.metadata && parsedJson.metadata.exportFormatVersion) {
    importedVersion = parsedJson.metadata.exportFormatVersion;
  } else {
    // If there is no version field, we assume it's the baseline 1.0.0
    // We also ensure the metadata block exists so later parsers don't crash
    if (!parsedJson.metadata) {
      parsedJson.metadata = {};
    }
    parsedJson.metadata.exportFormatVersion = "1.0.0";
  }

  // 1. Forward Compatibility Check (Importing newer file into old plugin)
  if (semver.gt(importedVersion, CURRENT_EXPORT_FORMAT_VERSION)) {
    throw new Error(
      `Unsupported newer file version: ${importedVersion}. Your Recursica Publisher plugin only supports up to version ${CURRENT_EXPORT_FORMAT_VERSION}. Please update your plugin.`,
    );
  }

  // 2. Backward Compatibility Check (Importing old file into new plugin)
  // We run applicable migrations until the payload matches the current version
  let currentData = parsedJson;
  let currentVersion = importedVersion;

  while (semver.lt(currentVersion, CURRENT_EXPORT_FORMAT_VERSION)) {
    // Find a migration that can move us forward from currentVersion
    const applicableMigration = migrations.find(
      (m) =>
        semver.satisfies(currentVersion, `>=${m.fromVersion}`) &&
        semver.gt(m.toVersion, currentVersion) &&
        semver.lte(m.toVersion, CURRENT_EXPORT_FORMAT_VERSION),
    );

    if (!applicableMigration) {
      throw new Error(
        `Unable to migrate file from version ${currentVersion} to ${CURRENT_EXPORT_FORMAT_VERSION}. No suitable migration path found.`,
      );
    }

    // Apply the migration
    try {
      currentData = applicableMigration.migrate(currentData);
      currentVersion = applicableMigration.toVersion;

      // Ensure the version string in the JSON is updated
      if (!currentData.metadata) currentData.metadata = {};
      currentData.metadata.exportFormatVersion = currentVersion;
    } catch (e) {
      throw new Error(
        `Migration from ${applicableMigration.fromVersion} to ${applicableMigration.toVersion} failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  return currentData;
}
