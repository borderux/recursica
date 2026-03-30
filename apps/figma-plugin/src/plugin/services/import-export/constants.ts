/**
 * Constants for the Import/Export services.
 */

// ============================================================================
// 🛑 AI INSTRUCTION: JSON SCHEMA MODIFICATION RULES 🛑
// ============================================================================
// If you are modifying the structure of the JSON payload (adding, removing,
// or renaming fields in metadata, collections, variables, instances, etc.):
// 1. You MUST increment the CURRENT_EXPORT_FORMAT_VERSION below using SemVer.
// 2. You MUST write a migration in src/plugin/services/import-export/migrations/
//    to handle upgrading older JSON payloads to this new schema FIRST before import.
// ============================================================================
export const CURRENT_EXPORT_FORMAT_VERSION = "1.2.0";
