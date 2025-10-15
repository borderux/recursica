interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  updated_at?: string;
}

interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

interface GitHubFileContent {
  sha: string;
  content: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  name: string;
  path: string;
}

interface GitHubCreateFileRequest {
  message: string;
  content: string;
  sha?: string;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  [key: string]: unknown;
}

export class GitHubService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  async getUser(): Promise<GitHubUser> {
    return this.makeRequest("https://api.github.com/user");
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    return this.makeRequest(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
    );
  }

  async getRepoContents(
    owner: string,
    repo: string,
    path: string = "",
  ): Promise<GitHubFileContent | GitHubFileContent[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    return this.makeRequest(url);
  }

  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string,
  ): Promise<GitHubFileContent> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const body: GitHubCreateFileRequest = {
      message,
      content: btoa(content), // Base64 encode
    };

    if (sha) {
      body.sha = sha;
    }

    return this.makeRequest(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async pushPageToRepo(
    owner: string,
    repo: string,
    pageData: FigmaNode,
    pageName: string,
  ): Promise<GitHubFileContent> {
    const filename = `${pageName.replace(/[^a-z0-9]/gi, "_")}_export.json`;
    const filePath = `figma-exports/${filename}`;

    // Create the export data with metadata
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        originalPageName: pageName,
        totalNodes: this.countTotalNodes(pageData),
        pluginVersion: "1.0.0",
      },
      pageData: pageData,
    };

    const content = JSON.stringify(exportData, null, 2);
    const message = `Export Figma page: ${pageName}`;

    try {
      // Check if file already exists
      const existingFile = await this.getRepoContents(owner, repo, filePath);
      if (Array.isArray(existingFile)) {
        throw new Error("Expected single file, got directory");
      }
      const sha = existingFile.sha;

      return await this.createOrUpdateFile(
        owner,
        repo,
        filePath,
        content,
        message,
        sha,
      );
    } catch {
      // File doesn't exist, create new one
      return await this.createOrUpdateFile(
        owner,
        repo,
        filePath,
        content,
        message,
      );
    }
  }

  private countTotalNodes(node: FigmaNode): number {
    let count = 1;
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: FigmaNode) => {
        count += this.countTotalNodes(child);
      });
    }
    return count;
  }
}

export type {
  GitHubRepo,
  GitHubUser,
  GitHubFileContent,
  GitHubCreateFileRequest,
  FigmaNode,
};
