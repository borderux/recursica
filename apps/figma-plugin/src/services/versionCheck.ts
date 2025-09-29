import axios from 'axios';

export interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  body: string;
}

export type PluginMode = 'test' | 'development' | 'production';

export interface VersionCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseUrl: string;
  downloadUrl: string;
  releaseNotes: string;
  pluginMode: PluginMode;
}

/**
 * Service for checking if there's a newer version of the plugin available on GitHub
 */
export class VersionCheckService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly owner = 'borderux';
  private readonly repo = 'recursica';

  /**
   * Check if there's a newer version available
   * @param currentVersion - The current version of the plugin
   * @returns Promise<VersionCheckResult> - Information about available updates
   */
  async checkForUpdates(currentVersion: string): Promise<VersionCheckResult> {
    try {
      // Get the plugin mode from environment variable
      const pluginMode = this.getPluginMode();

      // Get the latest release from GitHub
      const response = await axios.get<GitHubRelease>(
        `${this.baseUrl}/repos/${this.owner}/${this.repo}/releases/latest`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const latestRelease = response.data;
      const latestVersion = this.cleanVersion(latestRelease.tag_name);
      const cleanCurrentVersion = this.cleanVersion(currentVersion);

      // For test plugins, we might want to check for pre-release versions
      const hasUpdate = this.isNewerVersion(latestVersion, cleanCurrentVersion);

      return {
        hasUpdate,
        currentVersion: cleanCurrentVersion,
        latestVersion,
        releaseUrl: latestRelease.html_url,
        downloadUrl: `${latestRelease.html_url}/download/recursica-figma-plugin.zip`,
        releaseNotes: latestRelease.body || '',
        pluginMode,
      };
    } catch (error) {
      console.warn('Failed to check for updates:', error);
      // Return no update on error to avoid blocking the plugin
      return {
        hasUpdate: false,
        currentVersion: this.cleanVersion(currentVersion),
        latestVersion: this.cleanVersion(currentVersion),
        releaseUrl: '',
        downloadUrl: '',
        releaseNotes: '',
        pluginMode: this.getPluginMode(),
      };
    }
  }

  /**
   * Get the plugin mode from environment variable
   */
  private getPluginMode(): PluginMode {
    const pluginMode = import.meta.env.VITE_PLUGIN_MODE;

    // Validate the plugin mode
    if (pluginMode === 'test' || pluginMode === 'development' || pluginMode === 'production') {
      return pluginMode;
    }

    // Fallback: determine from Vite mode
    const viteMode = import.meta.env.MODE;
    if (viteMode === 'test') {
      return 'test';
    } else if (viteMode === 'development') {
      return 'development';
    } else {
      return 'production';
    }
  }

  /**
   * Clean version string by removing 'v' prefix and any other non-semantic parts
   */
  private cleanVersion(version: string): string {
    // Remove 'v' prefix
    let cleaned = version.replace(/^v/, '').trim();

    // Handle npm package format like "@scope/package@1.2.3" -> "1.2.3"
    const npmPackageMatch = cleaned.match(/@[^@]+@(.+)$/);
    if (npmPackageMatch) {
      cleaned = npmPackageMatch[1];
    }

    return cleaned;
  }

  /**
   * Compare two semantic versions
   * @param version1 - First version to compare
   * @param version2 - Second version to compare
   * @returns true if version1 is newer than version2
   */
  private isNewerVersion(version1: string, version2: string): boolean {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    // Ensure both arrays have the same length
    const maxLength = Math.max(v1Parts.length, v2Parts.length);
    while (v1Parts.length < maxLength) v1Parts.push(0);
    while (v2Parts.length < maxLength) v2Parts.push(0);

    for (let i = 0; i < maxLength; i++) {
      if (v1Parts[i] > v2Parts[i]) return true;
      if (v1Parts[i] < v2Parts[i]) return false;
    }

    return false; // Versions are equal
  }
}
