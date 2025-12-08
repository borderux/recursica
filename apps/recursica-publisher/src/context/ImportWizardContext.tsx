/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import type { ResponseMessage } from "../plugin/types/messages";

export interface DependencySelection {
  guid: string;
  name: string;
  version: number;
  currentVersionInFile?: number;
  status: "NEW" | "UPDATED" | "SAME";
  useExisting: boolean;
}

export interface VariableCollectionChoice {
  type: "tokens" | "theme";
  choice: "new" | "existing";
}

export interface VariableSummary {
  tokens: { existing: number; new: number };
  theme: { existing: number; new: number };
  layers: { existing: number; new: number };
}

export interface ImportWizardState {
  currentStep: number;
  selectedComponent: {
    guid: string;
    name: string;
    version: number;
    ref?: string;
  } | null;
  dependencies: DependencySelection[];
  variableCollections: {
    tokens: "new" | "existing";
    theme: "new" | "existing";
    layers: "new" | "existing";
  };
  variableSummary: VariableSummary | null;
  componentData: {
    mainComponent: {
      guid: string;
      name: string;
      version: number;
      jsonData: unknown;
    } | null;
    dependencies: Array<{
      guid: string;
      name: string;
      version: number;
      jsonData: unknown;
    }>;
  };
}

interface ImportWizardContextType {
  wizardState: ImportWizardState;
  setWizardState: (
    state: ImportWizardState | ((prev: ImportWizardState) => ImportWizardState),
  ) => void;
  resetWizard: () => void;
  importPromise: Promise<ResponseMessage> | null;
  setImportPromise: (promise: Promise<ResponseMessage> | null) => void;
}

const initialState: ImportWizardState = {
  currentStep: 1,
  selectedComponent: null,
  dependencies: [],
  variableCollections: {
    tokens: "existing",
    theme: "existing",
    layers: "existing",
  },
  variableSummary: null,
  componentData: {
    mainComponent: null,
    dependencies: [],
  },
};

export const ImportWizardContext = createContext<
  ImportWizardContextType | undefined
>(undefined);

export function ImportWizardProvider({ children }: { children: ReactNode }) {
  const [wizardState, setWizardState] =
    useState<ImportWizardState>(initialState);
  const [importPromise, setImportPromise] =
    useState<Promise<ResponseMessage> | null>(null);

  const resetWizard = () => {
    setWizardState(initialState);
    setImportPromise(null);
  };

  return (
    <ImportWizardContext.Provider
      value={{
        wizardState,
        setWizardState,
        resetWizard,
        importPromise,
        setImportPromise,
      }}
    >
      {children}
    </ImportWizardContext.Provider>
  );
}

export function useImportWizard() {
  const context = useContext(ImportWizardContext);
  if (context === undefined) {
    throw new Error(
      "useImportWizard must be used within an ImportWizardProvider",
    );
  }
  return context;
}
