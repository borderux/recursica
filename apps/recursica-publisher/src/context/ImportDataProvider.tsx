import React, { useState } from "react";
import { ImportDataContext, type ImportData } from "./ImportDataContext";

export function ImportDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [importData, setImportData] = useState<ImportData | null>(null);

  return (
    <ImportDataContext.Provider value={{ importData, setImportData }}>
      {children}
    </ImportDataContext.Provider>
  );
}
