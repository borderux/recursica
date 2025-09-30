#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-undef */

/**
 * Deploy Storybook to GitHub Pages
 *
 * This script deploys the built Storybook to GitHub Pages at the /storybook/ subpath.
 * It creates a root index.html that redirects to storybook and deploys both.
 *
 * This script is used by the changesets release workflow to deploy the main Storybook.
 * PR previews are handled separately by the storybook-pr-preview.yml workflow.
 *
 * Prerequisites:
 * - Storybook must be built (dist directory must exist)
 * - GitHub CLI (gh) must be installed and authenticated
 * - Repository must have Pages permissions enabled
 * - The gh-pages branch must be set as the source branch for GitHub Pages
 *
 * The Storybook will be available at: https://[username].github.io/recursica/storybook/
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parentDir = path.resolve(__dirname, "..");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`🔧 ${description}...`, "blue");
    execSync(command, {
      stdio: "inherit",
      cwd: parentDir,
    });
    log(`✅ ${description} completed`, "green");
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, "red");
    return false;
  }
}

function deployToGitHubPages() {
  try {
    log("🚀 Starting Storybook deployment to GitHub Pages", "bright");

    // Check if dist directory exists (should be built by turbo)
    const storybookStaticDir = path.join(parentDir, "dist");
    if (!fs.existsSync(storybookStaticDir)) {
      log("❌ dist directory not found. Turbo should have built it.", "red");
      process.exit(1);
    }

    // Configure Git (skip if SKIP_GIT_CONFIG is set)
    if (!process.env.SKIP_GIT_CONFIG) {
      if (
        !runCommand(
          'git config --global user.name "github-actions[bot]"',
          "Configuring Git user name",
        )
      ) {
        process.exit(1);
      }

      if (
        !runCommand(
          'git config --global user.email "github-actions[bot]@users.noreply.github.com"',
          "Configuring Git user email",
        )
      ) {
        process.exit(1);
      }
    } else {
      log("⏭️  Skipping Git configuration (SKIP_GIT_CONFIG is set)", "yellow");
    }

    // Install gh-pages if not already installed
    if (!runCommand("npm install --save-dev gh-pages", "Installing gh-pages")) {
      process.exit(1);
    }

    // Verify the static root index.html exists
    const rootIndexPath = path.join(parentDir, "root-html", "index.html");

    if (!fs.existsSync(rootIndexPath)) {
      log("❌ Static index.html not found in root-html directory", "red");
      process.exit(1);
    }

    log("📄 Found static root index.html redirect", "green");

    // Get repository URL from environment or git config
    const repoUrl = process.env.GITHUB_REPOSITORY
      ? `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`
      : null;

    // If we're not in GitHub Actions, skip actual deployment for testing
    if (!repoUrl) {
      log(
        "🧪 Not in GitHub Actions environment - skipping actual deployment",
        "yellow",
      );
      log(
        "✅ Storybook build completed successfully (deployment skipped)",
        "green",
      );
      return;
    }

    // Deploy root index.html
    if (
      !runCommand(
        `npx gh-pages -d root-html -b gh-pages --dest "." --repo "${repoUrl}"`,
        "Deploying root index.html",
      )
    ) {
      process.exit(1);
    }

    // Deploy storybook
    if (
      !runCommand(
        `npx gh-pages -d dist -b gh-pages --dest "storybook" --repo "${repoUrl}"`,
        "Deploying Storybook to /storybook/",
      )
    ) {
      process.exit(1);
    }

    log("🎉 Storybook deployment completed successfully!", "green");
    log(
      "📦 Storybook available at: https://[username].github.io/recursica/storybook/",
      "cyan",
    );
  } catch (error) {
    log(`❌ Deployment failed: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the deployment
deployToGitHubPages();
