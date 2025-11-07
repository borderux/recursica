import React, { useState, useRef, useMemo } from "react";
import PageLayout from "../components/PageLayout";
import { validateImport } from "../utils/validateExportFile";
import {
  getRequiredImportFiles,
  fileMatchesRequired,
} from "../utils/getRequiredImportFiles";

interface ImportedFile {
  id: string;
  name: string;
  size: number;
  data: unknown;
  status: "pending" | "success" | "error";
  error?: string;
}

interface FileListItemProps {
  name: string;
  status: "pending" | "success" | "error";
  onRemove: () => void;
}

function FileListItem({ name, status, onRemove }: FileListItemProps) {
  return (
    <div
      style={{
        padding: "10px 12px",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        backgroundColor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#333",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {name}
        {status === "pending" && (
          <span style={{ marginLeft: "8px", color: "#666" }}>
            (Processing...)
          </span>
        )}
        {status === "error" && (
          <span
            style={{
              marginLeft: "8px",
              color: "#d40d0d",
            }}
          >
            (Invalid File)
          </span>
        )}
      </div>
      <button
        onClick={onRemove}
        style={{
          marginLeft: "12px",
          padding: "4px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          flexShrink: 0,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "#d40d0d";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "#666";
        }}
        aria-label="Remove file"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

interface MainFileAreaProps {
  mainFile: ImportedFile | null;
  onRemove: () => void;
}

function MainFileArea({ mainFile, onRemove }: MainFileAreaProps) {
  // Get display name from metadata if available, otherwise use filename
  const displayName = React.useMemo(() => {
    if (!mainFile || mainFile.status !== "success" || !mainFile.data) {
      return mainFile?.name || "";
    }
    const data = mainFile.data as Record<string, unknown>;
    const metadata = data.metadata as Record<string, unknown> | undefined;
    if (metadata && typeof metadata.name === "string") {
      return metadata.name;
    }
    return mainFile.name;
  }, [mainFile]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        marginTop: "24px",
        flexShrink: 0,
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "12px",
        }}
      >
        Import File
      </h2>
      {mainFile ? (
        <FileListItem
          name={displayName}
          status={mainFile.status}
          onRemove={onRemove}
        />
      ) : (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#999",
            fontSize: "14px",
          }}
        >
          No file imported yet
        </div>
      )}
    </div>
  );
}

interface ReferencedFileItemProps {
  displayName: string;
  isMatched: boolean;
  onRemove?: () => void;
}

function ReferencedFileItem({
  displayName,
  isMatched,
  onRemove,
}: ReferencedFileItemProps) {
  return (
    <div
      style={{
        padding: "10px 12px",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        backgroundColor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#333",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {displayName}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isMatched ? (
          <span
            style={{
              color: "#28a745",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Ready
          </span>
        ) : (
          <span
            style={{
              color: "#666",
              fontSize: "12px",
            }}
          >
            (Missing)
          </span>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            style={{
              padding: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              flexShrink: 0,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#d40d0d";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#666";
            }}
            aria-label="Remove file"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface ReferencedFilesAreaProps {
  requiredFiles: Array<{
    componentGuid: string;
    componentVersion: number;
    componentName: string;
    componentPageName?: string;
  }>;
  matchedRequiredFiles: Set<string>;
  additionalFiles: ImportedFile[];
  onRemoveAdditionalFile: (fileId: string) => void;
}

function ReferencedFilesArea({
  requiredFiles,
  matchedRequiredFiles,
  additionalFiles,
  onRemoveAdditionalFile,
}: ReferencedFilesAreaProps) {
  if (requiredFiles.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        marginTop: "24px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "12px",
          flexShrink: 0,
        }}
      >
        Referenced Files
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Show required files with their status */}
        {requiredFiles.map((requiredFile, index) => {
          // Generate a unique key for each required file
          // For published components, use GUID:version
          // For unpublished/unknown, use a combination that ensures uniqueness
          const key =
            requiredFile.componentGuid && requiredFile.componentVersion !== 0
              ? `${requiredFile.componentGuid}:${requiredFile.componentVersion}`
              : `${requiredFile.componentPageName || "unknown"}:${requiredFile.componentName}:${index}`;
          const isMatched = matchedRequiredFiles.has(
            requiredFile.componentGuid && requiredFile.componentVersion !== 0
              ? `${requiredFile.componentGuid}:${requiredFile.componentVersion}`
              : key,
          );
          // Use componentPageName as the display name for referenced files
          const displayName =
            requiredFile.componentPageName ||
            requiredFile.componentName ||
            "Unknown";

          // Find the matching additional file if it exists
          const matchingFile = additionalFiles.find(
            (file) =>
              file.status === "success" &&
              file.data &&
              fileMatchesRequired(file.data, requiredFile),
          );

          return (
            <ReferencedFileItem
              key={key}
              displayName={displayName}
              isMatched={isMatched}
              onRemove={
                matchingFile
                  ? () => onRemoveAdditionalFile(matchingFile.id)
                  : undefined
              }
            />
          );
        })}
        {/* Show additional imported files that don't match required files */}
        {additionalFiles
          .filter((file) => {
            // Only show files that don't match any required file
            if (file.status !== "success" || !file.data) {
              return true; // Show error/pending files
            }
            return !requiredFiles.some((requiredFile) =>
              fileMatchesRequired(file.data, requiredFile),
            );
          })
          .map((file) => (
            <FileListItem
              key={file.id}
              name={file.name}
              status={file.status}
              onRemove={() => onRemoveAdditionalFile(file.id)}
            />
          ))}
      </div>
    </div>
  );
}

export default function Import() {
  const [isDragging, setIsDragging] = useState(false);
  const [mainFile, setMainFile] = useState<ImportedFile | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<ImportedFile[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract required files from main file
  const requiredFiles = useMemo(() => {
    if (!mainFile || mainFile.status !== "success" || !mainFile.data) {
      return [];
    }
    return getRequiredImportFiles(mainFile.data);
  }, [mainFile]);

  // Check which required files are matched by additional files
  const matchedRequiredFiles = useMemo(() => {
    const matched = new Set<string>();
    for (const additionalFile of additionalFiles) {
      if (additionalFile.status === "success" && additionalFile.data) {
        for (let i = 0; i < requiredFiles.length; i++) {
          const requiredFile = requiredFiles[i];
          // Generate the same key format as in ReferencedFilesArea
          const key =
            requiredFile.componentGuid && requiredFile.componentVersion !== 0
              ? `${requiredFile.componentGuid}:${requiredFile.componentVersion}`
              : `${requiredFile.componentPageName || "unknown"}:${requiredFile.componentName}:${i}`;
          if (fileMatchesRequired(additionalFile.data, requiredFile)) {
            matched.add(key);
          }
        }
      }
    }
    return matched;
  }, [additionalFiles, requiredFiles]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        // First file becomes main file if no main file exists
        handleFile(file, !mainFile);
      } else {
        alert("Please drop a JSON file");
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        // First file becomes main file if no main file exists
        handleFile(file, !mainFile);
      } else {
        alert("Please select a JSON file");
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (file: File, isMain: boolean = false) => {
    const fileId = `${file.name}-${Date.now()}`;
    const newFile: ImportedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      data: null,
      status: "pending",
    };

    // Add file to appropriate list immediately with pending status
    if (isMain || !mainFile) {
      setMainFile(newFile);
    } else {
      setAdditionalFiles((prev) => [...prev, newFile]);
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      // Validate the file structure
      const validation = validateImport(jsonData);
      if (!validation.valid) {
        const errorMessage = validation.error || "Invalid export file format";
        console.error("File validation error:", errorMessage);
        setValidationError("Invalid File");
        throw new Error(errorMessage);
      }

      // Clear validation error if file is valid
      setValidationError(null);

      console.log("Imported JSON:", jsonData);

      // Update file status to success
      const updatedFile = {
        ...newFile,
        status: "success" as const,
        data: jsonData,
      };

      if (isMain || !mainFile) {
        setMainFile(updatedFile);
      } else {
        setAdditionalFiles((prev) =>
          prev.map((f) => (f.id === fileId ? updatedFile : f)),
        );
      }

      // TODO: Handle the imported JSON data
      // You can dispatch an action, call a service, etc.
    } catch (error) {
      console.error("Error reading file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to read file";

      // Update file status to error
      const errorFile = {
        ...newFile,
        status: "error" as const,
        error: errorMessage,
      };

      if (isMain || !mainFile) {
        setMainFile(errorFile);
      } else {
        setAdditionalFiles((prev) =>
          prev.map((f) => (f.id === fileId ? errorFile : f)),
        );
      }
    }
  };

  const handleRemoveMainFile = () => {
    setMainFile(null);
    setAdditionalFiles([]);
    setValidationError(null);
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAdditionalFile = (fileId: string) => {
    setAdditionalFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <PageLayout showBackButton={true}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "24px",
            flexShrink: 0,
          }}
        >
          Import
        </h1>

        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            width: "100%",
            maxWidth: "500px",
            minHeight: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            backgroundColor: isDragging ? "#f0f0f0" : "transparent",
            border: isDragging ? "2px dashed #d40d0d" : "2px dashed #ccc",
            borderRadius: "8px",
            transition: "all 0.2s ease",
            padding: "20px",
            flexShrink: 0,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />

          <p
            style={{
              fontSize: "14px",
              color: "#333",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            Drop files here to import
          </p>

          <button
            onClick={handleBrowseClick}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: "transparent",
              color: "#d40d0d",
              border: "2px solid #d40d0d",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#d40d0d";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#d40d0d";
            }}
          >
            Browse
          </button>
        </div>

        {/* Error Area */}
        {validationError && (
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              marginTop: "24px",
              padding: "12px 16px",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "6px",
              color: "#d40d0d",
              fontSize: "14px",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {validationError}
          </div>
        )}

        {/* Recursica JSON File */}
        <MainFileArea mainFile={mainFile} onRemove={handleRemoveMainFile} />

        {/* Referenced Files */}
        <ReferencedFilesArea
          requiredFiles={requiredFiles}
          matchedRequiredFiles={matchedRequiredFiles}
          additionalFiles={additionalFiles}
          onRemoveAdditionalFile={handleRemoveAdditionalFile}
        />

        {/* Ready to Import Button */}
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            marginTop: "24px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => {
              // TODO: Handle import action
              console.log("Importing files:", { mainFile, additionalFiles });
            }}
            disabled={
              !mainFile ||
              mainFile.status !== "success" ||
              requiredFiles.length > matchedRequiredFiles.size
            }
            style={{
              width: "100%",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor:
                !mainFile ||
                mainFile.status !== "success" ||
                requiredFiles.length > matchedRequiredFiles.size
                  ? "#ccc"
                  : "#d40d0d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor:
                !mainFile ||
                mainFile.status !== "success" ||
                requiredFiles.length > matchedRequiredFiles.size
                  ? "not-allowed"
                  : "pointer",
              opacity:
                !mainFile ||
                mainFile.status !== "success" ||
                requiredFiles.length > matchedRequiredFiles.size
                  ? 0.6
                  : 1,
            }}
            onMouseOver={(e) => {
              if (
                mainFile &&
                mainFile.status === "success" &&
                requiredFiles.length === matchedRequiredFiles.size
              ) {
                e.currentTarget.style.backgroundColor = "#b30b0b";
              }
            }}
            onMouseOut={(e) => {
              if (
                mainFile &&
                mainFile.status === "success" &&
                requiredFiles.length === matchedRequiredFiles.size
              ) {
                e.currentTarget.style.backgroundColor = "#d40d0d";
              }
            }}
          >
            Ready to Import
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
