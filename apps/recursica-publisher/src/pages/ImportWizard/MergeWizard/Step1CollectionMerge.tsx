import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { callPlugin } from "../../../utils/callPlugin";
import type { PrimaryImportMetadata } from "../../../plugin/services/singleComponentImportService";
import {
  FIXED_COLLECTION_GUIDS,
  VALID_COLLECTION_NAMES,
} from "../../../const/CollectionConstants";

interface CollectionMergeChoice {
  newCollectionId: string;
  newCollectionName: string;
  newCollectionGuid: string | null;
  existingCollectionId: string | null;
  existingCollectionName: string | null;
  choice: "merge" | "keep";
}

export default function Step1CollectionMerge() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PrimaryImportMetadata | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [collections, setCollections] = useState<CollectionMergeChoice[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get metadata
        const { promise } = callPlugin("checkForExistingPrimaryImport", {});
        const response = await promise;

        if (response.success && response.data) {
          const data = response.data as {
            exists: boolean;
            pageId?: string;
            metadata?: PrimaryImportMetadata;
          };

          if (data.exists && data.metadata && data.pageId) {
            setMetadata(data.metadata);
            setPageId(data.pageId);

            // Get GUIDs for newly created collections
            const newCollectionIds = data.metadata.createdCollections.map(
              (c) => c.collectionId,
            );
            const { promise: guidsPromise } = callPlugin("getCollectionGuids", {
              collectionIds: newCollectionIds,
            });
            const guidsResponse = await guidsPromise;

            // Get existing collections
            const { promise: collectionsPromise } = callPlugin(
              "getLocalVariableCollections",
              {},
            );
            const collectionsResponse = await collectionsPromise;

            if (
              collectionsResponse.success &&
              collectionsResponse.data &&
              guidsResponse.success &&
              guidsResponse.data
            ) {
              const collectionsData = collectionsResponse.data as unknown;
              const localCollections =
                (
                  collectionsData as {
                    collections?: Array<{
                      id: string;
                      name: string;
                      guid?: string;
                    }>;
                  }
                ).collections || [];

              const guidsData = guidsResponse.data as unknown;
              const collectionGuids =
                (
                  guidsData as {
                    collectionGuids?: Array<{
                      collectionId: string;
                      guid: string | null;
                    }>;
                  }
                ).collectionGuids || [];

              // Build map of GUID to collection info for existing collections
              // For standard collections, we need to match by both GUID and correct name
              const existingMapByGuid = new Map<
                string,
                { id: string; name: string }
              >();

              for (const collection of localCollections) {
                // Only add if it's not one of the newly created collections
                const isNewCollection = data.metadata.createdCollections.some(
                  (c: { collectionId: string }) =>
                    c.collectionId === collection.id,
                );
                if (!isNewCollection && collection.guid) {
                  // For standard collections, only add if name matches the expected name
                  const isStandardGuid =
                    collection.guid === FIXED_COLLECTION_GUIDS.LAYER ||
                    collection.guid === FIXED_COLLECTION_GUIDS.TOKENS ||
                    collection.guid === FIXED_COLLECTION_GUIDS.THEME;

                  if (isStandardGuid) {
                    // Check if name matches expected name for this GUID
                    let expectedName = "";
                    if (collection.guid === FIXED_COLLECTION_GUIDS.LAYER) {
                      expectedName = VALID_COLLECTION_NAMES.LAYER;
                    } else if (
                      collection.guid === FIXED_COLLECTION_GUIDS.TOKENS
                    ) {
                      expectedName = VALID_COLLECTION_NAMES.TOKENS;
                    } else if (
                      collection.guid === FIXED_COLLECTION_GUIDS.THEME
                    ) {
                      expectedName = VALID_COLLECTION_NAMES.THEME;
                    }

                    // Only add if name matches expected name
                    if (collection.name === expectedName) {
                      existingMapByGuid.set(collection.guid, {
                        id: collection.id,
                        name: collection.name,
                      });
                    }
                  } else {
                    // For non-standard collections, add by GUID
                    existingMapByGuid.set(collection.guid, {
                      id: collection.id,
                      name: collection.name,
                    });
                  }
                }
              }

              // Build map of new collection ID to GUID
              const newCollectionGuidMap = new Map<string, string | null>();
              for (const guidInfo of collectionGuids) {
                newCollectionGuidMap.set(guidInfo.collectionId, guidInfo.guid);
              }

              // Build collection choices
              const choices: CollectionMergeChoice[] = [];
              for (const newCollection of data.metadata.createdCollections) {
                const newCollectionGuid =
                  newCollectionGuidMap.get(newCollection.collectionId) || null;

                // Check if GUID matches a fixed GUID for standard collections
                const isStandardCollection =
                  newCollectionGuid === FIXED_COLLECTION_GUIDS.LAYER ||
                  newCollectionGuid === FIXED_COLLECTION_GUIDS.TOKENS ||
                  newCollectionGuid === FIXED_COLLECTION_GUIDS.THEME;

                // Find existing collection by GUID
                let existing: { id: string; name: string } | null = null;
                if (newCollectionGuid) {
                  existing = existingMapByGuid.get(newCollectionGuid) || null;
                }

                // For standard collections, if no existing found, we should still allow merge
                // (it will create/find the standard collection)
                const shouldDefaultToMerge = isStandardCollection;

                choices.push({
                  newCollectionId: newCollection.collectionId,
                  newCollectionName: newCollection.collectionName,
                  newCollectionGuid,
                  existingCollectionId: existing?.id || null,
                  existingCollectionName: existing?.name || null,
                  choice: existing || shouldDefaultToMerge ? "merge" : "keep", // Default to merge for standard collections
                });
              }
              setCollections(choices);
            }
          } else {
            navigate("/import-wizard/existing");
          }
        } else {
          navigate("/import-wizard/existing");
        }
      } catch (err) {
        console.error("Error loading merge data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    };

    loadData();
  }, [navigate]);

  const handleChoiceChange = (index: number, choice: "merge" | "keep") => {
    const updated = [...collections];
    updated[index].choice = choice;
    setCollections(updated);
  };

  const handleMerge = async () => {
    if (!pageId || !metadata) {
      setError("Missing required data");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { promise } = callPlugin("mergeImportGroup", {
        pageId,
        collectionChoices: collections.map((c) => ({
          newCollectionId: c.newCollectionId,
          newCollectionGuid: c.newCollectionGuid,
          existingCollectionId: c.existingCollectionId,
          choice: c.choice,
        })),
      });
      const result = await promise;

      if (result.success) {
        // Navigate back to home
        navigate("/");
      } else {
        setError(result.message || "Failed to merge import group");
        setLoading(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to merge import group";
      setError(errorMessage);
      setLoading(false);
      console.error("[Step1CollectionMerge] Error:", err);
    }
  };

  if (!metadata || collections.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px",
            marginTop: "0",
          }}
        >
          Merge Collections
        </h1>
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          Choose how to handle newly created collections. You can merge them
          into existing collections or keep them as separate copies.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {collections.map((collection, index) => (
          <div
            key={collection.newCollectionId}
            style={{
              padding: "16px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              {collection.newCollectionName}
            </div>
            {collection.existingCollectionName ? (
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                Existing collection found: "{collection.existingCollectionName}"
              </div>
            ) : (
              (() => {
                const isStandard =
                  collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.LAYER ||
                  collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.TOKENS ||
                  collection.newCollectionGuid === FIXED_COLLECTION_GUIDS.THEME;

                if (isStandard) {
                  let standardName = "Standard";
                  if (
                    collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.LAYER
                  ) {
                    standardName = VALID_COLLECTION_NAMES.LAYER;
                  } else if (
                    collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.TOKENS
                  ) {
                    standardName = VALID_COLLECTION_NAMES.TOKENS;
                  } else if (
                    collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.THEME
                  ) {
                    standardName = VALID_COLLECTION_NAMES.THEME;
                  }

                  return (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "12px",
                      }}
                    >
                      Standard collection ({standardName}): Will merge into or
                      create standard collection
                    </div>
                  );
                }
                return null;
              })()
            )}
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              {(() => {
                const isStandard =
                  collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.LAYER ||
                  collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.TOKENS ||
                  collection.newCollectionGuid === FIXED_COLLECTION_GUIDS.THEME;
                const showMerge = collection.existingCollectionId || isStandard;

                if (showMerge) {
                  let standardName = "";
                  if (
                    collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.LAYER
                  ) {
                    standardName = VALID_COLLECTION_NAMES.LAYER;
                  } else if (
                    collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.TOKENS
                  ) {
                    standardName = VALID_COLLECTION_NAMES.TOKENS;
                  } else if (
                    collection.newCollectionGuid ===
                    FIXED_COLLECTION_GUIDS.THEME
                  ) {
                    standardName = VALID_COLLECTION_NAMES.THEME;
                  }

                  return (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`collection-${index}`}
                        checked={collection.choice === "merge"}
                        onChange={() => handleChoiceChange(index, "merge")}
                        disabled={loading}
                      />
                      <span>
                        {collection.existingCollectionId
                          ? "Merge into existing"
                          : `Merge into ${standardName} (will create if needed)`}
                      </span>
                    </label>
                  );
                }
                return null;
              })()}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`collection-${index}`}
                  checked={collection.choice === "keep"}
                  onChange={() => handleChoiceChange(index, "keep")}
                  disabled={loading}
                />
                <span>Keep Copy</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            color: "#c62828",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => navigate("/import-wizard/existing")}
          disabled={loading}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "normal",
            backgroundColor: loading ? "#ccc" : "#fff",
            color: loading ? "#999" : "#333",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleMerge}
          disabled={loading}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: loading ? "#ccc" : "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Merging..." : "Merge"}
        </button>
      </div>
    </div>
  );
}
