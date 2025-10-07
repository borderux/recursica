import { AxiosError } from 'axios';
import {
  BaseRepository,
  UserInfo,
  Project,
  Branch,
  FileInfo,
  CommitAction,
  PullRequest,
} from './BaseRepository';
import { RateLimiter } from './rateLimiter';

interface GitHubProject {
  name: string;
  id: number;
  full_name: string;
  owner: {
    login: string;
    type: string;
  };
  default_branch: string;
}

export class GitHubRepository extends BaseRepository {
  private readonly baseUrl = 'https://api.github.com';
  private readonly rateLimiter = new RateLimiter();

  constructor(accessToken: string) {
    super(accessToken);
    this.httpClient.defaults.headers.common['Authorization'] = `token ${this.accessToken}`;
    this.httpClient.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json';
  }

  async getUserInfo(): Promise<UserInfo> {
    const response = await this.httpClient.get(`${this.baseUrl}/user`);
    return {
      id: response.data.id,
      username: response.data.login,
      name: response.data.name,
      email: response.data.email,
    };
  }

  async getUserProjects(): Promise<Project[]> {
    const response = await this.httpClient.get<GitHubProject[]>(`${this.baseUrl}/user/repos`, {
      params: {
        type: 'all',
        sort: 'updated',
        per_page: 100,
      },
    });

    return response.data.map((repo: GitHubProject) => ({
      name: repo.name,
      id: repo.id.toString(),
      defaultBranch: repo.default_branch,
      owner: {
        name: repo.owner.login,
        type: repo.owner.type,
      },
    }));
  }

  async getProjectBranches(selectedProject: Project): Promise<Branch[]> {
    const response = await this.httpClient.get<{ name: string; commit: { sha: string } }[]>(
      `${this.baseUrl}/repos/${selectedProject.owner.name}/${selectedProject.name}/branches`
    );

    return response.data.map((branch: { name: string; commit: { sha: string } }) => ({
      name: branch.name,
      id: undefined, // GitHub doesn't use numeric IDs for branches
    }));
  }

  async getRepositoryFiles(projectId: string, branch: string): Promise<FileInfo[]> {
    const response = await this.httpClient.get<{ tree: { path: string; type: string }[] }>(
      `${this.baseUrl}/repos/${projectId}/git/trees/${branch}`,
      {
        params: { recursive: 1 },
      }
    );

    return response.data.tree
      .filter((item: { path: string; type: string }) => item.type === 'blob')
      .map((file: { path: string; type: string }) => ({
        name: file.path.split('/').pop() || file.path,
        path: file.path,
      }));
  }

  async getRepositoryFilesByPath(
    project: Project,
    branch: string,
    path: string
  ): Promise<FileInfo[]> {
    // Clean the path - remove leading/trailing slashes
    const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');

    try {
      // First, get the tree for the specific path
      const response = await this.httpClient.get<FileInfo[]>(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/contents/${path}`,
        {
          params: { ref: branch },
          headers: {
            Accept: 'application/vnd.github.raw+json',
          },
        }
      );

      return response.data;
    } catch (error) {
      // If the path doesn't exist or there's an error, return empty array
      console.warn(`Path ${cleanPath} not found or error occurred:`, error);
      return [];
    }
  }

  async getSingleFile<T = string>(project: Project, filePath: string, branch: string): Promise<T> {
    const response = await this.httpClient.get(
      `${this.baseUrl}/repos/${project.owner.name}/${project.name}/contents/${filePath}`,
      {
        params: { ref: branch },
        headers: {
          Accept: 'application/vnd.github.raw+json',
        },
      }
    );

    return response.data;
  }

  async fileExists(project: Project, filePath: string, branch: string): Promise<boolean> {
    try {
      const response = await this.httpClient.head(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/contents/${filePath}`,
        { params: { ref: branch } }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Error checking if file exists:', error);
      return false;
    }
  }

  async createBranch(project: Project, branchName: string, sourceBranch: string): Promise<Branch> {
    try {
      // Check if repository is empty first (before checking for existing branches)
      const isEmpty = await this.isRepositoryEmpty(project);

      if (isEmpty) {
        // For empty repositories, we need to create an initial commit first
        await this.createInitialCommit(project, sourceBranch);
      } else {
        // Only check if branch exists if repository is not empty
        try {
          await this.httpClient.get(
            `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/refs/heads/${branchName}`
          );
          // Branch exists, return it
          return {
            name: branchName,
            id: undefined,
          };
        } catch (error) {
          // Branch doesn't exist, continue with creation
          if (error instanceof AxiosError && error.response?.status !== 404) {
            throw error; // Re-throw if it's not a 404 (branch not found)
          }
        }
      }

      // Get the SHA of the source branch
      const sourceBranchResponse = await this.httpClient.get(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/refs/heads/${sourceBranch}`
      );

      const sourceSha = sourceBranchResponse.data.object.sha;

      // Create the new branch
      await this.httpClient.post(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/refs`,
        {
          ref: `refs/heads/${branchName}`,
          sha: sourceSha,
        }
      );

      return {
        name: branchName,
        id: undefined,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          const errorMessage = error.response.data?.message || 'Branch creation failed';
          if (errorMessage.includes('already exists')) {
            // Branch already exists, return it
            return {
              name: branchName,
              id: undefined,
            };
          }
          throw new Error(`Branch creation failed: ${errorMessage}`);
        }
        throw new Error(`GitHub API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async commitFiles(
    project: Project,
    branch: string,
    message: string,
    actions: CommitAction[]
  ): Promise<void> {
    console.log('committing files', actions);
    // Get the initial commit SHA and tree SHA
    const branchResponse = await this.httpClient.get(
      `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/refs/heads/${branch}`
    );
    let parentSha = branchResponse.data.object.sha;

    // Get the current tree
    const parentCommitResponse = await this.httpClient.get(
      `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/commits/${parentSha}`
    );
    let baseTreeSha = parentCommitResponse.data.tree.sha;

    // Use the rate limiter to process batches automatically
    await this.rateLimiter.processBatched({
      items: actions,
      processor: async (batch) => {
        // Create blobs for each file in the batch
        const tree = [];
        for (const action of batch) {
          if (action.action !== 'delete') {
            const blobResponse = await this.httpClient.post(
              `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/blobs`,
              {
                content: action.content,
                encoding: 'utf-8',
              }
            );

            tree.push({
              path: action.file_path,
              mode: '100644',
              type: 'blob',
              sha: blobResponse.data.sha,
            });
          } else {
            tree.push({
              path: action.file_path,
              mode: '100644',
              type: 'blob',
              sha: null, // This deletes the file
            });
          }
        }

        // Create a new tree
        const treeResponse = await this.httpClient.post(
          `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/trees`,
          {
            base_tree: baseTreeSha,
            tree: tree,
          }
        );

        // Create a new commit
        const commitResponse = await this.httpClient.post(
          `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/commits`,
          {
            message: `${message} (batch ${actions.indexOf(batch[0]) / this.rateLimiter.getConfig().batchSize + 1}/${Math.ceil(actions.length / this.rateLimiter.getConfig().batchSize)})`,
            tree: treeResponse.data.sha,
            parents: [parentSha],
          }
        );

        // Update the branch reference
        await this.httpClient.patch(
          `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/refs/heads/${branch}`,
          {
            sha: commitResponse.data.sha,
          }
        );

        // Update parent SHA and tree SHA for next batch
        parentSha = commitResponse.data.sha;
        baseTreeSha = treeResponse.data.sha;

        return commitResponse.data;
      },
    });
  }

  async createPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    assignee?: string
  ): Promise<PullRequest> {
    try {
      const requestBody: {
        title: string;
        head: string;
        base: string;
        assignees?: string[];
      } = {
        title: title,
        head: sourceBranch,
        base: targetBranch,
      };

      // Add assignee if provided
      if (assignee) {
        requestBody.assignees = [assignee];
      }

      const response = await this.httpClient.post(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/pulls`,
        requestBody
      );

      return {
        id: response.data.number,
        title: response.data.title,
        url: response.data.html_url,
        state: response.data.state,
        updatedAt: response.data.updated_at,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        // Pull request already exists, fetch it
        const existingPR = await this.getExistingPullRequest(project, sourceBranch, targetBranch);
        if (existingPR) {
          return existingPR;
        }
      }
      throw error;
    }
  }

  async hasOpenPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string
  ): Promise<boolean> {
    try {
      const response = await this.httpClient.get(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/pulls`,
        {
          params: {
            head: `${project.owner.name}:${sourceBranch}`,
            base: targetBranch,
            state: 'open',
          },
        }
      );

      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking for open pull requests:', error);
      return false;
    }
  }

  async getExistingPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string
  ): Promise<PullRequest | null> {
    try {
      const response = await this.httpClient.get(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/pulls`,
        {
          params: {
            head: `${project.owner.name}:${sourceBranch}`,
            base: targetBranch,
            state: 'all',
          },
        }
      );

      // Filter to only include open or merged PRs
      const openOrMergedPRs = response.data.filter(
        (pr: { state: string; merged_at: string | null }) =>
          pr.state === 'open' || pr.merged_at !== null
      );

      if (openOrMergedPRs.length > 0) {
        const pr = openOrMergedPRs[0];
        return {
          id: pr.number,
          title: pr.title,
          url: pr.html_url,
          state: pr.state,
          updatedAt: pr.updated_at,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching existing pull request:', error);
      return null;
    }
  }

  // Override calculateMainBranch to set it immediately after getting branches
  protected async calculateMainBranch(project: Project): Promise<string> {
    const mainBranch = await super.calculateMainBranch(project);
    return mainBranch;
  }

  /**
   * Check if the repository is empty (has no commits)
   */
  private async isRepositoryEmpty(project: Project): Promise<boolean> {
    try {
      // Try to get commits first
      const response = await this.httpClient.get(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/commits`,
        {
          params: { per_page: 1 },
        }
      );
      return response.data.length === 0;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          // 409 Conflict means the repository is empty
          return true;
        }
        if (error.response?.status === 404) {
          // 404 might also mean empty repository
          return true;
        }
      }
      throw error;
    }
  }

  /**
   * Create an initial commit for an empty repository
   */
  private async createInitialCommit(project: Project, branchName: string): Promise<void> {
    try {
      // Create a simple README.md file as the initial commit
      const readmeContent = `# ${project.name}

This repository was initialized by Recursica.`;

      // Use the contents API to create the initial commit and branch in one step
      await this.httpClient.put(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/contents/README.md`,
        {
          message: 'Initial commit',
          content: btoa(readmeContent),
          branch: branchName,
        }
      );
    } catch (error) {
      throw new Error(
        `Failed to create initial commit: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
