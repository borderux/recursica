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

interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

interface GitHubCreateBranchRequest {
  ref: string;
  sha: string;
}

interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
}

interface GitHubCreatePullRequestRequest {
  title: string;
  body: string;
  head: string;
  base: string;
}

import type { ExportPageResponseData } from "../../plugin/services/pageExportNew";

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
    ref?: string,
  ): Promise<GitHubFileContent | GitHubFileContent[]> {
    let url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    if (ref) {
      url += `?ref=${ref}`;
    }
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
      content: this.encodeToBase64(content), // Properly encode Unicode content
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
    const sanitizedPageName = pageName
      .replace(/[^\w\s-]/g, "") // Remove emojis and special characters except word chars, spaces, and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
    const filename = `${sanitizedPageName}_export.json`;
    const filePath = `figma-exports/${filename}`;

    // Create the export data with metadata
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        originalPageName: sanitizedPageName,
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

  async getBranch(
    owner: string,
    repo: string,
    branchName: string,
  ): Promise<GitHubBranch> {
    const url = `https://api.github.com/repos/${owner}/${repo}/branches/${branchName}`;
    return this.makeRequest(url);
  }

  async getAllBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/branches`;
    return this.makeRequest(url);
  }

  /**
   * Sanitizes a page name to be a valid Git branch name
   * @param pageName The original page name
   * @returns Sanitized branch name (lowercase, hyphens instead of spaces/special chars)
   */
  private sanitizeBranchName(pageName: string): string {
    return pageName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }

  /**
   * Sanitizes a page name to be a valid folder name
   * Matches the filename convention: underscores instead of hyphens, preserves case
   * @param pageName The original page name
   * @returns Sanitized folder name (preserves case, underscores instead of spaces)
   */
  private sanitizeFolderName(pageName: string): string {
    // Match the filename convention: clean to alphanumeric, underscore, dash, or space
    // then replace spaces with underscores
    return pageName
      .replace(/[^a-zA-Z0-9_\-\s]/g, "") // Remove special characters except alphanumeric, underscore, dash, or space
      .trim()
      .replace(/\s+/g, "_"); // Replace spaces with underscores
  }

  /**
   * Finds a unique branch name by appending incrementing suffixes if needed
   * @param owner Repository owner
   * @param repo Repository name
   * @param baseName Base branch name (e.g., "publishing/page-name")
   * @returns Unique branch name
   */
  async findUniqueBranchName(
    owner: string,
    repo: string,
    baseName: string,
  ): Promise<string> {
    // Get all existing branches
    const branches = await this.getAllBranches(owner, repo);
    const branchNames = new Set(branches.map((b) => b.name));

    // Check if base name is available
    if (!branchNames.has(baseName)) {
      return baseName;
    }

    // Try incrementing suffixes
    let counter = 1;
    let candidateName = `${baseName}_${counter}`;
    while (branchNames.has(candidateName)) {
      counter++;
      candidateName = `${baseName}_${counter}`;
    }

    return candidateName;
  }

  /**
   * Flattens the recursive ExportPageResponseData structure into a flat array
   * @param pageData The export page response data
   * @returns Array of flattened page data with name, jsonData, and filename
   */
  private flattenPageExports(
    pageData: ExportPageResponseData,
  ): Array<{ name: string; jsonData: string; filename: string }> {
    const files: Array<{ name: string; jsonData: string; filename: string }> = [
      {
        name: pageData.pageName,
        jsonData: pageData.jsonData,
        filename: pageData.filename,
      },
    ];

    // Recursively add additional pages
    for (const additionalPage of pageData.additionalPages) {
      files.push(...this.flattenPageExports(additionalPage));
    }

    return files;
  }

  /**
   * Publishes page exports to GitHub by creating a branch, committing files, and creating a PR
   * @param owner Repository owner
   * @param repo Repository name
   * @param exportData The export page response data from pageExportNew
   * @param baseBranch Base branch to create the new branch from (e.g., "main")
   * @returns Branch name and pull request
   */
  async publishPageExports(
    owner: string,
    repo: string,
    exportData: ExportPageResponseData,
    baseBranch: string = "main",
  ): Promise<{ branch: string; pr: GitHubPullRequest }> {
    // Sanitize page name for branch naming
    const sanitizedPageName = this.sanitizeBranchName(exportData.pageName);
    const baseBranchName = `publishing/${sanitizedPageName}`;

    // Find unique branch name
    const branchName = await this.findUniqueBranchName(
      owner,
      repo,
      baseBranchName,
    );

    // Create the branch
    await this.createBranch(owner, repo, branchName, baseBranch);

    // Flatten all exported pages
    const files = this.flattenPageExports(exportData);

    // Build components mapping for index.json
    const components: Record<string, { name: string; path: string }> = {};

    // Commit each file to the branch
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Sanitize page name for folder name
      const sanitizedPageName = this.sanitizeFolderName(file.name);
      const filePath = `components/${sanitizedPageName}/${file.filename}`;
      const commitMessage =
        i === 0
          ? `Publishing ${exportData.pageName}`
          : `Publishing ${exportData.pageName} (additional: ${file.name})`;

      // Parse jsonData to extract GUID from metadata
      try {
        const parsedData = JSON.parse(file.jsonData);
        const guid = parsedData.metadata?.guid;
        if (guid) {
          components[guid] = {
            name: file.name,
            path: filePath,
          };
        }
      } catch (error) {
        console.warn(
          `Failed to parse jsonData for file ${file.filename}:`,
          error,
        );
      }

      // Check if file already exists in the branch
      let fileSha: string | undefined;
      try {
        const existingFile = await this.getRepoContents(
          owner,
          repo,
          filePath,
          branchName,
        );
        if (!Array.isArray(existingFile)) {
          fileSha = existingFile.sha;
        }
      } catch {
        // File doesn't exist, that's fine
      }

      // Create or update the file in the branch
      await this.createOrUpdateFileInBranch(
        owner,
        repo,
        filePath,
        file.jsonData,
        commitMessage,
        branchName,
        fileSha,
      );
    }

    // Read existing index.json if it exists, merge with new components, and write it back
    let indexJson: {
      components?: Record<string, { name: string; path: string }>;
    } = {};
    let indexSha: string | undefined;
    try {
      const existingIndex = await this.getRepoContents(
        owner,
        repo,
        "index.json",
        branchName,
      );
      if (!Array.isArray(existingIndex)) {
        const indexContent = await fetch(existingIndex.download_url).then(
          (res) => res.text(),
        );
        indexJson = JSON.parse(indexContent);
        indexSha = existingIndex.sha;
      }
    } catch {
      // index.json doesn't exist, that's fine - we'll create it
    }

    // Merge new components into existing index.json
    if (!indexJson.components) {
      indexJson.components = {};
    }
    Object.assign(indexJson.components, components);

    // Write index.json to root of repo
    const indexContent = JSON.stringify(indexJson, null, 2);
    await this.createOrUpdateFileInBranch(
      owner,
      repo,
      "index.json",
      indexContent,
      `Update index.json with ${exportData.pageName} and related components`,
      branchName,
      indexSha,
    );

    // Create PR body with list of exported files
    const fileList = files
      .map((file) => `- \`${file.filename}\` (${file.name})`)
      .join("\n");
    const prBody = `This PR publishes the Figma page "${exportData.pageName}" and related pages to the repository.

**Exported files:**
${fileList}

**Export date:** ${new Date().toLocaleString()}`;

    // Create pull request
    const pr = await this.createPullRequest(
      owner,
      repo,
      `Publishing ${exportData.pageName}`,
      prBody,
      branchName,
      baseBranch,
    );

    return { branch: branchName, pr };
  }

  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    baseBranch: string,
  ): Promise<GitHubBranch> {
    // First get the base branch SHA
    const baseBranchData = await this.getBranch(owner, repo, baseBranch);

    const url = `https://api.github.com/repos/${owner}/${repo}/git/refs`;
    const body: GitHubCreateBranchRequest = {
      ref: `refs/heads/${branchName}`,
      sha: baseBranchData.commit.sha,
    };

    return this.makeRequest(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async createOrUpdateFileInBranch(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string,
    sha?: string,
  ): Promise<GitHubFileContent> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const body: GitHubCreateFileRequest & { branch: string } = {
      message,
      content: this.encodeToBase64(content), // Properly encode Unicode content
      branch,
    };

    if (sha) {
      body.sha = sha;
    }

    return this.makeRequest(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async getPullRequests(
    owner: string,
    repo: string,
    head?: string,
    base?: string,
    state: "open" | "closed" | "all" = "open",
  ): Promise<GitHubPullRequest[]> {
    let url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}`;

    if (head) {
      url += `&head=${owner}:${head}`;
    }
    if (base) {
      url += `&base=${base}`;
    }

    return this.makeRequest(url);
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string,
  ): Promise<GitHubPullRequest> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;
    const requestBody: GitHubCreatePullRequestRequest = {
      title,
      body,
      head,
      base,
    };

    return this.makeRequest(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  }

  async createOrGetPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string,
  ): Promise<GitHubPullRequest> {
    try {
      // First, check if a PR already exists for this branch
      const existingPRs = await this.getPullRequests(
        owner,
        repo,
        head,
        base,
        "open",
      );

      if (existingPRs.length > 0) {
        console.log(
          `Found existing PR #${existingPRs[0].number} for branch ${head}`,
        );
        return existingPRs[0];
      }
    } catch (error) {
      console.log(
        "Error checking for existing PRs, will create new one:",
        error,
      );
    }

    // No existing PR found, create a new one
    console.log(`Creating new PR for branch ${head}`);
    return this.createPullRequest(owner, repo, title, body, head, base);
  }

  async pushPageToRepoWithBranch(
    owner: string,
    repo: string,
    pageData: {
      metadata: {
        exportedAt: string;
        originalPageName: string;
        totalNodes: number;
        pluginVersion: string;
        exportedBy: string;
      };
      pageData: FigmaNode;
    },
    pageName: string,
    username: string,
    baseBranch: string,
  ): Promise<{ file: GitHubFileContent; pr: GitHubPullRequest }> {
    // Sanitize username: replace spaces with hyphens and remove special characters
    const sanitizedUsername = username
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
    const branchName = `${sanitizedUsername}-page-export`;

    // Sanitize page name for filename: remove emojis and special characters
    const sanitizedPageName = pageName
      .replace(/[^\w\s-]/g, "") // Remove emojis and special characters except word chars, spaces, and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
    const filename = `${sanitizedPageName}.figma.json`;
    const filePath = `components/${filename}`;

    const content = JSON.stringify(pageData, null, 2);
    const message = `Export Figma page: ${pageName}`;

    // Ensure the branch exists
    let branchExists = false;
    try {
      await this.getBranch(owner, repo, branchName);
      branchExists = true;
      console.log(`Branch ${branchName} already exists`);
    } catch {
      console.log(`Branch ${branchName} does not exist, creating it...`);
      try {
        await this.createBranch(owner, repo, branchName, baseBranch);
        branchExists = true;
        console.log(`Successfully created branch ${branchName}`);
      } catch (createError) {
        console.error(`Failed to create branch ${branchName}:`, createError);
        throw new Error(
          `Failed to create branch ${branchName}: ${createError instanceof Error ? createError.message : "Unknown error"}`,
        );
      }
    }

    if (!branchExists) {
      throw new Error(`Branch ${branchName} could not be created or accessed`);
    }

    // Check if file already exists in the branch
    let fileSha: string | undefined;
    try {
      const existingFile = await this.getRepoContents(owner, repo, filePath);
      if (!Array.isArray(existingFile)) {
        fileSha = existingFile.sha;
      }
    } catch {
      // File doesn't exist, that's fine
    }

    // Create or update the file in the branch
    const file = await this.createOrUpdateFileInBranch(
      owner,
      repo,
      filePath,
      content,
      message,
      branchName,
      fileSha,
    );

    // Create or get existing pull request
    const pr = await this.createOrGetPullRequest(
      owner,
      repo,
      `Export Figma page: ${sanitizedPageName}`,
      `This PR exports the Figma page "${sanitizedPageName}" as JSON.\n\n**Exported by:** ${username}\n**Export date:** ${new Date().toLocaleString()}\n**File:** \`${filename}\``,
      branchName,
      baseBranch,
    );

    return { file, pr };
  }

  private encodeToBase64(str: string): string {
    // First encode the string to UTF-8 bytes, then encode to base64
    // This handles Unicode characters properly
    try {
      // Use TextEncoder to convert string to UTF-8 bytes
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(str);

      // Convert bytes to base64
      let binary = "";
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      return btoa(binary);
    } catch (error) {
      // Fallback: clean the string and use regular btoa
      console.warn("Failed to encode with TextEncoder, using fallback:", error);
      const cleanedStr = str.replace(/[^\x20-\x7E]/g, ""); // Remove non-printable ASCII characters
      return btoa(cleanedStr);
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

  /**
   * Check if the user has write access to a repository
   * @param owner Repository owner (username or organization)
   * @param repo Repository name
   * @returns true if user has write/push permissions, false otherwise
   */
  async checkRepositoryAccess(owner: string, repo: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(
        `https://api.github.com/repos/${owner}/${repo}`,
      );

      // Check if user has push permissions
      const permissions = (response as { permissions?: { push?: boolean } })
        .permissions;
      return permissions?.push === true;
    } catch (error) {
      // 404 means repository doesn't exist or user doesn't have access
      // 403 means forbidden (no access)
      if (error instanceof Error) {
        if (error.message.includes("404") || error.message.includes("403")) {
          return false;
        }
      }
      console.error("Error checking repository access:", error);
      return false;
    }
  }
}

export type {
  GitHubRepo,
  GitHubUser,
  GitHubFileContent,
  GitHubCreateFileRequest,
  GitHubBranch,
  GitHubCreateBranchRequest,
  GitHubPullRequest,
  GitHubCreatePullRequestRequest,
  FigmaNode,
};
