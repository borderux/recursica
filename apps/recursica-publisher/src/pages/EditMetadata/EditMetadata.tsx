import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { callPlugin } from "../../utils/callPlugin";
import type { ComponentMetadata } from "../../plugin/services/getComponentMetadata";
import {
  Title,
  Text,
  Stack,
  Button,
  Alert,
  LoadingSpinner,
  TextInput,
  Textarea,
} from "../../components";
import classes from "./EditMetadata.module.css";

export default function EditMetadata() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(null);
  const [pageName, setPageName] = useState<string>("");
  const [historyJson, setHistoryJson] = useState<string>("{}");

  // Form state
  const [formData, setFormData] = useState<ComponentMetadata>({
    _ver: 1,
    id: "",
    name: "",
    version: 0,
    publishDate: "",
    history: {},
    description: "",
    url: "",
  });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        const { promise } = callPlugin("getComponentMetadata", {});
        const response = await promise;

        if (response.success && response.data) {
          const responseData = response.data as {
            componentMetadata: ComponentMetadata;
            currentPageIndex: number;
          };
          const metadata = responseData.componentMetadata;
          setCurrentPageIndex(responseData.currentPageIndex);
          setPageName(metadata.name || "");
          setFormData({
            _ver: metadata._ver || 1,
            id: metadata.id || "",
            name: metadata.name || "",
            version: metadata.version || 0,
            publishDate: metadata.publishDate || "",
            history: metadata.history || {},
            description: metadata.description || "",
            url: metadata.url || "",
          });
          setHistoryJson(JSON.stringify(metadata.history || {}, null, 2));
        } else {
          setError(
            response.message || "Failed to load metadata for current page",
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load metadata";
        setError(errorMessage);
        console.error("[EditMetadata] Error loading metadata:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  const handleSave = async () => {
    if (currentPageIndex === null) {
      setError("No page selected");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.id.trim()) {
        setError("GUID (id) is required");
        setSaving(false);
        return;
      }

      if (!formData.name.trim()) {
        setError("Name is required");
        setSaving(false);
        return;
      }

      // Parse history JSON string
      let history: Record<string, unknown>;
      try {
        history = JSON.parse(historyJson || "{}");
      } catch {
        setError("History must be valid JSON");
        setSaving(false);
        return;
      }

      const metadataToSave: ComponentMetadata = {
        _ver: formData._ver,
        id: formData.id.trim(),
        name: formData.name.trim(),
        version: formData.version,
        publishDate: formData.publishDate.trim(),
        history: history,
        description: formData.description?.trim() || undefined,
        url: formData.url?.trim() || undefined,
      };

      const { promise } = callPlugin("storePageMetadata", {
        pageIndex: currentPageIndex,
        metadata: metadataToSave,
      });
      const response = await promise;

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to save metadata");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save metadata";
      setError(errorMessage);
      console.error("[EditMetadata] Error saving metadata:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout showBackButton={true}>
        <Stack gap="md" align="center" className={classes.loadingContainer}>
          <LoadingSpinner />
          <Text className={classes.loadingText}>Loading metadata...</Text>
        </Stack>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton={true}>
      <Stack gap="lg" className={classes.root}>
        <div className={classes.header}>
          <Title order={1} mb="xs">
            Edit Metadata
          </Title>
          <Text variant="small" className={classes.description}>
            Editing metadata for page: <strong>{pageName}</strong>
          </Text>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && (
          <Alert variant="success">Metadata saved successfully!</Alert>
        )}

        <Stack gap="md" className={classes.form}>
          <div>
            <Text variant="small" className={classes.label}>
              Revision Number (_ver)
            </Text>
            <TextInput
              type="number"
              value={formData._ver}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  _ver: parseInt(e.target.value) || 1,
                })
              }
              min={1}
              className={classes.input}
            />
          </div>

          <div>
            <Text variant="small" className={classes.label}>
              GUID (id) *
            </Text>
            <TextInput
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="Enter component GUID"
              className={classes.input}
            />
          </div>

          <div>
            <Text variant="small" className={classes.label}>
              Name *
            </Text>
            <TextInput
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter component name"
              className={classes.input}
            />
          </div>

          <div>
            <Text variant="small" className={classes.label}>
              Version
            </Text>
            <TextInput
              type="number"
              value={formData.version}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  version: parseInt(e.target.value) || 0,
                })
              }
              min={0}
              className={classes.input}
            />
          </div>

          <div>
            <Text variant="small" className={classes.label}>
              Publish Date (ISO format)
            </Text>
            <TextInput
              value={formData.publishDate}
              onChange={(e) =>
                setFormData({ ...formData, publishDate: e.target.value })
              }
              placeholder="2024-01-01T00:00:00.000Z"
              className={classes.input}
            />
            <Text
              variant="small"
              color="secondary"
              className={classes.helperText}
            >
              ISO 8601 format (e.g., 2024-01-01T00:00:00.000Z)
            </Text>
          </div>

          <div>
            <Text variant="small" className={classes.label}>
              Description
            </Text>
            <Textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter component description"
              rows={3}
              className={classes.input}
            />
          </div>

          <div>
            <Text variant="small" className={classes.label}>
              URL
            </Text>
            <TextInput
              type="url"
              value={formData.url || ""}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="Enter component URL"
              className={classes.input}
            />
          </div>

          <div>
            <Text variant="small" className={classes.label}>
              History (JSON)
            </Text>
            <Textarea
              value={historyJson}
              onChange={(e) => {
                setHistoryJson(e.target.value);
                try {
                  const parsed = JSON.parse(e.target.value || "{}");
                  setFormData({ ...formData, history: parsed });
                } catch {
                  // Invalid JSON, but allow typing - will be validated on save
                }
              }}
              placeholder='{"key": "value"}'
              rows={5}
              className={classes.input}
            />
            <Text
              variant="small"
              color="secondary"
              className={classes.helperText}
            >
              Enter valid JSON object
            </Text>
          </div>
        </Stack>

        <div className={classes.actions}>
          <Button onClick={() => navigate("/admin")} disabled={saving}>
            Cancel
          </Button>
          <Button variant="filled" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Metadata"}
          </Button>
        </div>
      </Stack>
    </PageLayout>
  );
}
