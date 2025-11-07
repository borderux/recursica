import { createContext, useContext } from "react";

export interface ImportedFile {
  id: string;
  name: string;
  size: number;
  data: unknown;
  status: "pending" | "success" | "error";
  error?: string;
}

export interface ImportData {
  mainFile: ImportedFile | null;
  additionalFiles: ImportedFile[];
}

interface ImportDataContextType {
  importData: ImportData | null;
  setImportData: (data: ImportData | null) => void;
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
