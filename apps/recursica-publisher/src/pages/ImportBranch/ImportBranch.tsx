import { useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { GitHubService } from "../../services/github/githubService";
import { useAuth } from "../../context/useAuth";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { Stack } from "../../components/Stack";
import { Alert } from "../../components/Alert";
import classes from "./ImportBranch.module.css";

const RECURSICA_FIGMA_OWNER = "borderux";
const RECURSICA_FIGMA_REPO = "recursica-figma";

export default function ImportBranch() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [branchInput, setBranchInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!branchInput.trim()) {
      setError("Please enter a branch name or PR URL");
      return;
    }

    setIsLoading(true);

    try {
      const githubService = new GitHubService(accessToken || "");
      const { commitSha, branchName } = await githubService.getCommitFromInput(
        RECURSICA_FIGMA_OWNER,
        RECURSICA_FIGMA_REPO,
        branchInput.trim(),
      );

      const ref = branchName || commitSha;
      navigate(`/import-main?ref=${encodeURIComponent(ref)}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to find branch or PR";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <PageLayout showBackButton={true}>
      <Stack gap={20} className={classes.root}>
        <Title order={1} className={classes.title}>
          Import from Branch
        </Title>

        <Text variant="body" className={classes.description}>
          Please provide the URL to the Pull Request or the name of the branch
          to import from.
        </Text>

        <form onSubmit={handleSubmit} className={classes.form}>
          <TextInput
            label="Branch"
            placeholder="Branch name or PR URL"
            value={branchInput}
            onChange={(e) => {
              setBranchInput(e.target.value);
              setError(null);
            }}
            disabled={isLoading}
            error={!!error}
          />

          {error && (
            <Alert variant="error" className={classes.error}>
              {error}
            </Alert>
          )}

          <Button
            variant="filled"
            disabled={isLoading || !branchInput.trim()}
            className={classes.button}
          >
            {isLoading ? "Loading..." : "Continue"}
          </Button>
        </form>
      </Stack>
    </PageLayout>
  );
}
