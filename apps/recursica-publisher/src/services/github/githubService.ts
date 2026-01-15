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
  content?: string;
  encoding?: string;
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

interface ComponentInfo {
  guid: string;
  name: string;
  path: string;
  version: number;
  publishDate?: string;
}

interface IndexJsonComponent {
  name: string;
  path: string;
  version: number;
  publishDate?: string;
}

interface IndexJson {
  components?: Record<string, IndexJsonComponent>;
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

  private async makeRequest<T = unknown>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
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
      const errorMessage =
        error.message || `GitHub API error: ${response.status}`;
      const errorWithStatus = new Error(errorMessage) as Error & {
        status?: number;
        response?: Response;
      };
      errorWithStatus.status = response.status;
      errorWithStatus.response = response;
      throw errorWithStatus;
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
    // Stringify the pageData object at the last moment before publishing
    const pageDataObj = pageData.pageData;
    if (!pageDataObj) {
      console.error(
        `[flattenPageExports] ERROR: pageData.pageData is undefined for ${pageData.pageName}`,
      );
      throw new Error(
        `pageData.pageData is undefined for ${pageData.pageName}. Cannot flatten exports.`,
      );
    }

    console.log(
      `[flattenPageExports] Stringifying pageData for ${pageData.pageName}...`,
    );
    const jsonData = JSON.stringify(pageDataObj, null, 2);

    if (!jsonData || jsonData.trim().length === 0) {
      console.error(
        `[flattenPageExports] ERROR: jsonData is empty for ${pageData.pageName}`,
      );
      throw new Error(
        `jsonData is empty for ${pageData.pageName}. Cannot publish empty file.`,
      );
    }

    console.log(
      `[flattenPageExports] Successfully stringified ${pageData.pageName} (${(jsonData.length / 1024).toFixed(2)} KB)`,
    );

    // Validate that filename exists
    if (!pageData.filename || pageData.filename.trim().length === 0) {
      console.error(
        `[flattenPageExports] ERROR: filename is missing or empty for page "${pageData.pageName}"`,
      );
      throw new Error(
        `filename is missing or empty for page "${pageData.pageName}". Cannot publish without filename.`,
      );
    }

    const files: Array<{ name: string; jsonData: string; filename: string }> = [
      {
        name: pageData.pageName,
        jsonData,
        filename: pageData.filename,
      },
    ];

    // Recursively add additional pages
    for (const additionalPage of pageData.additionalPages) {
      console.log(
        `[flattenPageExports] Processing additional page: "${additionalPage.pageName}", filename: "${additionalPage.filename || "(missing)"}", hasPageData: ${!!additionalPage.pageData}`,
      );
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
   * @param changeMessage Optional change message to use in commit messages and PR body
   * @param pageDecisions Optional map of page decisions to determine which components to include in index.json
   * @returns Branch name and pull request
   */
  async publishPageExports(
    owner: string,
    repo: string,
    exportData: ExportPageResponseData,
    baseBranch: string = "main",
    changeMessage?: string,
    pageDecisions?: Map<
      string,
      { pageName: string; publishNewVersion: boolean; newVersion: number }
    >,
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

    // Ensure the branch exists (check first to avoid "reference already exists" error)
    let branchExists = false;
    try {
      await this.getBranch(owner, repo, branchName);
      branchExists = true;
      console.log(`[publishPageExports] Branch ${branchName} already exists`);
    } catch {
      console.log(
        `[publishPageExports] Branch ${branchName} does not exist, creating it...`,
      );
      try {
        await this.createBranch(owner, repo, branchName, baseBranch);
        branchExists = true;
        console.log(
          `[publishPageExports] Successfully created branch ${branchName}`,
        );
      } catch (createError) {
        console.error(
          `[publishPageExports] Failed to create branch ${branchName}:`,
          createError,
        );
        // If branch creation fails with "reference already exists", try to get it
        if (
          createError instanceof Error &&
          (createError.message.includes("reference already exists") ||
            createError.message.includes("422"))
        ) {
          console.log(
            `[publishPageExports] Branch exists but wasn't found initially, trying to get it...`,
          );
          try {
            await this.getBranch(owner, repo, branchName);
            branchExists = true;
            console.log(
              `[publishPageExports] Successfully accessed existing branch ${branchName}`,
            );
          } catch {
            throw new Error(
              `Failed to create or access branch ${branchName}: ${createError instanceof Error ? createError.message : "Unknown error"}`,
            );
          }
        } else {
          throw new Error(
            `Failed to create branch ${branchName}: ${createError instanceof Error ? createError.message : "Unknown error"}`,
          );
        }
      }
    }

    if (!branchExists) {
      throw new Error(`Branch ${branchName} could not be created or accessed`);
    }

    // Flatten all exported pages
    console.log("[publishPageExports] Flattening exported pages...");
    const allFiles = this.flattenPageExports(exportData);
    console.log(`[publishPageExports] Flattened ${allFiles.length} files`);

    // Filter files to only include pages that should be published
    // Only include files where the page has a decision with publishNewVersion: true
    // The main page is always included (it's the one being published)
    const mainPageName = exportData.pageName;
    const files = allFiles.filter((file) => {
      // Parse the file to get the page name
      try {
        const parsedData = JSON.parse(file.jsonData);
        const pageName = parsedData.metadata?.name || file.name;

        // Always include the main page (the one being published)
        if (pageName === mainPageName) {
          return true;
        }

        // If no pageDecisions provided, include all files (backwards compatibility)
        if (!pageDecisions) {
          return true;
        }

        // Check if this page should be published
        const decision = pageDecisions.get(pageName);
        const shouldPublish = decision?.publishNewVersion === true;

        if (!shouldPublish) {
          console.log(
            `[publishPageExports] Skipping file ${file.filename} (${pageName}) - not selected for publishing`,
          );
        }

        return shouldPublish;
      } catch (error) {
        console.error(
          `[publishPageExports] Failed to parse file ${file.filename} for filtering:`,
          error,
        );
        // If we can't parse it, include it to be safe (but this shouldn't happen)
        return true;
      }
    });

    console.log(
      `[publishPageExports] Filtered to ${files.length} files to publish (from ${allFiles.length} total)`,
    );

    // Build components mapping for index.json (only include components that were published)
    const components: Record<
      string,
      { name: string; path: string; version: number }
    > = {};

    // Commit each file to the branch
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(
        `[publishPageExports] Processing file ${i + 1}/${files.length}: ${file.filename} (${file.name})`,
      );

      // Sanitize page name for folder name
      const sanitizedPageName = this.sanitizeFolderName(file.name);
      const filePath = `components/${sanitizedPageName}/${file.filename}`;
      const baseCommitMessage =
        i === 0
          ? `Publishing ${exportData.pageName}`
          : `Publishing ${exportData.pageName} (additional: ${file.name})`;
      const commitMessage = changeMessage
        ? `${baseCommitMessage}\n\n${changeMessage}`
        : baseCommitMessage;

      // Parse jsonData to extract GUID and version from metadata
      try {
        console.log(
          `[publishPageExports] About to parse jsonData for file: filename="${file.filename}", name="${file.name}", jsonData length=${file.jsonData.length}`,
        );
        const parsedData = JSON.parse(file.jsonData);
        console.log(
          `[publishPageExports] Parsed JSON data for ${file.filename}, checking metadata...`,
        );

        // Validate that the JSON data is not empty
        if (!parsedData || Object.keys(parsedData).length === 0) {
          console.error(
            `[publishPageExports] ERROR: JSON data for ${file.filename} is empty!`,
          );
          throw new Error(
            `JSON data for ${file.filename} is empty. This should not happen.`,
          );
        }

        const guid = parsedData.metadata?.guid;
        const version = parsedData.metadata?.version;
        const pageName = parsedData.metadata?.name || file.name;
        const publishDate = parsedData.metadata?.publishDate;

        console.log(
          `[publishPageExports] File ${file.filename}: GUID=${guid}, version=${version}, name=${pageName}, publishDate=${publishDate || "undefined"}`,
        );

        if (guid) {
          // Only include in index.json if this component was explicitly published (publishNewVersion = true)
          // Since we've already filtered files to only include selected ones, all files here should be included
          // But we add an explicit check for safety
          const shouldIncludeInIndex =
            !pageDecisions ||
            pageDecisions.get(pageName)?.publishNewVersion === true;

          if (shouldIncludeInIndex) {
            console.log(
              `[publishPageExports] Including ${pageName} (GUID: ${guid}) in index.json with version ${version} and publishDate ${publishDate || "undefined"}`,
            );
            components[guid] = {
              name: pageName,
              path: filePath,
              version: version || 1,
              ...(publishDate && { publishDate }),
            };
          } else {
            console.log(
              `[publishPageExports] Skipping ${pageName} (GUID: ${guid}) from index.json (not selected for publishing)`,
            );
          }
        } else {
          console.warn(
            `[publishPageExports] No GUID found in metadata for ${file.filename}`,
          );
        }
      } catch (error) {
        console.error(
          `[publishPageExports] Failed to parse jsonData for file ${file.filename}:`,
          error,
        );
        throw error; // Re-throw to fail the publish if we can't parse the data
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

      // Validate jsonData is not empty before committing
      if (!file.jsonData || file.jsonData.trim().length === 0) {
        console.error(
          `[publishPageExports] ERROR: jsonData for ${file.filename} is empty!`,
        );
        throw new Error(
          `JSON data for ${file.filename} is empty. This should not happen.`,
        );
      }

      console.log(
        `[publishPageExports] Committing file ${file.filename} (${(file.jsonData.length / 1024).toFixed(2)} KB) to branch ${branchName}`,
      );

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

      console.log(
        `[publishPageExports] Successfully committed ${file.filename}`,
      );
    }

    // Read existing index.json if it exists, merge with new components, and write it back
    console.log("[publishPageExports] Reading existing index.json...");
    let indexJson: {
      components?: Record<
        string,
        { name: string; path: string; version: number }
      >;
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
        console.log(
          `[publishPageExports] Loaded existing index.json with ${Object.keys(indexJson.components || {}).length} components`,
        );
      }
    } catch {
      // index.json doesn't exist, that's fine - we'll create it
      console.log(
        "[publishPageExports] No existing index.json found, creating new one",
      );
    }

    // Merge new components into existing index.json
    // Only components that were explicitly selected for publishing are in the `components` object
    if (!indexJson.components) {
      indexJson.components = {};
    }

    const componentsBeforeMerge = Object.keys(indexJson.components).length;
    const componentsToAdd = Object.keys(components);
    console.log(
      `[publishPageExports] Adding/updating ${componentsToAdd.length} component(s) in index.json: ${componentsToAdd
        .map(
          (guid) => `${components[guid].name} (v${components[guid].version})`,
        )
        .join(", ")}`,
    );

    // Only update/add components that were explicitly selected for publishing
    Object.assign(indexJson.components, components);
    const componentsAfterMerge = Object.keys(indexJson.components).length;

    console.log(
      `[publishPageExports] Updated index.json: ${componentsBeforeMerge} -> ${componentsAfterMerge} components (added/updated ${componentsToAdd.length})`,
    );
    console.log(
      `[publishPageExports] All components in index.json: ${Object.keys(
        indexJson.components,
      )
        .map(
          (guid) =>
            `${indexJson.components![guid].name} (v${indexJson.components![guid].version})`,
        )
        .join(", ")}`,
    );

    // Write index.json to root of repo
    const indexContent = JSON.stringify(indexJson, null, 2);
    console.log(
      `[publishPageExports] Writing index.json (${(indexContent.length / 1024).toFixed(2)} KB)`,
    );
    await this.createOrUpdateFileInBranch(
      owner,
      repo,
      "index.json",
      indexContent,
      `Update index.json with ${exportData.pageName} and related components`,
      branchName,
      indexSha,
    );
    console.log("[publishPageExports] Successfully updated index.json");

    // Create PR body with list of exported files (only show files that were actually published)
    const fileList = files
      .map((file) => `- \`${file.filename}\` (${file.name})`)
      .join("\n");
    const prBody = `This PR publishes the Figma page "${exportData.pageName}" and related pages to the repository.

**Exported files:**
${fileList}

${changeMessage ? `**Change message:**\n${changeMessage}\n\n` : ""}**Export date:** ${new Date().toLocaleString()}`;

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

  async getPullRequestByNumber(
    owner: string,
    repo: string,
    prNumber: number,
  ): Promise<GitHubPullRequest> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    return this.makeRequest(url);
  }

  /**
   * Gets the commit SHA from a PR URL or branch name
   * Works with or without authentication (for public repos)
   * @param owner Repository owner
   * @param repo Repository name
   * @param input PR URL or branch name
   * @returns Commit SHA (branch name or PR head SHA)
   */
  async getCommitFromInput(
    owner: string,
    repo: string,
    input: string,
  ): Promise<{ commitSha: string; branchName?: string }> {
    // Helper function to make request with or without auth
    const makePublicRequest = async <T>(url: string): Promise<T> => {
      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
      };

      // Add auth header if we have a token
      if (this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `GitHub API error: ${response.status}`,
        );
      }

      return response.json() as Promise<T>;
    };

    // Check if input is a URL
    if (input.includes("https://github.com")) {
      // Extract PR number from URL
      // URL format: https://github.com/owner/repo/pull/123
      const prMatch = input.match(/\/pull\/(\d+)/);
      if (!prMatch) {
        throw new Error(
          `Invalid PR URL format. Expected: https://github.com/${owner}/${repo}/pull/123`,
        );
      }

      const prNumber = parseInt(prMatch[1], 10);
      if (isNaN(prNumber)) {
        throw new Error(`Invalid PR number in URL: ${prMatch[1]}`);
      }

      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
        const pr = await makePublicRequest<GitHubPullRequest>(url);
        return {
          commitSha: pr.head.sha,
          branchName: pr.head.ref,
        };
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("404") ||
            error.message.includes("Not Found")
          ) {
            throw new Error(
              `Pull Request #${prNumber} not found in ${owner}/${repo}`,
            );
          }
          throw new Error(
            `Failed to fetch Pull Request #${prNumber}: ${error.message}`,
          );
        }
        throw new Error(`Failed to fetch Pull Request #${prNumber}`);
      }
    } else {
      // Assume it's a branch name
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/branches/${input}`;
        const branch = await makePublicRequest<GitHubBranch>(url);
        return {
          commitSha: branch.commit.sha,
          branchName: input,
        };
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("404") ||
            error.message.includes("Not Found")
          ) {
            throw new Error(`Branch "${input}" not found in ${owner}/${repo}`);
          }
          throw new Error(
            `Failed to fetch branch "${input}": ${error.message}`,
          );
        }
        throw new Error(`Failed to fetch branch "${input}"`);
      }
    }
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

  /**
   * Loads index.json from a specific branch and returns a list of components
   * @param owner Repository owner
   * @param repo Repository name
   * @param branchIdentifier Branch name, commit SHA, or tag to load index.json from
   * @returns Array of component information with GUID, name, path, and version
   */
  async loadComponentsFromBranch(
    owner: string,
    repo: string,
    branchIdentifier: string,
  ): Promise<ComponentInfo[]> {
    try {
      // Fetch index.json from the specified branch
      const indexFile = await this.getRepoContents(
        owner,
        repo,
        "index.json",
        branchIdentifier,
      );

      if (Array.isArray(indexFile)) {
        throw new Error("Expected index.json to be a file, got directory");
      }

      // Use base64 content from API response to avoid CDN caching issues
      // GitHub API includes content for files under 1MB (index.json is small)
      let indexContent: string;
      if (indexFile.content && indexFile.encoding === "base64") {
        // Decode base64 content directly from API response (avoids CDN cache)
        // Properly handle UTF-8 encoding for Unicode characters (emojis, etc.)
        const binaryString = atob(indexFile.content.replace(/\s/g, ""));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        indexContent = new TextDecoder("utf-8").decode(bytes);
      } else {
        // Fallback: use download_url with cache-busting using SHA
        const cacheBustUrl = `${indexFile.download_url}?sha=${indexFile.sha}`;
        indexContent = await fetch(cacheBustUrl, {
          cache: "no-store", // Explicitly disable caching
        }).then((res) => {
          if (!res.ok) {
            throw new Error(
              `Failed to download index.json: ${res.status} ${res.statusText}`,
            );
          }
          return res.text();
        });
      }

      const indexJson: IndexJson = JSON.parse(indexContent);

      // Convert the components object to an array of ComponentInfo
      const components: ComponentInfo[] = [];

      if (indexJson.components) {
        for (const [guid, component] of Object.entries(indexJson.components)) {
          components.push({
            guid,
            name: component.name,
            path: component.path,
            version: component.version ?? 0, // Default to 0 if version is missing
            publishDate: component.publishDate,
          });
        }
      }

      return components;
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's a 404 (file not found) or 403 (forbidden/no access)
        if (
          error.message.includes("404") ||
          error.message.includes("403") ||
          error.message.includes("Not Found") ||
          error.message.includes("Forbidden")
        ) {
          throw new Error(
            `index.json not found in branch "${branchIdentifier}". The branch may not exist, you may not have access, or index.json may not have been created yet.`,
          );
        }
        throw new Error(
          `Failed to load components from branch "${branchIdentifier}": ${error.message}`,
        );
      }
      throw new Error(
        `Failed to load components from branch "${branchIdentifier}": Unknown error`,
      );
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
  ComponentInfo,
};
