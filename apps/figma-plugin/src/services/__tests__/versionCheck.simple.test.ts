import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { VersionCheckService, type GitHubRelease } from '../versionCheck';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('VersionCheckService - Core Functionality', () => {
  let versionCheckService: VersionCheckService;

  beforeEach(() => {
    versionCheckService = new VersionCheckService();
    vi.clearAllMocks();
  });

  describe('checkForUpdates - Basic Functionality', () => {
    it('should return update available when newer version exists', async () => {
      // Mock successful GitHub API response
      const mockRelease: GitHubRelease = {
        tag_name: 'v1.2.0',
        name: 'Release 1.2.0',
        html_url: 'https://github.com/borderux/recursica/releases/tag/v1.2.0',
        published_at: '2024-01-15T10:00:00Z',
        body: 'This is a test release with new features.',
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockRelease,
      });

      const result = await versionCheckService.checkForUpdates('1.1.0');

      expect(result.hasUpdate).toBe(true);
      expect(result.currentVersion).toBe('1.1.0');
      expect(result.latestVersion).toBe('1.2.0');
      expect(result.releaseUrl).toBe('https://github.com/borderux/recursica/releases/tag/v1.2.0');
      expect(result.releaseNotes).toBe('This is a test release with new features.');
      expect(result.pluginMode).toBeDefined();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/repos/borderux/recursica/releases/latest',
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
          timeout: 10000,
        }
      );
    });

    it('should return no update when current version is latest', async () => {
      const mockRelease: GitHubRelease = {
        tag_name: 'v1.1.0',
        name: 'Release 1.1.0',
        html_url: 'https://github.com/borderux/recursica/releases/tag/v1.1.0',
        published_at: '2024-01-15T10:00:00Z',
        body: 'This is the current release.',
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockRelease,
      });

      const result = await versionCheckService.checkForUpdates('1.1.0');

      expect(result.hasUpdate).toBe(false);
      expect(result.currentVersion).toBe('1.1.0');
      expect(result.latestVersion).toBe('1.1.0');
      expect(result.releaseUrl).toBe('https://github.com/borderux/recursica/releases/tag/v1.1.0');
      expect(result.releaseNotes).toBe('This is the current release.');
    });

    it('should handle version with v prefix correctly', async () => {
      const mockRelease: GitHubRelease = {
        tag_name: 'v2.0.0',
        name: 'Release 2.0.0',
        html_url: 'https://github.com/borderux/recursica/releases/tag/v2.0.0',
        published_at: '2024-01-15T10:00:00Z',
        body: 'Major release with breaking changes.',
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockRelease,
      });

      const result = await versionCheckService.checkForUpdates('v1.5.0');

      expect(result.hasUpdate).toBe(true);
      expect(result.currentVersion).toBe('1.5.0'); // v prefix should be removed
      expect(result.latestVersion).toBe('2.0.0'); // v prefix should be removed
      expect(result.releaseUrl).toBe('https://github.com/borderux/recursica/releases/tag/v2.0.0');
      expect(result.releaseNotes).toBe('Major release with breaking changes.');
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await versionCheckService.checkForUpdates('1.0.0');

      expect(result.hasUpdate).toBe(false);
      expect(result.currentVersion).toBe('1.0.0');
      expect(result.latestVersion).toBe('1.0.0');
      expect(result.releaseUrl).toBe('');
      expect(result.releaseNotes).toBe('');
    });

    it('should handle timeout errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('timeout'));

      const result = await versionCheckService.checkForUpdates('1.0.0');

      expect(result.hasUpdate).toBe(false);
      expect(result.currentVersion).toBe('1.0.0');
      expect(result.latestVersion).toBe('1.0.0');
      expect(result.releaseUrl).toBe('');
      expect(result.releaseNotes).toBe('');
    });
  });

  describe('version comparison', () => {
    it('should correctly compare semantic versions', async () => {
      const testCases = [
        { current: '1.0.0', latest: '1.0.1', shouldUpdate: true },
        { current: '1.0.0', latest: '1.1.0', shouldUpdate: true },
        { current: '1.0.0', latest: '2.0.0', shouldUpdate: true },
        { current: '1.1.0', latest: '1.0.0', shouldUpdate: false },
        { current: '2.0.0', latest: '1.9.9', shouldUpdate: false },
        { current: '1.0.0', latest: '1.0.0', shouldUpdate: false },
        { current: '0.9.9', latest: '1.0.0', shouldUpdate: true },
      ];

      for (const testCase of testCases) {
        const mockRelease: GitHubRelease = {
          tag_name: `v${testCase.latest}`,
          name: `Release ${testCase.latest}`,
          html_url: `https://github.com/borderux/recursica/releases/tag/v${testCase.latest}`,
          published_at: '2024-01-15T10:00:00Z',
          body: 'Test release.',
        };

        mockedAxios.get.mockResolvedValueOnce({
          data: mockRelease,
        });

        const result = await versionCheckService.checkForUpdates(testCase.current);

        expect(result.hasUpdate).toBe(testCase.shouldUpdate);
        expect(result.currentVersion).toBe(testCase.current);
        expect(result.latestVersion).toBe(testCase.latest);
      }
    });
  });

  describe('version parsing', () => {
    it('should handle npm package format versions', async () => {
      const mockRelease: GitHubRelease = {
        tag_name: '@recursica/figma-plugin-test@0.1.0',
        name: 'Release 0.1.0',
        html_url:
          'https://github.com/borderux/recursica/releases/tag/%40recursica%2Ffigma-plugin-test%400.1.0',
        published_at: '2024-01-15T10:00:00Z',
        body: 'Test release with npm package format.',
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockRelease,
      });

      const result = await versionCheckService.checkForUpdates('0.0.1');

      expect(result.hasUpdate).toBe(true);
      expect(result.currentVersion).toBe('0.0.1');
      expect(result.latestVersion).toBe('0.1.0'); // Should be cleaned from npm package format
      expect(result.releaseUrl).toBe(
        'https://github.com/borderux/recursica/releases/tag/%40recursica%2Ffigma-plugin-test%400.1.0'
      );
    });

    it('should handle regular semantic versions', async () => {
      const mockRelease: GitHubRelease = {
        tag_name: 'v1.2.3',
        name: 'Release 1.2.3',
        html_url: 'https://github.com/borderux/recursica/releases/tag/v1.2.3',
        published_at: '2024-01-15T10:00:00Z',
        body: 'Test release with regular version.',
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockRelease,
      });

      const result = await versionCheckService.checkForUpdates('1.0.0');

      expect(result.hasUpdate).toBe(true);
      expect(result.currentVersion).toBe('1.0.0');
      expect(result.latestVersion).toBe('1.2.3'); // Should remove 'v' prefix
      expect(result.releaseUrl).toBe('https://github.com/borderux/recursica/releases/tag/v1.2.3');
    });

    it('should handle versions without prefix', async () => {
      const mockRelease: GitHubRelease = {
        tag_name: '2.0.0',
        name: 'Release 2.0.0',
        html_url: 'https://github.com/borderux/recursica/releases/tag/2.0.0',
        published_at: '2024-01-15T10:00:00Z',
        body: 'Test release without prefix.',
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockRelease,
      });

      const result = await versionCheckService.checkForUpdates('1.0.0');

      expect(result.hasUpdate).toBe(true);
      expect(result.currentVersion).toBe('1.0.0');
      expect(result.latestVersion).toBe('2.0.0'); // Should remain unchanged
      expect(result.releaseUrl).toBe('https://github.com/borderux/recursica/releases/tag/2.0.0');
    });
  });
});
