import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import {
  GitHubService,
  type GitHubRepo,
} from "../../services/github/githubService";
import { Card } from "../Card";
import { Stack } from "../Stack";
import { Group } from "../Group";
import { Button } from "../Button";
import { Select } from "../Select";
import { Text } from "../Text";
import { Avatar } from "@mantine/core";
import classes from "./Profile.module.css";

export function Profile() {
  const { user, logout, accessToken, selectedRepo, saveSelectedRepo } =
    useAuth();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRepos = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const githubService = new GitHubService(accessToken);
      const userRepos = await githubService.getUserRepos();

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

  const handleRepoSelect = (value: string | null) => {
    if (!value) return;
    const repo = repos.find((r) => r.id.toString() === value);
    if (repo) {
      saveSelectedRepo(repo);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const selectData = repos.map((repo) => ({
    value: repo.id.toString(),
    label: repo.name,
  }));

  return (
    <Card
      variant="default"
      paddingLarge
      borderRadiusLarge
      className={classes.root}
    >
      <Stack gap={20}>
        {/* User Profile Section */}
        <Group gap={16} className={classes.userSection}>
          <Avatar src={user?.avatar_url} size={60} className={classes.avatar}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <div className={classes.userInfo}>
            <div className={classes.userName}>{user?.name || "User"}</div>
            {user?.email && (
              <Text
                variant="body"
                color="secondary"
                className={classes.userEmail}
              >
                {user.email}
              </Text>
            )}
          </div>
        </Group>

        {/* Repository Selection Section */}
        <div className={classes.repoSection}>
          <label className={classes.repoLabel}>Select Repository</label>
          <Select
            placeholder="Choose a repository..."
            data={selectData}
            value={selectedRepo?.id.toString() || null}
            onChange={handleRepoSelect}
            searchable
            disabled={loading}
          />
          {loading && (
            <Text
              variant="small"
              color="secondary"
              className={classes.repoDropdownEmpty}
            >
              Loading repositories...
            </Text>
          )}
        </div>

        {/* Logout Button Section */}
        <Button
          variant="filled"
          color="danger"
          onClick={handleLogout}
          className={classes.logoutButton}
        >
          Disconnect from GitHub
        </Button>
      </Stack>
    </Card>
  );
}
