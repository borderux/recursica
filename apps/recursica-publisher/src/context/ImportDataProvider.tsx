import React, { useState, useEffect, useCallback } from "react";
import { ImportDataContext, type ImportData } from "./ImportDataContext";
import { callPlugin } from "../utils/callPlugin";

export function ImportDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [importData, setImportDataState] = useState<ImportData | null>(null);

  // Load import data on mount
  useEffect(() => {
    const loadImportData = async () => {
      try {
        const { promise } = callPlugin("loadImportData", {});
        const response = await promise;
        if (response.success && response.data) {
          const data = response.data as { importData?: ImportData };
          if (data.importData) {
            console.log(
              "[ImportDataProvider] Loaded importData from storage:",
              {
                hasMainFile: !!data.importData.mainFile,
                mainFileStatus: data.importData.mainFile?.status,
                additionalFilesCount:
                  data.importData.additionalFiles?.length || 0,
              },
            );
            setImportDataState(data.importData);
          } else {
            console.log("[ImportDataProvider] No importData found in storage");
          }
        }
      } catch (error) {
        console.error("[ImportDataProvider] Error loading import data:", error);
      }
    };
    loadImportData();
  }, []);

  // Save import data whenever it changes
  const setImportData = useCallback(
    async (
      data:
        | ImportData
        | null
        | ((prev: ImportData | null) => ImportData | null),
    ) => {
      const newData = typeof data === "function" ? data(importData) : data;
      setImportDataState(newData);
      try {
        if (newData) {
          console.log("[ImportDataProvider] Saving importData to storage:", {
            hasMainFile: !!newData.mainFile,
            mainFileStatus: newData.mainFile?.status,
            additionalFilesCount: newData.additionalFiles?.length || 0,
          });
          await callPlugin("storeImportData", { importData: newData }).promise;
        } else {
          console.log("[ImportDataProvider] Clearing importData from storage");
          await callPlugin("clearImportData", {}).promise;
        }
      } catch (error) {
        console.error("[ImportDataProvider] Error saving import data:", error);
        // Still update state even if storage fails
      }
    },
    [importData],
  );

  return (
    <ImportDataContext.Provider value={{ importData, setImportData }}>
      {children}
    </ImportDataContext.Provider>
  );
}
