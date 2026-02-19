import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/PageLayout";
import { Title } from "../components/Title";
import { Stack } from "../components/Stack";
import { Button } from "../components/Button";
import { callPlugin } from "../utils/callPlugin";
import { ServiceName } from "../plugin/types/ServiceName";

/**
 * Parse a single line of CSV into cells (handles quoted fields with commas).
 */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      i++;
      let cell = "";
      while (i < line.length) {
        if (line[i] === '"') {
          i++;
          if (line[i] === '"') {
            cell += '"';
            i++;
          } else break;
        } else {
          cell += line[i];
          i++;
        }
      }
      cells.push(cell);
      if (line[i] === ",") i++;
    } else {
      let cell = "";
      while (i < line.length && line[i] !== ",") {
        cell += line[i];
        i++;
      }
      cells.push(cell.trim());
      if (line[i] === ",") i++;
    }
  }
  return cells;
}

function parseCsvToRows(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.length > 0);
  return lines.map(parseCsvLine);
}

export default function ImportVariablesCsv() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    variablesCreated: number;
    variablesAlreadyExisted: number;
    aliasErrors?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(file.name);
      setResult(null);
      setError(null);
    } else {
      setFileSelected(null);
    }
  };

  const handleImport = async () => {
    const input = fileInputRef.current;
    if (!input?.files?.length) {
      setError("Please select a CSV file.");
      return;
    }
    const file = input.files[0];
    setImporting(true);
    setError(null);
    setResult(null);
    try {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
      const rows = parseCsvToRows(text);
      if (rows.length < 2) {
        setError("CSV must have a header row and at least one data row.");
        setImporting(false);
        return;
      }
      const { promise } = callPlugin(ServiceName.importVariablesCsv, {
        rows,
      });
      const response = await promise;
      const data = response.data as {
        variablesCreated?: number;
        variablesAlreadyExisted?: number;
        aliasErrors?: string[];
      };
      setResult({
        variablesCreated: data.variablesCreated ?? 0,
        variablesAlreadyExisted: data.variablesAlreadyExisted ?? 0,
        aliasErrors: data.aliasErrors,
      });
      if (response.error || !response.success) {
        setError(response.message || "Import failed.");
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <PageLayout showBackButton={true}>
      <Stack gap={20} style={{ maxWidth: 500 }}>
        <Title order={1}>Import Variables CSV</Title>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
          Select a FigmaVariables.csv file (collection, figmaVariableName, mode,
          value, type, alias, defaultMode). Collections are created if missing;
          existing variables at the same path are left unchanged.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "block" }}
        />
        {fileSelected && (
          <span style={{ fontSize: 14, color: "#333" }}>
            Selected: {fileSelected}
          </span>
        )}
        <Stack gap={8} style={{ flexDirection: "row" }}>
          <Button onClick={handleImport} disabled={importing || !fileSelected}>
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
            </div>
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
          </div>
        )}
      </Stack>
    </PageLayout>
  );
}
