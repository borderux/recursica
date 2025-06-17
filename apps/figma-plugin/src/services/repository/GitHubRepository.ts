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
    // First, get the SHA of the source branch
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
  }

  async commitFiles(
    project: Project,
    branch: string,
    message: string,
    actions: CommitAction[]
  ): Promise<void> {
    // Get the current commit SHA
    const branchResponse = await this.httpClient.get(
      `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/refs/heads/${branch}`
    );
    const parentSha = branchResponse.data.object.sha;

    // Get the current tree
    const parentCommitResponse = await this.httpClient.get(
      `${this.baseUrl}/repos/${project.owner.name}/${project.name}/git/commits/${parentSha}`
    );
    const baseTreeSha = parentCommitResponse.data.tree.sha;

    // Create blobs for each file
    const tree = [];
    for (const action of actions) {
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
        message: message,
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
  }

  async createPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string,
    title: string
  ): Promise<PullRequest> {
    try {
      const response = await this.httpClient.post(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/pulls`,
        {
          title: title,
          head: sourceBranch,
          base: targetBranch,
        }
      );

      return {
        id: response.data.number,
        title: response.data.title,
        url: response.data.html_url,
        state: response.data.state,
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
            head: sourceBranch,
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

  private async getExistingPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string
  ): Promise<PullRequest | null> {
    try {
      const response = await this.httpClient.get(
        `${this.baseUrl}/repos/${project.owner.name}/${project.name}/pulls`,
        {
          params: {
            head: sourceBranch,
            base: targetBranch,
            state: 'all',
          },
        }
      );

      if (response.data.length > 0) {
        const pr = response.data[0];
        return {
          id: pr.number,
          title: pr.title,
          url: pr.html_url,
          state: pr.state,
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
}
