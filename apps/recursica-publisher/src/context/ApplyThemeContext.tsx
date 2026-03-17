import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router";
import { callPlugin } from "../utils/callPlugin";
import { ServiceName } from "../plugin/types/ServiceName";
import type {
  ClashVariableIssue,
  ThemeVariableIssue,
  ReferencedPage,
} from "../plugin/services/getPageThemeVariables";
import { recursicaJsonToVariableRows } from "../plugin/services/recursicaJsonToVariableRows";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface ClashDecision {
  action: "delete" | null;
}

interface UnmatchedDecision {
  action: "ignore" | null;
}

interface NonRecursicaDecision {
  action: "ignore" | null;
}

const FILE_NAMES = {
  tokens: "recursica_tokens.json",
  brand: "recursica_brand.json",
  uiKit: "recursica_ui-kit.json",
} as const;

type FileKey = keyof typeof FILE_NAMES;

interface AssignedFiles {
  tokensFile: File;
  brandFile: File;
  uiKitFile: File;
}

/* ------------------------------------------------------------------ */
/*  Utility: file assignment                                          */
/* ------------------------------------------------------------------ */

function assignFiles(files: FileList | null): AssignedFiles | null {
  if (!files || files.length === 0) return null;
  const byName: Record<string, File> = {};
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    byName[f.name] = f;
  }
  const tokensFile =
    byName[FILE_NAMES.tokens] ??
    [...Object.values(byName)].find((f) => f.name.includes("tokens"));
  const brandFile =
    byName[FILE_NAMES.brand] ??
    [...Object.values(byName)].find((f) => f.name.includes("brand"));
  const uiKitFile =
    byName[FILE_NAMES.uiKit] ??
    [...Object.values(byName)].find((f) => f.name.includes("ui-kit"));
  if (!tokensFile || !brandFile || !uiKitFile) return null;
  return { tokensFile, brandFile, uiKitFile };
}

async function readJson(file: File): Promise<unknown> {
  const text = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
  return JSON.parse(text);
}

/* ------------------------------------------------------------------ */
/*  Context value type                                                */
/* ------------------------------------------------------------------ */

interface ApplyThemeContextValue {
  // Error
  error: string | null;

  // Import
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  fileNames: Record<FileKey, string | null>;
  importing: boolean;
  importResult: Record<string, unknown> | null;
  hasFiles: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImport: () => Promise<void>;

  // Scan results
  pageName: string;
  clashVars: ClashVariableIssue[];
  unmatchedVars: ThemeVariableIssue[];
  nonRecursicaVars: ThemeVariableIssue[];
  scanWarnings: string[];

  // Decisions
  clashDecisions: Map<string, ClashDecision>;
  unmatchedDecisions: Map<string, UnmatchedDecision>;
  clashIndex: number;
  unmatchedIndex: number;
  nonRecursicaIndex: number;
  setClashIndex: (i: number) => void;
  setUnmatchedIndex: (i: number) => void;
  setNonRecursicaIndex: (i: number) => void;

  // Actions
  startScan: (pageId?: string) => Promise<void>;
  setClashAction: (variableId: string, action: "delete") => void;
  setUnmatchedAction: (variableId: string, action: "ignore") => void;
  setNonRecursicaAction: (variableId: string, action: "ignore") => void;
  nonRecursicaDecisions: Map<string, NonRecursicaDecision>;
  handleApply: (
    clashDec?: Map<string, ClashDecision>,
    unmatchedDec?: Map<string, UnmatchedDecision>,
  ) => Promise<void>;
  handleFocusNode: (nodeId: string) => Promise<void>;

  // Variable path browser (for fix selections)
  variablePaths: string[];
  variableTypeMap: Map<string, string>;
  fixSelections: Map<string, string>;
  setFixSelection: (variableId: string, selectedPath: string | null) => void;

  // Cross-page
  applyLog: string[];
  allLogs: string[];
  processedPages: string[];
  remainingPages: ReferencedPage[];
  handleProceedToNextPage: () => Promise<void>;
  handleSkipAll: () => void;
  globalIgnored: Set<string>;
}

const ApplyThemeContext = createContext<ApplyThemeContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useApplyTheme() {
  const ctx = useContext(ApplyThemeContext);
  if (!ctx)
    throw new Error("useApplyTheme must be used within ApplyThemeProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

export function ApplyThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Error
  const [error, setError] = useState<string | null>(null);

  // Import
  const [fileNames, setFileNames] = useState<Record<FileKey, string | null>>({
    tokens: null,
    brand: null,
    uiKit: null,
  });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Scan results
  const [pageName, setPageName] = useState("");
  const [pageId, setPageId] = useState("");
  const [clashVars, setClashVars] = useState<ClashVariableIssue[]>([]);
  const [unmatchedVars, setUnmatchedVars] = useState<ThemeVariableIssue[]>([]);
  const [nonRecursicaVars, setNonRecursicaVars] = useState<
    ThemeVariableIssue[]
  >([]);
  const [scanWarnings, setScanWarnings] = useState<string[]>([]);

  // Decisions
  const [clashDecisions, setClashDecisions] = useState<
    Map<string, ClashDecision>
  >(new Map());
  const [unmatchedDecisions, setUnmatchedDecisions] = useState<
    Map<string, UnmatchedDecision>
  >(new Map());
  const [globalIgnored, setGlobalIgnored] = useState<Set<string>>(new Set());
  const [clashIndex, setClashIndex] = useState(0);
  const [unmatchedIndex, setUnmatchedIndex] = useState(0);
  const [nonRecursicaIndex, setNonRecursicaIndex] = useState(0);
  const [nonRecursicaDecisions, setNonRecursicaDecisions] = useState<
    Map<string, NonRecursicaDecision>
  >(new Map());

  // Apply
  const [applyLog, setApplyLog] = useState<string[]>([]);
  const [allLogs, setAllLogs] = useState<string[]>([]);
  const [processedPages, setProcessedPages] = useState<string[]>([]);
  const [remainingPages, setRemainingPages] = useState<ReferencedPage[]>([]);

  // Variable paths from theme JSON (for VariableInput fix selections)
  const [variablePaths, setVariablePaths] = useState<string[]>([]);
  const [variableTypeMap, setVariableTypeMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [fixSelections, setFixSelections] = useState<Map<string, string>>(
    new Map(),
  );

  // Ref to hold parsed JSON for variable path extraction
  const parsedJsonRef = useRef<{
    tokens: unknown;
    brand: unknown;
    uiKit: unknown;
  } | null>(null);

  const hasFiles =
    fileNames.tokens != null &&
    fileNames.brand != null &&
    fileNames.uiKit != null;

  /* ---- Import ---- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) {
      setFileNames({ tokens: null, brand: null, uiKit: null });
      setImportResult(null);
      setError(null);
      return;
    }
    const assigned = assignFiles(files);
    if (!assigned) {
      setFileNames({ tokens: null, brand: null, uiKit: null });
      setError(
        "Select exactly three JSON files: one containing tokens, one brand, one ui-kit.",
      );
      setImportResult(null);
      return;
    }
    setFileNames({
      tokens: assigned.tokensFile.name,
      brand: assigned.brandFile.name,
      uiKit: assigned.uiKitFile.name,
    });
    setError(null);
    setImportResult(null);
  };

  const handleImport = async () => {
    const input = fileInputRef.current;
    if (!input?.files?.length) {
      setError("Please select the three Recursica JSON files.");
      return;
    }
    const assigned = assignFiles(input.files);
    if (!assigned) {
      setError("Could not assign files.");
      return;
    }
    setImporting(true);
    setError(null);
    setImportResult(null);
    await new Promise((r) => setTimeout(r, 50));

    try {
      const [tokens, brand, uiKit] = await Promise.all([
        readJson(assigned.tokensFile),
        readJson(assigned.brandFile),
        readJson(assigned.uiKitFile),
      ]);

      // Store parsed JSON for variable path extraction
      parsedJsonRef.current = { tokens, brand, uiKit };
      const { promise } = callPlugin(ServiceName.importRecursicaJson, {
        tokens,
        brand,
        uiKit,
      });
      const response = await promise;
      const data = response.data as Record<string, unknown>;
      setImportResult(data);

      if (response.error || !response.success) {
        setError(response.message ?? "Import failed.");
      } else {
        setError(null);

        // Extract variable paths from the theme JSON for VariableInput
        if (parsedJsonRef.current) {
          try {
            const { rows } = recursicaJsonToVariableRows(
              parsedJsonRef.current.tokens,
              parsedJsonRef.current.brand,
              parsedJsonRef.current.uiKit,
            );
            // Map collection names to display labels
            const collectionLabels: Record<string, string> = {
              tokens: "Tokens",
              themes: "Theme",
              layer: "Layer",
            };
            const paths: string[] = [];
            const typeMap = new Map<string, string>();
            const seen = new Set<string>();
            for (const r of rows) {
              const prefix = collectionLabels[r.collection] ?? r.collection;
              const fullPath = `${prefix}/${r.figmaVariableName}`;
              if (!seen.has(fullPath)) {
                seen.add(fullPath);
                paths.push(fullPath);
                typeMap.set(fullPath, r.type);
              }
            }
            paths.sort();
            setVariablePaths(paths);
            setVariableTypeMap(typeMap);
          } catch {
            // Silently fail — variable paths are optional
          }
        }

        startScan();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  /* ---- Scan ---- */

  const startScan = useCallback(
    async (pageId?: string) => {
      navigate("/apply-recursica-theme/scanning", { replace: true });
      setError(null);
      setClashIndex(0);
      setUnmatchedIndex(0);

      try {
        const { promise } = callPlugin(ServiceName.getPageThemeVariables, {
          ...(pageId ? { pageId } : {}),
        });
        const response = await promise;
        if (!response.success) {
          setError(response.message ?? "Scan failed.");
          navigate("/apply-recursica-theme/summary", { replace: true });
          return;
        }

        const data = response.data as {
          pageName: string;
          pageId: string;
          clashVariables: ClashVariableIssue[];
          unmatchedVariables: ThemeVariableIssue[];
          nonRecursicaVariables: ThemeVariableIssue[];
          referencedPages: ReferencedPage[];
          warnings: string[];
        };

        setPageName(data.pageName);
        setPageId(data.pageId);
        setClashVars(data.clashVariables);
        setNonRecursicaVars(data.nonRecursicaVariables ?? []);
        setScanWarnings(data.warnings);

        const filteredUnmatched = data.unmatchedVariables.map((v) => v);
        setUnmatchedVars(filteredUnmatched);

        // Merge new referenced pages (deduped against processed and newly-added)
        setRemainingPages((prev) => {
          const newRefs = data.referencedPages.filter(
            (p) =>
              !processedPages.includes(p.pageId) &&
              !prev.some((rp) => rp.pageId === p.pageId),
          );
          return [...prev, ...newRefs];
        });

        // Initialize decisions
        const newClashDecisions = new Map<string, ClashDecision>();
        for (const cv of data.clashVariables) {
          newClashDecisions.set(cv.oldVariableId, { action: null });
        }
        setClashDecisions(newClashDecisions);

        const newUnmatchedDecisions = new Map<string, UnmatchedDecision>();
        for (const uv of filteredUnmatched) {
          if (globalIgnored.has(uv.variableId)) {
            newUnmatchedDecisions.set(uv.variableId, { action: "ignore" });
          } else {
            newUnmatchedDecisions.set(uv.variableId, { action: null });
          }
        }
        setUnmatchedDecisions(newUnmatchedDecisions);

        // Determine next step
        if (
          data.clashVariables.length > 0 ||
          filteredUnmatched.length > 0 ||
          (data.nonRecursicaVariables ?? []).length > 0
        ) {
          navigate("/apply-recursica-theme/overview", { replace: true });
        } else {
          handleApply(newClashDecisions, newUnmatchedDecisions);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Scan failed.");
        navigate("/apply-recursica-theme/summary", { replace: true });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalIgnored, processedPages, remainingPages, navigate],
  );

  /* ---- Decision setters ---- */

  const setClashActionFn = (variableId: string, action: "delete") => {
    setClashDecisions((prev) => {
      const next = new Map(prev);
      next.set(variableId, { action });
      return next;
    });
  };

  const setUnmatchedActionFn = (variableId: string, action: "ignore") => {
    setUnmatchedDecisions((prev) => {
      const next = new Map(prev);
      next.set(variableId, { action });
      return next;
    });
  };

  const setNonRecursicaActionFn = (variableId: string, action: "ignore") => {
    setNonRecursicaDecisions((prev) => {
      const next = new Map(prev);
      next.set(variableId, { action });
      return next;
    });
  };

  const setFixSelectionFn = (
    variableId: string,
    selectedPath: string | null,
  ) => {
    setFixSelections((prev) => {
      const next = new Map(prev);
      if (selectedPath === null) {
        next.delete(variableId);
      } else {
        next.set(variableId, selectedPath);
      }
      return next;
    });
  };

  /* ---- Apply ---- */

  const handleApply = async (
    clashDec: Map<string, ClashDecision> = clashDecisions,
    unmatchedDec: Map<string, UnmatchedDecision> = unmatchedDecisions,
  ) => {
    navigate("/apply-recursica-theme/applying", { replace: true });
    setError(null);

    try {
      const clashActions = [...clashDec.entries()]
        .filter(([, d]) => d.action !== null)
        .map(([id, d]) => ({ oldVariableId: id, action: d.action! }));

      const unmatchedActions = [...unmatchedDec.entries()]
        .filter(([, d]) => d.action !== null)
        .map(([id, d]) => ({ variableId: id, action: d.action! }));

      const newIgnored = new Set(globalIgnored);
      for (const ua of unmatchedActions) {
        if (ua.action === "ignore") newIgnored.add(ua.variableId);
      }
      setGlobalIgnored(newIgnored);

      const { promise } = callPlugin(ServiceName.applyPageThemeVariables, {
        clashActions,
        unmatchedActions,
      });
      const response = await promise;
      const data = response.data as { operationLog: string[]; summary: string };

      const pageLog = [
        `── Page: ${pageName} ──`,
        ...(data.operationLog ?? []),
        data.summary ?? "",
      ];
      setApplyLog(pageLog);
      setAllLogs((prev) => [...prev, ...pageLog]);
      setProcessedPages((prev) => [...prev, pageId]);

      navigate("/apply-recursica-theme/next-page", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apply failed.");
      navigate("/apply-recursica-theme/summary", { replace: true });
    }
  };

  /* ---- Focus node ---- */

  const handleFocusNode = async (nodeId: string) => {
    try {
      const { promise } = callPlugin(ServiceName.focusNode, { nodeId });
      await promise;
    } catch {
      // Silently fail
    }
  };

  /* ---- Next page ---- */

  const handleProceedToNextPage = async () => {
    if (remainingPages.length === 0) {
      navigate("/apply-recursica-theme/summary");
      return;
    }

    const nextPage = remainingPages[0];
    setRemainingPages((prev) => prev.slice(1));

    try {
      const { promise } = callPlugin(ServiceName.switchToPage, {
        pageId: nextPage.pageId,
      });
      await promise;
    } catch (err) {
      setAllLogs((prev) => [
        ...prev,
        `⚠ Failed to switch to page "${nextPage.pageName}": ${err instanceof Error ? err.message : String(err)}`,
      ]);
    }

    startScan(nextPage.pageId);
  };

  const handleSkipAll = () => {
    navigate("/apply-recursica-theme/summary");
  };

  /* ---- Context value ---- */

  const value: ApplyThemeContextValue = {
    error,
    fileInputRef,
    fileNames,
    importing,
    importResult,
    hasFiles,
    handleFileChange,
    handleImport,
    pageName,
    clashVars,
    unmatchedVars,
    nonRecursicaVars,
    scanWarnings,
    clashDecisions,
    unmatchedDecisions,
    clashIndex,
    unmatchedIndex,
    nonRecursicaIndex,
    setClashIndex,
    setUnmatchedIndex,
    setNonRecursicaIndex,
    startScan,
    setClashAction: setClashActionFn,
    setUnmatchedAction: setUnmatchedActionFn,
    setNonRecursicaAction: setNonRecursicaActionFn,
    nonRecursicaDecisions,
    handleApply,
    handleFocusNode,
    variablePaths,
    variableTypeMap,
    fixSelections,
    setFixSelection: setFixSelectionFn,
    applyLog,
    allLogs,
    processedPages,
    remainingPages,
    handleProceedToNextPage,
    handleSkipAll,
    globalIgnored,
  };

  return (
    <ApplyThemeContext.Provider value={value}>
      {children}
    </ApplyThemeContext.Provider>
  );
}
