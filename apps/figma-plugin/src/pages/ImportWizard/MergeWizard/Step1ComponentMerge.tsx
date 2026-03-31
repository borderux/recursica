import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Radio,
  Stack,
  Text,
  Paper,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import { callPlugin } from "../../../utils/callPlugin";
import {
  useImportWizard,
  type ComponentMergeChoice,
} from "../../../context/ImportWizardContext";
import { useFooterActions } from "../../../context/FooterActionsContext";
import type { ComponentMergeOption } from "../../../plugin/services/import-export/getComponentMergeOptions";

export default function Step1ComponentMerge() {
  const navigate = useNavigate();
  const { setWizardState } = useImportWizard();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ComponentMergeOption[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<ComponentMergeChoice[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const { promise } = callPlugin("getComponentMergeOptions", {});
        const response = await promise;

        if (response.success && response.data) {
          const data = response.data as { components: ComponentMergeOption[] };
          setOptions(data.components);

          // Initialize choices
          const initialChoices: ComponentMergeChoice[] = data.components.map(
            (opt) => {
              const hasExisting = opt.existingVersions.length > 0;
              return {
                guid: opt.guid,
                name: opt.name,
                importedPageId: opt.importedPageId,
                choice: hasExisting ? "deprecate" : "keep",
              };
            },
          );

          setChoices(initialChoices);
        } else {
          setError(
            response.message || "Failed to load component merge options",
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleNext = useCallback(async () => {
    if (currentIndex < options.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setWizardState((prev) => ({ ...prev, componentMergeChoices: choices }));
      navigate("/import-wizard/merge/progress");
    }
  }, [currentIndex, options.length, choices, navigate, setWizardState]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      navigate("/import-wizard/existing");
    }
  }, [currentIndex, navigate]);

  const updateChoice = (choice: "deprecate" | "keep" | "use_existing") => {
    const newChoices = [...choices];
    newChoices[currentIndex] = { ...newChoices[currentIndex], choice };
    setChoices(newChoices);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentIndex]);

  useFooterActions(
    !loading && !error && options.length > 0
      ? {
          primary: {
            label: currentIndex === options.length - 1 ? "Merge" : "Next",
            onClick: handleNext,
          },
          onBackOverride: handleBack,
        }
      : null,
    [loading, error, options.length, currentIndex, handleBack, handleNext],
  );

  if (loading) {
    return (
      <Center h="100%">
        <Stack align="center">
          <Loader size="lg" />
          <Text>Scanning Figma document for instances...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100%">
        <Stack align="center" c="red">
          <Text fw={500}>Error parsing document</Text>
          <Text>{error}</Text>
          <Button onClick={() => navigate("/import-wizard/existing")}>
            Back
          </Button>
        </Stack>
      </Center>
    );
  }

  // If there are exactly 0 imported components found, auto-skip to the end
  if (options.length === 0 && !loading && !error) {
    navigate("/import-wizard/existing", { replace: true });
    return null; // Return null so we don't flash UI before redirect
  }

  const currentOption = options[currentIndex];
  const currentChoice = choices[currentIndex];
  const isCompletelyNew = currentOption.existingVersions.length === 0;

  return (
    <Stack gap="xl" maw={600} mx="auto" w="100%">
      <Stack gap="xs">
        <Text c="dimmed" size="sm" fw={500}>
          Component {currentIndex + 1} of {options.length}
        </Text>
        <Title order={2}>{currentOption.name.replace(/⚠️\s*/, "")}</Title>
        <Text size="sm" c="dimmed">
          Choose how to integrate this update into your Figma file
        </Text>
      </Stack>

      <Paper withBorder p="md" radius="md">
        {isCompletelyNew ? (
          <Stack gap="md">
            <Text fw={500}>Completely New Component</Text>
            <Text size="sm" c="dimmed">
              This component doesn't conflict with anything currently in the
              file. It will be added safely.
            </Text>
          </Stack>
        ) : (
          <Stack gap="lg">
            <Radio.Group
              value={currentChoice.choice}
              onChange={(val) =>
                updateChoice(val as ComponentMergeChoice["choice"])
              }
              name="mergeStrategy"
            >
              <Stack mt="xs" gap="md">
                <Radio
                  value="deprecate"
                  label="Deprecate"
                  description="Renames all old versions so external libraries don't break, and migrates all local instances to use this new one."
                />

                <Radio
                  value="keep"
                  label="Keep Both"
                  description="Keep the older version and this new version"
                />

                <Radio
                  value="use_existing"
                  label="Discard Update"
                  description="Discards this update and keeps the old version"
                />
              </Stack>
            </Radio.Group>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
