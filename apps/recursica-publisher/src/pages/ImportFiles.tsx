import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import { validateImport } from "../utils/validateExportFile";
import {
  getRequiredImportFiles,
  fileMatchesRequired,
  type RequiredImportFile,
} from "../utils/getRequiredImportFiles";
import { useImportData, type ImportedFile } from "../context/ImportDataContext";

/**
 * Gets the file GUID and version from a file's metadata
 * @param fileData - The parsed JSON data from an imported file
 * @returns Object with guid and version, or null if not available
 */
function getFileGuid(fileData: unknown): {
  guid: string;
  version: number;
} | null {
  if (!fileData || typeof fileData !== "object" || Array.isArray(fileData)) {
    return null;
  }

  const data = fileData as Record<string, unknown>;
  if (!data.metadata || typeof data.metadata !== "object") {
    return null;
  }

  const metadata = data.metadata as Record<string, unknown>;
  const guid = metadata.guid;
  const version = metadata.version;

  if (typeof guid === "string" && typeof version === "number") {
    return { guid, version };
  }

  return null;
}

/**
 * Generates a consistent key for a required file
 * This key is used for matching and should be consistent across all uses
 * Uses GUID only for deduplication (not version)
 */
function getRequiredFileKey(requiredFile: RequiredImportFile): string {
  if (requiredFile.componentGuid && requiredFile.componentGuid.length > 0) {
    return requiredFile.componentGuid;
  }
  // For unpublished files, use a stable key that doesn't depend on array index
  // Use componentPageName and componentName for uniqueness
  return `page:${requiredFile.componentPageName || "unknown"}:${requiredFile.componentName}`;
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
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
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
  onBrowse?: () => void;
  onRemove?: () => void;
}

function ReferencedFileItem({
  displayName,
  isMatched,
  onBrowse,
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
        {isMatched && (
          <span
            style={{
              marginLeft: "8px",
              color: "#28a745",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            (Valid)
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {!isMatched && onBrowse && (
          <button
            onClick={onBrowse}
            style={{
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: "transparent",
              color: "#d40d0d",
              border: "1px solid #d40d0d",
              borderRadius: "4px",
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
  onBrowseForFile: (requiredFile: {
    componentGuid: string;
    componentVersion: number;
    componentName: string;
    componentPageName?: string;
  }) => void;
  onRemoveAdditionalFile: (fileId: string) => void;
}

function ReferencedFilesArea({
  requiredFiles,
  matchedRequiredFiles,
  additionalFiles,
  onBrowseForFile,
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
        {requiredFiles.map((requiredFile) => {
          // Generate a consistent key for each required file
          const key = getRequiredFileKey(requiredFile);
          const isMatched = matchedRequiredFiles.has(key);
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
              onBrowse={
                !isMatched ? () => onBrowseForFile(requiredFile) : undefined
              }
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
  const navigate = useNavigate();
  const { setImportData } = useImportData();
  const [isDragging, setIsDragging] = useState(false);
  const [mainFile, setMainFile] = useState<ImportedFile | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<ImportedFile[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const referencedFileInputRef = useRef<HTMLInputElement>(null);
  const [browsingForRequiredFile, setBrowsingForRequiredFile] = useState<{
    componentGuid: string;
    componentVersion: number;
    componentName: string;
    componentPageName?: string;
  } | null>(null);

  // Recursively extract all required files (including nested dependencies)
  // Shows all required files so they can be marked as "Valid" when matched
  const requiredFiles = useMemo(() => {
    const allRequiredFiles: RequiredImportFile[] = [];
    const seen = new Set<string>(); // Track unique files to avoid duplicates

    // Helper function to add a file if not already seen
    // Note: We still show required files even if they're already imported,
    // so they can be marked as "Valid" in the UI
    const addIfNotSeen = (file: RequiredImportFile) => {
      const key = getRequiredFileKey(file);
      if (!seen.has(key)) {
        seen.add(key);
        allRequiredFiles.push(file);
        return true;
      }
      return false;
    };

    // Start with main file dependencies
    if (mainFile && mainFile.status === "success" && mainFile.data) {
      const mainDeps = getRequiredImportFiles(mainFile.data);
      for (const dep of mainDeps) {
        addIfNotSeen(dep);
      }
    }

    // Check all additional files for their dependencies
    for (const additionalFile of additionalFiles) {
      if (additionalFile.status === "success" && additionalFile.data) {
        const nestedDeps = getRequiredImportFiles(additionalFile.data);
        for (const dep of nestedDeps) {
          addIfNotSeen(dep);
        }
      }
    }

    return allRequiredFiles;
  }, [mainFile, additionalFiles]);

  // Check which required files are matched by additional files or main file
  const matchedRequiredFiles = useMemo(() => {
    const matched = new Set<string>();

    // Check main file against required files
    if (mainFile && mainFile.status === "success" && mainFile.data) {
      for (const requiredFile of requiredFiles) {
        const key = getRequiredFileKey(requiredFile);
        if (fileMatchesRequired(mainFile.data, requiredFile)) {
          matched.add(key);
        }
      }
    }

    // Check additional files against required files
    for (const additionalFile of additionalFiles) {
      if (additionalFile.status === "success" && additionalFile.data) {
        for (const requiredFile of requiredFiles) {
          const key = getRequiredFileKey(requiredFile);
          if (fileMatchesRequired(additionalFile.data, requiredFile)) {
            matched.add(key);
          }
        }
      }
    }

    return matched;
  }, [mainFile, additionalFiles, requiredFiles]);

  // Calculate missing files count
  const missingFilesCount = useMemo(() => {
    if (requiredFiles.length === 0) {
      return 0;
    }
    let missing = 0;
    for (const requiredFile of requiredFiles) {
      const key = getRequiredFileKey(requiredFile);
      if (!matchedRequiredFiles.has(key)) {
        missing++;
      }
    }
    return missing;
  }, [requiredFiles, matchedRequiredFiles]);

  // Check if we can import (main file is valid and all referenced files are present)
  const canImport = useMemo(() => {
    if (!mainFile || mainFile.status !== "success") {
      return false;
    }
    // If there are no required files, we can import with just the main file
    if (requiredFiles.length === 0) {
      return true;
    }
    // If there are required files, all must be present
    return missingFilesCount === 0;
  }, [mainFile, requiredFiles.length, missingFilesCount]);

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

    const files = Array.from(e.dataTransfer.files);
    const jsonFiles = files.filter(
      (file) => file.type === "application/json" || file.name.endsWith(".json"),
    );

    if (jsonFiles.length === 0) {
      alert("Please drop JSON files");
      return;
    }

    // Process all dropped files
    for (const file of jsonFiles) {
      // First file becomes main file if no main file exists
      // Otherwise, try to match it to a required file
      if (!mainFile) {
        handleFile(file, true);
      } else {
        // Try to match to a required file, otherwise add as additional
        handleFile(file, false);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        if (browsingForRequiredFile) {
          // User is browsing for a specific required file
          handleFile(file, false);
          setBrowsingForRequiredFile(null);
        } else {
          // First file becomes main file if no main file exists
          handleFile(file, !mainFile);
        }
      } else {
        alert("Please select a JSON file");
      }
    }
    // Reset the input so the same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleBrowseForReferencedFile = (requiredFile: {
    componentGuid: string;
    componentVersion: number;
    componentName: string;
    componentPageName?: string;
  }) => {
    setBrowsingForRequiredFile(requiredFile);
    referencedFileInputRef.current?.click();
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

      // Check for duplicates before adding (using GUID only, not version)
      const fileGuid = getFileGuid(jsonData);
      if (fileGuid) {
        const fileGuidKey = fileGuid.guid;

        // Check if this file matches the main file
        if (mainFile && mainFile.status === "success" && mainFile.data) {
          const mainFileGuid = getFileGuid(mainFile.data);
          if (mainFileGuid && mainFileGuid.guid === fileGuidKey) {
            alert("This file is already set as the main import file.");
            return;
          }
        }

        // Check if this file is already in additionalFiles
        const isDuplicate = additionalFiles.some((additionalFile) => {
          if (additionalFile.status === "success" && additionalFile.data) {
            const additionalFileGuid = getFileGuid(additionalFile.data);
            if (additionalFileGuid) {
              return additionalFileGuid.guid === fileGuidKey;
            }
          }
          return false;
        });

        if (isDuplicate) {
          alert("This file is already in the imported files list.");
          return;
        }
      }

      console.log("Imported JSON:", jsonData);

      // Update file status to success
      const updatedFile = {
        ...newFile,
        status: "success" as const,
        data: jsonData,
      };

      // Add file to appropriate list after validation and duplicate check
      if (isMain || !mainFile) {
        setMainFile(updatedFile);
      } else {
        setAdditionalFiles((prev) => [...prev, updatedFile]);
      }
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
        setAdditionalFiles((prev) => [...prev, errorFile]);
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
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxSizing: "border-box",
          minHeight: "100%",
          position: "relative",
          backgroundColor: isDragging
            ? "rgba(212, 13, 13, 0.05)"
            : "transparent",
          transition: "background-color 0.2s ease",
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
          Import Files
        </h1>

        <div
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
          <input
            ref={referencedFileInputRef}
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
          onBrowseForFile={handleBrowseForReferencedFile}
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
              // Store import data in context and navigate to importing page
              if (canImport) {
                setImportData({
                  mainFile: mainFile!,
                  additionalFiles,
                  source: {
                    type: "local",
                  },
                });
                // Navigate to importing page which will redirect to wizard
                navigate("/importing");
              }
            }}
            disabled={!canImport}
            style={{
              width: "100%",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor: !canImport ? "#ccc" : "#d40d0d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: !canImport ? "not-allowed" : "pointer",
              opacity: !canImport ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (canImport) {
                e.currentTarget.style.backgroundColor = "#b30b0b";
              }
            }}
            onMouseOut={(e) => {
              if (canImport) {
                e.currentTarget.style.backgroundColor = "#d40d0d";
              }
            }}
          >
            {canImport
              ? "Ready to Import"
              : missingFilesCount > 0
                ? `Missing references (${missingFilesCount})`
                : "Ready to Import"}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
