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
  ThemeStyleIssue,
  AvailableStyle,
  ReferencedPage,
} from "../plugin/services/getPageThemeVariables";
import { recursicaJsonToVariableRows } from "../plugin/services/recursicaJsonToVariableRows";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface ClashDecision {
  action: "delete" | null;
}

export interface UnmatchedDecision {
  action: "ignore" | "fix" | null;
}

interface NonRecursicaDecision {
  action: "ignore" | "fix" | null;
}

export interface StyleDecision {
  action: "ignore" | "map" | null;
  mappedStyleId?: string;
}

const FILE_NAMES = {
  tokens: "recursica_tokens.json",
  brand: "recursica_brand.json",
  uiKit: "recursica_ui-kit.json",
} as const;

type FileKey = keyof typeof FILE_NAMES;

interface AssignedFiles {
  tokensFile: File | null;
  brandFile: File | null;
  uiKitFile: File | null;
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
    [...Object.values(byName)].find((f) => f.name.includes("tokens")) ??
    null;
  const brandFile =
    byName[FILE_NAMES.brand] ??
    [...Object.values(byName)].find((f) => f.name.includes("brand")) ??
    null;
  const uiKitFile =
    byName[FILE_NAMES.uiKit] ??
    [...Object.values(byName)].find((f) => f.name.includes("ui-kit")) ??
    null;

  if (!tokensFile && !brandFile && !uiKitFile) return null;

  // Create dummy objects to satisfy type, we will check undefined where actually used,
  // but it's better to update AssignedFiles type if possible
  return {
    tokensFile,
    brandFile,
    uiKitFile,
  };
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
  nonRecursicaTextStyles: ThemeStyleIssue[];
  nonRecursicaEffectStyles: ThemeStyleIssue[];
  availableTextStyles: AvailableStyle[];
  availableEffectStyles: AvailableStyle[];
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
  textStyleIndex: number;
  effectStyleIndex: number;
  setTextStyleIndex: (i: number) => void;
  setEffectStyleIndex: (i: number) => void;

  // Actions
  startScan: (pageId?: string) => Promise<void>;
  setClashAction: (variableId: string, action: "delete" | null) => void;
  setUnmatchedAction: (
    variableId: string,
    action: "ignore" | "fix" | null,
  ) => void;
  setNonRecursicaAction: (
    variableId: string,
    action: "ignore" | "fix" | null,
  ) => void;
  setTextStyleAction: (
    styleId: string,
    action: "ignore" | "map" | null,
    mappedStyleId?: string,
  ) => void;
  setEffectStyleAction: (
    styleId: string,
    action: "ignore" | "map",
    mappedStyleId?: string,
  ) => void;
  nonRecursicaDecisions: Map<string, NonRecursicaDecision>;
  textStyleDecisions: Map<string, StyleDecision>;
  effectStyleDecisions: Map<string, StyleDecision>;
  handleApply: (
    clashDec?: Map<string, ClashDecision>,
    unmatchedDec?: Map<string, UnmatchedDecision>,
    nonRecursicaDec?: Map<string, NonRecursicaDecision>,
    textStyleDec?: Map<string, StyleDecision>,
    effectStyleDec?: Map<string, StyleDecision>,
  ) => Promise<void>;
  handleSkipPage: () => void;
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
  remainingPages: Array<{ pageId: string; pageName: string }>;
  handleProceedToNextPage: () => Promise<void>;
  handleSkipAll: () => void;
  globalIgnored: Set<string>;
  lastCompletedPageName: string | null;
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
  const [nonRecursicaTextStyles, setNonRecursicaTextStyles] = useState<
    ThemeStyleIssue[]
  >([]);
  const [nonRecursicaEffectStyles, setNonRecursicaEffectStyles] = useState<
    ThemeStyleIssue[]
  >([]);
  const [availableTextStyles, setAvailableTextStyles] = useState<
    AvailableStyle[]
  >([]);
  const [availableEffectStyles, setAvailableEffectStyles] = useState<
    AvailableStyle[]
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
  const [textStyleIndex, setTextStyleIndex] = useState(0);
  const [effectStyleIndex, setEffectStyleIndex] = useState(0);
  const [nonRecursicaDecisions, setNonRecursicaDecisions] = useState<
    Map<string, NonRecursicaDecision>
  >(new Map());
  const [textStyleDecisions, setTextStyleDecisions] = useState<
    Map<string, StyleDecision>
  >(new Map());
  const [effectStyleDecisions, setEffectStyleDecisions] = useState<
    Map<string, StyleDecision>
  >(new Map());

  // Apply
  const [applyLog, setApplyLog] = useState<string[]>([]);
  const [allLogs, setAllLogs] = useState<string[]>([]);
  const [processedPages, setProcessedPages] = useState<string[]>([]);
  const [remainingPages, setRemainingPages] = useState<
    Array<{ pageId: string; pageName: string }>
  >([]);
  const [lastCompletedPageName, setLastCompletedPageName] = useState<
    string | null
  >(null);

  // Variable paths from theme JSON (for fix selections)
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
    fileNames.tokens != null ||
    fileNames.brand != null ||
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
        "Select at least one valid Recursica JSON file (tokens, brand, or ui-kit).",
      );
      setImportResult(null);
      return;
    }
    setFileNames({
      tokens: assigned.tokensFile?.name ?? null,
      brand: assigned.brandFile?.name ?? null,
      uiKit: assigned.uiKitFile?.name ?? null,
    });
    setError(null);
    setImportResult(null);
  };

  const handleImport = async () => {
    const input = fileInputRef.current;
    if (!input?.files?.length) {
      setError("Please select at least one Recursica JSON file.");
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
        assigned.tokensFile
          ? readJson(assigned.tokensFile)
          : Promise.resolve(null),
        assigned.brandFile
          ? readJson(assigned.brandFile)
          : Promise.resolve(null),
        assigned.uiKitFile
          ? readJson(assigned.uiKitFile)
          : Promise.resolve(null),
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
          nonRecursicaTextStyles: ThemeStyleIssue[];
          nonRecursicaEffectStyles: ThemeStyleIssue[];
          availableTextStyles: AvailableStyle[];
          availableEffectStyles: AvailableStyle[];
          referencedPages: ReferencedPage[];
          warnings: string[];
        };

        setPageName(data.pageName);
        setPageId(data.pageId);
        setClashVars(data.clashVariables);
        setNonRecursicaVars(data.nonRecursicaVariables ?? []);
        setNonRecursicaTextStyles(data.nonRecursicaTextStyles ?? []);
        setNonRecursicaEffectStyles(data.nonRecursicaEffectStyles ?? []);
        setAvailableTextStyles(data.availableTextStyles ?? []);
        setAvailableEffectStyles(data.availableEffectStyles ?? []);
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

        const newNonRecursicaDecisions = new Map<
          string,
          NonRecursicaDecision
        >();
        for (const nrv of data.nonRecursicaVariables ?? []) {
          if (globalIgnored.has(nrv.variableId)) {
            newNonRecursicaDecisions.set(nrv.variableId, { action: "ignore" });
          } else {
            newNonRecursicaDecisions.set(nrv.variableId, { action: null });
          }
        }
        setNonRecursicaDecisions(newNonRecursicaDecisions);

        const newTextStyleDecisions = new Map<string, StyleDecision>();
        for (const style of data.nonRecursicaTextStyles ?? []) {
          newTextStyleDecisions.set(style.styleId, { action: null });
        }
        setTextStyleDecisions(newTextStyleDecisions);

        const newEffectStyleDecisions = new Map<string, StyleDecision>();
        for (const style of data.nonRecursicaEffectStyles ?? []) {
          newEffectStyleDecisions.set(style.styleId, { action: null });
        }
        setEffectStyleDecisions(newEffectStyleDecisions);

        // Determine next step
        if (
          data.clashVariables.length > 0 ||
          filteredUnmatched.length > 0 ||
          (data.nonRecursicaVariables ?? []).length > 0 ||
          (data.nonRecursicaTextStyles ?? []).length > 0 ||
          (data.nonRecursicaEffectStyles ?? []).length > 0
        ) {
          navigate("/apply-recursica-theme/overview", { replace: true });
        } else {
          setLastCompletedPageName(data.pageName);
          handleApply(
            newClashDecisions,
            newUnmatchedDecisions,
            newNonRecursicaDecisions,
            newTextStyleDecisions,
            newEffectStyleDecisions,
          );
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

  const setClashActionFn = (variableId: string, action: "delete" | null) => {
    setClashDecisions((prev) => {
      const next = new Map(prev);
      next.set(variableId, { action });
      return next;
    });
  };

  const setUnmatchedActionFn = (
    variableId: string,
    action: "ignore" | "fix" | null,
  ) => {
    setUnmatchedDecisions((prev) => {
      const next = new Map(prev);
      next.set(variableId, { action });
      return next;
    });
  };

  const setNonRecursicaActionFn = (
    variableId: string,
    action: "ignore" | "fix" | null,
  ) => {
    setNonRecursicaDecisions((prev) => {
      const next = new Map(prev);
      next.set(variableId, { action });
      return next;
    });
  };

  const setTextStyleActionFn = (
    styleId: string,
    action: "ignore" | "map" | null,
    mappedStyleId?: string,
  ) => {
    setTextStyleDecisions((prev) => {
      const next = new Map(prev);
      next.set(styleId, { action, mappedStyleId });
      return next;
    });
  };

  const setEffectStyleActionFn = (
    styleId: string,
    action: "ignore" | "map",
    mappedStyleId?: string,
  ) => {
    setEffectStyleDecisions((prev) => {
      const next = new Map(prev);
      next.set(styleId, { action, mappedStyleId });
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
    nonRecursicaDec: Map<string, NonRecursicaDecision> = nonRecursicaDecisions,
    textStyleDec: Map<string, StyleDecision> = textStyleDecisions,
    effectStyleDec: Map<string, StyleDecision> = effectStyleDecisions,
  ) => {
    navigate("/apply-recursica-theme/applying", { replace: true });
    setError(null);

    try {
      const clashActions = [...clashDec.entries()]
        .filter(([, d]) => d.action !== null)
        .map(([id, d]) => ({ oldVariableId: id, action: d.action! }));

      const unmatchedAsActions = [...unmatchedDec.entries()]
        .filter(([, d]) => d.action !== null)
        .map(([id, d]) => ({
          variableId: id,
          action: d.action!,
          newVariablePath:
            d.action === "fix" ? fixSelections.get(id) : undefined,
        }));

      const nonRecursicaAsActions = [...nonRecursicaDec.entries()]
        .filter(([, d]) => d.action !== null)
        .map(([id, d]) => ({
          variableId: id,
          action: d.action!,
          newVariablePath:
            d.action === "fix" ? fixSelections.get(id) : undefined,
        }));

      const combinedUnmatchedActions = [
        ...unmatchedAsActions,
        ...nonRecursicaAsActions,
      ];

      const textStyleActions = [...textStyleDec.entries()]
        .filter(([, d]) => d.action !== null)
        .map(([id, d]) => ({
          styleId: id,
          action: d.action!,
          mappedStyleId: d.mappedStyleId,
        }));

      const effectStyleActions = [...effectStyleDec.entries()]
        .filter(([, d]) => d.action !== null)
        .map(([id, d]) => ({
          styleId: id,
          action: d.action!,
          mappedStyleId: d.mappedStyleId,
        }));

      const newIgnored = new Set(globalIgnored);
      for (const ua of combinedUnmatchedActions) {
        if (ua.action === "ignore") newIgnored.add(ua.variableId);
      }
      setGlobalIgnored(newIgnored);

      const { promise } = callPlugin(ServiceName.applyPageThemeVariables, {
        clashActions,
        unmatchedActions: combinedUnmatchedActions,
        textStyleActions,
        effectStyleActions,
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

      setLastCompletedPageName(pageName);
      if (processedPages.length > 0) {
        setRemainingPages((prev) => prev.slice(1)); // Remove this page from the queue of dependent pages
      }

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

  const handleSkipPage = () => {
    setRemainingPages((prev) => prev.slice(1));
    handleProceedToNextPage();
  };

  /* ---- Dynamic Pruning ---- */

  // Build a set of node IDs that are scheduled to receive a new Text or Effect Style
  const nodesStrippedByStyleMappings = React.useMemo(() => {
    const nodeIds = new Set<string>();

    // Add nodes from text styles that will be mapped
    for (const ts of nonRecursicaTextStyles) {
      const decision = textStyleDecisions.get(ts.styleId);
      if (decision?.action === "map" && decision.mappedStyleId) {
        for (const b of ts.bindings) nodeIds.add(b.nodeId);
      }
    }

    // Add nodes from effect styles that will be mapped
    for (const es of nonRecursicaEffectStyles) {
      const decision = effectStyleDecisions.get(es.styleId);
      if (decision?.action === "map" && decision.mappedStyleId) {
        for (const b of es.bindings) nodeIds.add(b.nodeId);
      }
    }

    return nodeIds;
  }, [
    nonRecursicaTextStyles,
    nonRecursicaEffectStyles,
    textStyleDecisions,
    effectStyleDecisions,
  ]);

  // Prune the variable issues based on the stripped node IDs
  const prunedClashVars = React.useMemo(() => {
    if (nodesStrippedByStyleMappings.size === 0) return clashVars;
    return clashVars
      .map((issue) => ({
        ...issue,
        bindings: issue.bindings.filter(
          (b) => !nodesStrippedByStyleMappings.has(b.nodeId),
        ),
      }))
      .filter((issue) => issue.bindings.length > 0);
  }, [clashVars, nodesStrippedByStyleMappings]);

  const prunedUnmatchedVars = React.useMemo(() => {
    if (nodesStrippedByStyleMappings.size === 0) return unmatchedVars;
    return unmatchedVars
      .map((issue) => ({
        ...issue,
        bindings: issue.bindings.filter(
          (b) => !nodesStrippedByStyleMappings.has(b.nodeId),
        ),
      }))
      .filter((issue) => issue.bindings.length > 0);
  }, [unmatchedVars, nodesStrippedByStyleMappings]);

  const prunedNonRecursicaVars = React.useMemo(() => {
    if (nodesStrippedByStyleMappings.size === 0) return nonRecursicaVars;
    return nonRecursicaVars
      .map((issue) => ({
        ...issue,
        bindings: issue.bindings.filter(
          (b) => !nodesStrippedByStyleMappings.has(b.nodeId),
        ),
      }))
      .filter((issue) => issue.bindings.length > 0);
  }, [nonRecursicaVars, nodesStrippedByStyleMappings]);

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
    lastCompletedPageName,
    clashVars: prunedClashVars,
    unmatchedVars: prunedUnmatchedVars,
    nonRecursicaVars: prunedNonRecursicaVars,
    nonRecursicaTextStyles,
    nonRecursicaEffectStyles,
    availableTextStyles,
    availableEffectStyles,
    scanWarnings,
    clashDecisions,
    unmatchedDecisions,
    nonRecursicaDecisions,
    textStyleDecisions,
    effectStyleDecisions,
    clashIndex,
    unmatchedIndex,
    nonRecursicaIndex,
    textStyleIndex,
    effectStyleIndex,
    setClashIndex,
    setUnmatchedIndex,
    setNonRecursicaIndex,
    setTextStyleIndex,
    setEffectStyleIndex,
    startScan,
    setClashAction: setClashActionFn,
    setUnmatchedAction: setUnmatchedActionFn,
    setNonRecursicaAction: setNonRecursicaActionFn,
    setTextStyleAction: setTextStyleActionFn,
    setEffectStyleAction: setEffectStyleActionFn,
    handleApply,
    handleSkipPage,
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
