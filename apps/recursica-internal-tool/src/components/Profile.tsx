import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { usePlugin } from "../context/usePlugin";
import {
  GitHubService,
  type GitHubRepo,
} from "../services/github/githubService";

export function Profile() {
  const { user, logout, accessToken } = useAuth();
  const { selectedRepo, saveSelectedRepo } = usePlugin();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const loadRepos = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const githubService = new GitHubService(accessToken);
      const userRepos = await githubService.getUserRepos();

      // Filter out private repos and sort by updated date
      const filteredRepos = userRepos
        .filter((repo) => !repo.private)
        .sort(
          (a, b) =>
            new Date(b.updated_at || 0).getTime() -
            new Date(a.updated_at || 0).getTime(),
        );

      setRepos(filteredRepos);
    } catch (err) {
      console.error("Error loading repos:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken && repos.length === 0) {
      loadRepos();
    }
  }, [accessToken, loadRepos, repos.length]);

  const handleRepoSelect = (repo: GitHubRepo) => {
    saveSelectedRepo(repo);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "24px",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        border: "1px solid #e1e5e9",
        marginBottom: "24px",
      }}
    >
      {/* User Profile Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "#e1e5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: "24px",
                color: "#6c757d",
                fontWeight: "bold",
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* User Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: "600",
              fontSize: "18px",
              color: "#24292f",
              marginBottom: "4px",
            }}
          >
            {user?.name || "User"}
          </div>
          {user?.email && (
            <div
              style={{
                fontSize: "14px",
                color: "#6c757d",
              }}
            >
              {user.email}
            </div>
          )}
        </div>
      </div>

      {/* Repository Selection Section */}
      <div style={{ position: "relative" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: "#24292f",
            marginBottom: "8px",
          }}
        >
          Select Repository
        </label>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "white",
            border: "1px solid #d1d9e0",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedRepo ? selectedRepo.name : "Choose a repository..."}
          </span>
          <span style={{ fontSize: "12px", color: "#6c757d" }}>▼</span>
        </button>

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "1px solid #d1d9e0",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1000,
              maxHeight: "250px",
              overflowY: "auto",
              marginTop: "8px",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#6c757d",
                }}
              >
                Loading repositories...
              </div>
            ) : repos.length === 0 ? (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#6c757d",
                }}
              >
                No repositories found
              </div>
            ) : (
              repos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => handleRepoSelect(repo)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    textAlign: "left",
                    borderBottom: "1px solid #f1f3f4",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f6f8fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#24292f",
                    }}
                  >
                    {repo.name}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6c757d",
                    }}
                  >
                    {repo.full_name}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Logout Button Section */}
      <div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Disconnect from GitHub
        </button>
      </div>
    </div>
  );
}
