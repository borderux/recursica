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

interface GitLabProject {
  name: string;
  id: number;
  namespace: {
    path: string;
    kind: string;
  };
  default_branch: string;
}
export class GitLabRepository extends BaseRepository {
  private readonly baseUrl = 'https://gitlab.com/api/v4';

  constructor(accessToken: string) {
    super(accessToken);
    this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
  }

  async getUserInfo(): Promise<UserInfo> {
    const response = await this.httpClient.get(`${this.baseUrl}/user`);
    return response.data;
  }

  async getUserProjects(): Promise<Project[]> {
    const userInfo = await this.getUserInfo();
    const response = await this.httpClient.get<GitLabProject[]>(
      `${this.baseUrl}/users/${userInfo.id}/contributed_projects`
    );

    return response.data.map((project: GitLabProject) => ({
      name: project.name,
      id: project.id.toString(),
      owner: {
        name: project.namespace.path,
        type: project.namespace.kind,
      },
      defaultBranch: project.default_branch,
    }));
  }

  async getProjectBranches(selectedProject: Project): Promise<Branch[]> {
    const response = await this.httpClient.get<{ name: string; id: number }[]>(
      `${this.baseUrl}/projects/${selectedProject.id}/repository/branches`
    );

    return response.data.map((branch: { name: string; id: number }) => ({
      name: branch.name,
      id: branch.id,
    }));
  }

  async getRepositoryFiles(projectId: string, branch: string): Promise<FileInfo[]> {
    const response = await this.httpClient.get<{ name: string; path: string; type: string }[]>(
      `${this.baseUrl}/projects/${projectId}/repository/tree`,
      {
        params: { ref: branch },
      }
    );

    return response.data.map((file: { name: string; path: string; type: string }) => ({
      name: file.name,
      path: file.path,
    }));
  }

  async getSingleFile<T = string>(project: Project, filePath: string, branch: string): Promise<T> {
    const encodedFilePath = encodeURIComponent(filePath);
    const response = await this.httpClient.get(
      `${this.baseUrl}/projects/${project.id}/repository/files/${encodedFilePath}/raw`,
      {
        params: { ref: branch },
      }
    );

    return response.data;
  }

  async createBranch(project: Project, branchName: string, sourceBranch: string): Promise<Branch> {
    const response = await this.httpClient.post(
      `${this.baseUrl}/projects/${project.id}/repository/branches`,
      {
        branch: branchName,
        ref: sourceBranch,
      }
    );

    return {
      name: response.data.name,
      id: response.data.id,
    };
  }

  async fileExists(project: Project, filePath: string, branch: string): Promise<boolean> {
    try {
      const response = await this.httpClient.head(
        `${this.baseUrl}/projects/${project.id}/repository/files/${encodeURIComponent(filePath)}`,
        { params: { ref: branch } }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Error checking if file exists:', error);
      return false;
    }
  }

  async commitFiles(
    project: Project,
    branch: string,
    message: string,
    actions: CommitAction[]
  ): Promise<void> {
    await this.httpClient.post(`${this.baseUrl}/projects/${project.id}/repository/commits`, {
      branch: branch,
      commit_message: message,
      actions: actions,
    });
  }

  async createPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string,
    title: string
  ): Promise<PullRequest> {
    try {
      const response = await this.httpClient.post(
        `${this.baseUrl}/projects/${project.id}/merge_requests`,
        {
          source_branch: sourceBranch,
          target_branch: targetBranch,
          title: title,
        }
      );

      return {
        id: response.data.iid,
        title: response.data.title,
        url: response.data.web_url,
        state: response.data.state,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        // Merge request already exists, fetch it
        const existingMR = await this.getExistingMergeRequest(project, sourceBranch, targetBranch);
        if (existingMR) {
          return existingMR;
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
        `${this.baseUrl}/projects/${project.id}/merge_requests`,
        {
          params: {
            source_branch: sourceBranch,
            target_branch: targetBranch,
            state: 'opened',
          },
        }
      );

      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking for open merge requests:', error);
      return false;
    }
  }

  private async getExistingMergeRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string
  ): Promise<PullRequest | null> {
    try {
      const response = await this.httpClient.get(
        `${this.baseUrl}/projects/${project.id}/merge_requests`,
        {
          params: {
            source_branch: sourceBranch,
            target_branch: targetBranch,
          },
        }
      );

      if (response.data.length > 0) {
        const mr = response.data[0];
        return {
          id: mr.iid,
          title: mr.title,
          url: mr.web_url,
          state: mr.state,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching existing merge request:', error);
      return null;
    }
  }

  // Override calculateMainBranch to set it immediately after getting branches
  protected async calculateMainBranch(project: Project): Promise<string> {
    const mainBranch = await super.calculateMainBranch(project);
    return mainBranch;
  }
}
