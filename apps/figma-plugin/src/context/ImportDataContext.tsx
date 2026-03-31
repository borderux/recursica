import { createContext, useContext } from "react";

export interface ImportedFile {
  id: string;
  name: string;
  size: number;
  data: unknown;
  status: "pending" | "success" | "error";
  error?: string;
}

export interface ImportSource {
  type: "repo" | "local";
  branch?: string; // Branch name for repo imports (e.g., "main", "feature-branch")
  commit?: string; // Commit SHA if importing from a specific commit
  owner?: string; // Repo owner (e.g., "borderux")
  repo?: string; // Repo name (e.g., "recursica-figma")
}

export interface ImportData {
  mainFile: ImportedFile | null;
  additionalFiles: ImportedFile[];
  source?: ImportSource; // Source information for tracking where the import came from
  // Optional wizard selections (if import came from wizard flow)
  wizardSelections?: {
    dependencies: Array<{
      guid: string;
      name: string;
      useExisting: boolean;
    }>;
    tokensCollection: "new" | "existing";
    themeCollection: "new" | "existing";
    layersCollection: "new" | "existing";
  };
  variableSummary?: {
    tokens: { existing: number; new: number };
    theme: { existing: number; new: number };
    layers: { existing: number; new: number };
  };
  // Import status tracking
  importStatus?: "pending" | "in_progress" | "completed" | "failed";
  importError?: string; // Error message if import failed
}

interface ImportDataContextType {
  importData: ImportData | null;
  setImportData: (
    data: ImportData | null | ((prev: ImportData | null) => ImportData | null),
  ) => void;
}

export const ImportDataContext = createContext<
  ImportDataContextType | undefined
>(undefined);

export function useImportData() {
  const context = useContext(ImportDataContext);
  if (context === undefined) {
    throw new Error("useImportData must be used within an ImportDataProvider");
  }
  return context;
}
