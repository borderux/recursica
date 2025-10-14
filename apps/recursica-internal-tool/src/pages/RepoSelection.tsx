import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import {
  GitHubService,
  type GitHubRepo,
} from "../services/github/githubService";

interface RepoSelectionProps {
  onRepoSelected: (repo: GitHubRepo) => void;
}

export function RepoSelection({ onRepoSelected }: RepoSelectionProps) {
  const { accessToken } = useAuth();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const loadRepos = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const githubService = new GitHubService(accessToken);
      const userRepos = await githubService.getUserRepos();

      // Filter out forks and sort by updated date
      const filteredRepos = userRepos
        .filter((repo) => !repo.private) // Only show public repos for now
        .sort(
          (a, b) =>
            new Date(b.updated_at || 0).getTime() -
            new Date(a.updated_at || 0).getTime(),
        );

      setRepos(filteredRepos);
    } catch (err) {
      console.error("Error loading repos:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load repositories",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      loadRepos();
    }
  }, [accessToken, loadRepos]);

  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
  };

  const handleConfirm = () => {
    if (selectedRepo) {
      onRepoSelected(selectedRepo);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading your repositories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <p>Error: {error}</p>
        </div>
        <button
          onClick={loadRepos}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select a Repository</h2>
      <p>Choose a GitHub repository to push your Figma page exports to:</p>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedRepo?.id || ""}
          onChange={(e) => {
            const repo = repos.find((r) => r.id === parseInt(e.target.value));
            if (repo) handleRepoSelect(repo);
          }}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">Select a repository...</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.id}>
              {repo.full_name} {repo.description && `- ${repo.description}`}
            </option>
          ))}
        </select>
      </div>

      {selectedRepo && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <h4>{selectedRepo.full_name}</h4>
          {selectedRepo.description && <p>{selectedRepo.description}</p>}
          <p style={{ fontSize: "14px", color: "#666" }}>
            Default branch: {selectedRepo.default_branch}
          </p>
          <a
            href={selectedRepo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#007acc" }}
          >
            View on GitHub
          </a>
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedRepo}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: selectedRepo ? "#4caf50" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: selectedRepo ? "pointer" : "not-allowed",
        }}
      >
        {selectedRepo ? "Use This Repository" : "Select a Repository"}
      </button>
    </div>
  );
}
