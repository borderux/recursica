import { describe, it, expect, beforeAll } from 'vitest';
import { VersionCheckService } from '../versionCheck';

// Integration tests that call the real GitHub API
// These tests are disabled by default and should only be run manually
// To run: npx vitest run --reporter=verbose src/services/__tests__/versionCheck.integration.test.ts

describe.skip('VersionCheckService - Integration Tests (Real GitHub API)', () => {
  let versionCheckService: VersionCheckService;

  beforeAll(() => {
    versionCheckService = new VersionCheckService();
  });

  describe('Real GitHub API Integration', () => {
    it('should fetch and process real GitHub release data', async () => {
      console.log('🔍 Testing with real GitHub API...');

      // Test with a current version that should have updates available
      const result = await versionCheckService.checkForUpdates('0.0.1');

      console.log('📊 Real API Response:', {
        hasUpdate: result.hasUpdate,
        currentVersion: result.currentVersion,
        latestVersion: result.latestVersion,
        pluginMode: result.pluginMode,
        releaseUrl: result.releaseUrl,
        releaseNotesLength: result.releaseNotes.length,
        releaseNotesPreview: result.releaseNotes.substring(0, 200) + '...',
      });

      // Basic assertions
      expect(result).toBeDefined();
      expect(result.currentVersion).toBe('0.0.1');
      expect(result.latestVersion).toBeDefined();
      expect(result.pluginMode).toBeDefined();
      expect(result.releaseUrl).toContain('github.com');
      expect(result.releaseUrl).toContain('releases');

      // If there's an update available, verify the structure
      if (result.hasUpdate) {
        expect(result.latestVersion).not.toBe('0.0.1');
        expect(result.releaseNotes).toBeDefined();
        console.log('✅ Update available:', result.latestVersion);
      } else {
        console.log('ℹ️  No update available (current version is latest)');
      }
    }, 30000); // 30 second timeout for real API call

    it('should handle real API response format correctly', async () => {
      console.log('🔍 Testing API response format parsing...');

      // Test with a version that should exist
      const result = await versionCheckService.checkForUpdates('0.0.10');

      console.log('📋 API Response Analysis:');
      console.log('- Current Version:', result.currentVersion);
      console.log('- Latest Version:', result.latestVersion);
      console.log('- Has Update:', result.hasUpdate);
      console.log('- Plugin Mode:', result.pluginMode);
      console.log('- Release URL:', result.releaseUrl);
      console.log('- Release Notes Length:', result.releaseNotes.length);

      // Verify the response structure matches our expectations
      expect(typeof result.hasUpdate).toBe('boolean');
      expect(typeof result.currentVersion).toBe('string');
      expect(typeof result.latestVersion).toBe('string');
      expect(typeof result.releaseUrl).toBe('string');
      expect(typeof result.releaseNotes).toBe('string');
      expect(typeof result.pluginMode).toBe('string');

      // Verify version format (should be semantic version after cleaning)
      expect(result.currentVersion).toMatch(/^\d+\.\d+\.\d+/);
      expect(result.latestVersion).toMatch(/^\d+\.\d+\.\d+/);

      // Verify URL format
      expect(result.releaseUrl).toMatch(
        /^https:\/\/github\.com\/borderux\/recursica\/releases\/tag\//
      );

      console.log('✅ API response format is correct');
    }, 30000);

    it('should work with different plugin modes', async () => {
      console.log('🔍 Testing different plugin modes...');

      // Test with different versions to see behavior
      const testVersions = ['0.0.1', '0.0.5', '0.0.10', '1.0.0'];

      for (const version of testVersions) {
        console.log(`\n📦 Testing version: ${version}`);
        const result = await versionCheckService.checkForUpdates(version);

        console.log(`  - Has Update: ${result.hasUpdate}`);
        console.log(`  - Latest: ${result.latestVersion}`);
        console.log(`  - Mode: ${result.pluginMode}`);

        // All should have the same plugin mode (determined by environment)
        expect(result.pluginMode).toBeDefined();
        expect(['test', 'development', 'production']).toContain(result.pluginMode);
      }
    }, 60000); // 60 second timeout for multiple API calls

    it('should demonstrate version comparison with real data', async () => {
      console.log('🔍 Testing version comparison with real GitHub data...');

      // Get the latest version first
      const latestResult = await versionCheckService.checkForUpdates('0.0.1');
      const latestVersion = latestResult.latestVersion;

      console.log(`📊 Latest version from GitHub: ${latestVersion}`);

      // Test comparison with the actual latest version
      const sameVersionResult = await versionCheckService.checkForUpdates(latestVersion);
      console.log(`📊 Same version test (${latestVersion}):`, {
        hasUpdate: sameVersionResult.hasUpdate,
        currentVersion: sameVersionResult.currentVersion,
        latestVersion: sameVersionResult.latestVersion,
      });

      expect(sameVersionResult.hasUpdate).toBe(false);
      expect(sameVersionResult.currentVersion).toBe(latestVersion);
      expect(sameVersionResult.latestVersion).toBe(latestVersion);

      // Test with a version that should be older
      const olderVersion = '0.0.1';
      const olderResult = await versionCheckService.checkForUpdates(olderVersion);
      console.log(`📊 Older version test (${olderVersion}):`, {
        hasUpdate: olderResult.hasUpdate,
        currentVersion: olderResult.currentVersion,
        latestVersion: olderResult.latestVersion,
      });

      if (olderVersion !== latestVersion) {
        expect(olderResult.hasUpdate).toBe(true);
        expect(olderResult.currentVersion).toBe(olderVersion);
        expect(olderResult.latestVersion).toBe(latestVersion);
      }

      console.log('✅ Version comparison working correctly with real data');
    }, 45000);

    it('should parse npm package format versions correctly', async () => {
      console.log('🔍 Testing npm package format version parsing...');

      // Test with the actual format we get from GitHub
      const result = await versionCheckService.checkForUpdates('0.0.1');

      console.log('📦 Version parsing test:');
      console.log('- Raw latest version from GitHub:', result.latestVersion);
      console.log('- Parsed version should be clean semantic version');

      // The latest version should be parsed correctly from npm package format
      expect(result.latestVersion).toMatch(/^\d+\.\d+\.\d+$/);
      expect(result.latestVersion).not.toContain('@');
      expect(result.latestVersion).not.toContain('recursica');

      console.log('✅ Version parsing working correctly');
    }, 30000);
  });
});
