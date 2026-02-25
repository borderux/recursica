import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { Title } from "../components/Title";
import { Stack } from "../components/Stack";
import { Button } from "../components/Button";
import { callPlugin } from "../utils/callPlugin";
import { ServiceName } from "../plugin/types/ServiceName";

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

export default function ImportRecursicaJson() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<Record<FileKey, string | null>>({
    tokens: null,
    brand: null,
    uiKit: null,
  });
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    variablesCreated: number;
    variablesAlreadyExisted: number;
    aliasErrors?: string[];
    textStylesCreated?: number;
    textStylesSkipped?: number;
    textStyleWarnings?: string[];
    effectStylesCreated?: number;
    effectStylesSkipped?: number;
    effectStyleWarnings?: string[];
    transformErrors?: string[];
    transformWarnings?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) {
      setFileNames({ tokens: null, brand: null, uiKit: null });
      setResult(null);
      setError(null);
      return;
    }
    const assigned = assignFiles(files);
    if (!assigned) {
      setFileNames({ tokens: null, brand: null, uiKit: null });
      setError(
        "Select exactly three JSON files: one containing tokens, one brand, one ui-kit (e.g. recursica_tokens.json, recursica_brand.json, recursica_ui-kit.json).",
      );
      setResult(null);
      return;
    }
    const a = assigned as {
      tokensFile: File;
      brandFile: File;
      uiKitFile: File;
    };
    setFileNames({
      tokens: a.tokensFile.name,
      brand: a.brandFile.name,
      uiKit: a.uiKitFile.name,
    });
    setError(null);
    setResult(null);
  };

  const handleImport = async () => {
    const input = fileInputRef.current;
    if (!input?.files?.length) {
      setError("Please select the three Recursica JSON files.");
      return;
    }
    const assigned = assignFiles(input.files);
    if (!assigned) {
      setError(
        "Could not assign files. Use recursica_tokens.json, recursica_brand.json, recursica_ui-kit.json (or filenames containing tokens, brand, ui-kit).",
      );
      return;
    }
    const { tokensFile, brandFile, uiKitFile } = assigned;
    setImporting(true);
    setError(null);
    setResult(null);
    try {
      const [tokens, brand, uiKit] = await Promise.all([
        readJson(tokensFile),
        readJson(brandFile),
        readJson(uiKitFile),
      ]);
      const { promise } = callPlugin(ServiceName.importRecursicaJson, {
        tokens,
        brand,
        uiKit,
      });
      const response = await promise;
      const data = response.data as {
        variablesCreated?: number;
        variablesAlreadyExisted?: number;
        aliasErrors?: string[];
        textStylesCreated?: number;
        textStylesSkipped?: number;
        textStyleWarnings?: string[];
        effectStylesCreated?: number;
        effectStylesSkipped?: number;
        effectStyleWarnings?: string[];
        transformErrors?: string[];
        transformWarnings?: string[];
      };
      setResult({
        variablesCreated: data.variablesCreated ?? 0,
        variablesAlreadyExisted: data.variablesAlreadyExisted ?? 0,
        aliasErrors: data.aliasErrors,
        textStylesCreated: data.textStylesCreated,
        textStylesSkipped: data.textStylesSkipped,
        textStyleWarnings: data.textStyleWarnings,
        effectStylesCreated: data.effectStylesCreated,
        effectStylesSkipped: data.effectStylesSkipped,
        effectStyleWarnings: data.effectStyleWarnings,
        transformErrors: data.transformErrors,
        transformWarnings: data.transformWarnings,
      });
      if (response.error || !response.success) {
        setError(response.message ?? "Import failed.");
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  const hasFiles =
    fileNames.tokens != null &&
    fileNames.brand != null &&
    fileNames.uiKit != null;

  return (
    <PageLayout showBackButton={true}>
      <Stack gap={20} style={{ maxWidth: 500 }}>
        <Title order={1}>Import Recursica JSON</Title>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
          Select the three Recursica JSON files:{" "}
          <code>{FILE_NAMES.tokens}</code>, <code>{FILE_NAMES.brand}</code>,{" "}
          <code>{FILE_NAMES.uiKit}</code>. They will be transformed into
          variables and applied to Figma (Tokens, Themes, Layer collections;
          text and effect styles).
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          multiple
          onChange={handleFileChange}
          style={{ display: "block" }}
        />
        {hasFiles && (
          <span style={{ fontSize: 14, color: "#333" }}>
            Selected: {fileNames.tokens}, {fileNames.brand}, {fileNames.uiKit}
          </span>
        )}
        <Stack gap={8} style={{ flexDirection: "row" }}>
          <Button onClick={handleImport} disabled={importing || !hasFiles}>
            {importing ? "Importing…" : "Import"}
          </Button>
          <Button variant="light" onClick={() => navigate("/import")}>
            Back
          </Button>
        </Stack>
        {error && (
          <div
            style={{
              padding: 12,
              backgroundColor: "#fde8e8",
              color: "#c00",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                padding: 12,
                backgroundColor: "#e8f5e9",
                color: "#1b5e20",
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              <strong>Import complete.</strong>
              <br />
              Variables created: {result.variablesCreated}
              <br />
              Variables already existed: {result.variablesAlreadyExisted}
              {(result.textStylesCreated !== undefined ||
                result.textStylesSkipped !== undefined) && (
                <>
                  <br />
                  Text styles created: {result.textStylesCreated ?? 0}, skipped:{" "}
                  {result.textStylesSkipped ?? 0}
                </>
              )}
              {(result.effectStylesCreated !== undefined ||
                result.effectStylesSkipped !== undefined) && (
                <>
                  <br />
                  Effect styles created: {result.effectStylesCreated ?? 0},
                  skipped: {result.effectStylesSkipped ?? 0}
                </>
              )}
            </div>
            {result.transformErrors && result.transformErrors.length > 0 && (
              <div
                style={{
                  padding: 12,
                  backgroundColor: "#ffebee",
                  color: "#b71c1c",
                  borderRadius: 6,
                  fontSize: 14,
                }}
              >
                <strong>
                  Transform errors ({result.transformErrors.length}):
                </strong>
                <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                  {result.transformErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.transformWarnings &&
              result.transformWarnings.length > 0 && (
                <div
                  style={{
                    padding: 12,
                    backgroundColor: "#fff8e1",
                    color: "#f57f17",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                >
                  <strong>
                    Transform warnings ({result.transformWarnings.length}):
                  </strong>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                    {result.transformWarnings.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}
            {result.aliasErrors && result.aliasErrors.length > 0 && (
              <div
                style={{
                  padding: 12,
                  backgroundColor: "#fff3e0",
                  color: "#e65100",
                  borderRadius: 6,
                  fontSize: 14,
                }}
              >
                <strong>Alias errors ({result.aliasErrors.length}):</strong>
                <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                  {result.aliasErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.textStyleWarnings &&
              result.textStyleWarnings.length > 0 && (
                <div
                  style={{
                    padding: 12,
                    backgroundColor: "#fff3e0",
                    color: "#e65100",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                >
                  <strong>
                    Text style warnings ({result.textStyleWarnings.length}):
                  </strong>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                    {result.textStyleWarnings.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}
            {result.effectStyleWarnings &&
              result.effectStyleWarnings.length > 0 && (
                <div
                  style={{
                    padding: 12,
                    backgroundColor: "#fff3e0",
                    color: "#e65100",
                    borderRadius: 6,
                    fontSize: 14,
                  }}
                >
                  <strong>
                    Effect style warnings ({result.effectStyleWarnings.length}):
                  </strong>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                    {result.effectStyleWarnings.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </Stack>
    </PageLayout>
  );
}
