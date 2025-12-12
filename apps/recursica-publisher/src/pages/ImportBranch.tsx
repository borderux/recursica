import { useState } from "react";
import { useNavigate } from "react-router";
import PageLayout from "../components/PageLayout";
import { GitHubService } from "../services/github/githubService";
import { useAuth } from "../context/useAuth";

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
      // GitHubService can work without auth for public repos
      // Pass empty string if no token (service will handle it)
      const githubService = new GitHubService(accessToken || "");
      const { commitSha, branchName } = await githubService.getCommitFromInput(
        RECURSICA_FIGMA_OWNER,
        RECURSICA_FIGMA_REPO,
        branchInput.trim(),
      );

      // Navigate to ImportMain with the commit SHA or branch name as a parameter
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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "8px",
            marginTop: "0",
          }}
        >
          Import from Branch
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "0",
            maxWidth: "600px",
          }}
        >
          Please provide the URL to the Pull Request or the name of the branch
          to import from.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <label
              htmlFor="branch-input"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Branch
            </label>
            <input
              id="branch-input"
              type="text"
              value={branchInput}
              onChange={(e) => {
                setBranchInput(e.target.value);
                setError(null);
              }}
              placeholder="Branch name or PR URL"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "14px",
                fontFamily: "inherit",
                border: error ? "1px solid #f44336" : "1px solid #e0e0e0",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: "#ffebee",
                  border: "1px solid #f44336",
                  borderRadius: "4px",
                  color: "#c62828",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !branchInput.trim()}
            style={{
              width: "100%",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              backgroundColor:
                isLoading || !branchInput.trim() ? "#ccc" : "#d40d0d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor:
                isLoading || !branchInput.trim() ? "not-allowed" : "pointer",
              opacity: isLoading || !branchInput.trim() ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isLoading && branchInput.trim()) {
                e.currentTarget.style.backgroundColor = "#b30b0b";
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && branchInput.trim()) {
                e.currentTarget.style.backgroundColor = "#d40d0d";
              }
            }}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
