import axios, { AxiosInstance } from 'axios';

/**
 * Represents user information from Git platforms (GitHub/GitLab)
 */
export interface UserInfo {
  /** Unique identifier for the user */
  id: number;
  /** Username/login handle (optional) */
  username?: string;
  /** Full display name (optional) */
  name?: string;
  /** Email address (optional) */
  email?: string;
}

export interface ProjectOwner {
  /** Owner name (e.g., 'recursica') */
  name: string;
  /** Owner type (e.g., 'user', 'organization') */
  type: string;
}

/**
 * Represents a project/repository for selection in UI components
 */
export interface Project {
  /** Human-readable project name for display */
  name: string;
  /** Unique identifier used for API calls (project ID for GitLab, owner/repo for GitHub) */
  id: string;
  /** Owner of the project */
  owner: ProjectOwner;
  /** Default branch name (e.g., 'main', 'master') */
  defaultBranch: string;
}

/**
 * Represents a Git branch with platform-specific metadata
 */
export interface Branch {
  /** Branch name (e.g., 'main', 'develop', 'feature/xyz') */
  name: string;
  /** Optional numeric identifier (used by GitLab, undefined for GitHub) */
  id?: number;
}

/**
 * Represents basic file information from repository listings
 */
export interface FileInfo {
  /** File name without path (e.g., 'package.json') */
  name: string;
  /** Full path relative to repository root (e.g., 'src/components/Button.tsx') */
  path: string;
}

export interface FileToCreateOrUpdate {
  /** The type of action to perform on the file */
  action: 'create' | 'update';
  /** Path of the file to create or update */
  file_path: string;
  /** Content of the file to create or update */
  content: string;
}

export interface FileToDelete {
  /** The type of action to perform on the file */
  action: 'delete';
  /** Path of the file to delete */
  file_path: string;
}

/**
 * Represents an action to be performed during a commit operation
 */
export type CommitAction = FileToCreateOrUpdate | FileToDelete;

/**
 * Represents a Pull Request (GitHub) or Merge Request (GitLab)
 */
export interface PullRequest {
  /** Unique identifier (PR number for GitHub, MR IID for GitLab) */
  id: number;
  /** Title of the pull/merge request */
  title: string;
  /** Web URL to view the pull/merge request */
  url: string;
  /** Current state (e.g., 'open', 'merged', 'closed') */
  state: string;
  /** Last updated date of the pull/merge request */
  updatedAt: string;
}

export abstract class BaseRepository {
  protected accessToken: string;
  protected httpClient: AxiosInstance;
  protected mainBranch: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.httpClient = axios.create();
    this.mainBranch = 'main'; // Default, will be calculated
  }

  // Abstract methods that must be implemented by concrete classes
  abstract getUserInfo(): Promise<UserInfo>;
  abstract getUserProjects(): Promise<Project[]>;
  abstract getProjectBranches(selectedProject: Project): Promise<Branch[]>;
  abstract getRepositoryFiles(projectId: string, branch: string): Promise<FileInfo[]>;
  abstract getRepositoryFilesByPath(
    project: Project,
    branch: string,
    path: string
  ): Promise<FileInfo[]>;
  abstract getSingleFile<T = string>(
    project: Project,
    filePath: string,
    branch: string
  ): Promise<T>;
  abstract createBranch(
    project: Project,
    branchName: string,
    sourceBranch: string
  ): Promise<Branch>;
  abstract commitFiles(
    project: Project,
    branch: string,
    message: string,
    actions: CommitAction[]
  ): Promise<void>;
  abstract createPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    assignee?: string
  ): Promise<PullRequest>;
  abstract hasOpenPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string
  ): Promise<boolean>;
  abstract getExistingPullRequest(
    project: Project,
    sourceBranch: string,
    targetBranch: string
  ): Promise<PullRequest | null>;
  abstract fileExists(project: Project, filePath: string, branch: string): Promise<boolean>;

  // Common method to calculate main branch
  protected async calculateMainBranch(project: Project): Promise<string> {
    const branches = await this.getProjectBranches(project);
    const mainBranch = branches.find(
      (branch) => branch.name === 'main' || branch.name === 'master'
    );

    if (mainBranch) {
      this.mainBranch = mainBranch.name;
      return this.mainBranch;
    }

    // If no main/master branch found, return the first branch or default to 'main'
    this.mainBranch = branches.length > 0 ? branches[0].name : 'main';
    return this.mainBranch;
  }

  // Getter for main branch
  public getMainBranch(): string {
    return this.mainBranch;
  }

  // Common utility method to generate branch name
  protected generateBranchName(username: string, prefix: string = 'recursica'): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    return `${prefix}-${username}-${timestamp}`;
  }
}
