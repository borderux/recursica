#!/usr/bin/env node

/**
 * Git pre-push hook script to validate PULL-REQUEST-DETAILS.md updates
 *
 * This script ensures that PULL-REQUEST-DETAILS.md has been modified
 * before allowing a push to prevent incomplete pull requests.
 *
 * @author Recursica Team
 * @version 1.0.0
 */

import { execSync } from "child_process";

/* global console, process */

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

/**
 * Logs a message with optional color formatting
 * @param {string} message - The message to log
 * @param {string} color - The color code to apply
 */
function log(message, color = "") {
  // eslint-disable-next-line no-console
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Gets the current git branch name
 * @returns {string} The current branch name
 * @throws {Error} If unable to get branch name
 */
function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
    }).trim();
  } catch (error) {
    log(`❌ Error getting current branch: ${error.message}`, colors.red);
    process.exit(1);
  }
}

/**
 * Determines the main branch name (main or master)
 * @returns {string} The main branch name
 * @throws {Error} If neither main nor master branch exists
 */
function getMainBranch() {
  try {
    // Try main first, then master
    execSync("git rev-parse --verify origin/main", { stdio: "ignore" });
    return "main";
  } catch {
    try {
      execSync("git rev-parse --verify origin/master", { stdio: "ignore" });
      return "master";
    } catch {
      log("❌ Could not find main or master branch", colors.red);
      process.exit(1);
    }
  }
}

/**
 * Main function that orchestrates the pull request details validation
 */
function main() {
  const currentBranch = getCurrentBranch();
  const mainBranch = getMainBranch();
  const prDetailsFile = "PULL-REQUEST-DETAILS.md";

  // Skip check for main/master branch
  if (currentBranch === "main" || currentBranch === "master") {
    log(
      "ℹ️  Skipping PULL-REQUEST-DETAILS.md check for main/master branch",
      colors.blue,
    );
    process.exit(0);
  }

  // Check if the file has been modified compared to main branch
  try {
    // First check if we have the remote branch available
    try {
      execSync(`git rev-parse --verify origin/${mainBranch}`, {
        stdio: "ignore",
      });
    } catch (error) {
      log("🚫 PRE-PUSH HOOK FAILED", colors.red + colors.bold);
      log("", colors.reset);
      log(`❌ Cannot access remote branch 'origin/${mainBranch}'`, colors.red);
      log("", colors.reset);
      log("💡 Quick Fix:", colors.blue);
      log("   1. git fetch origin", colors.reset);
      log("   2. Try pushing again", colors.reset);
      log("", colors.reset);
      log("🔧 Hook Details:", colors.blue);
      log(`   Branch: ${currentBranch}`, colors.reset);
      log(`   Main branch: ${mainBranch}`, colors.reset);
      log("", colors.reset);
      process.exit(1);
    }

    execSync(
      `git diff --quiet origin/${mainBranch}..HEAD -- ${prDetailsFile}`,
      {
        stdio: "ignore",
      },
    );
    // File has NOT been modified (exit code 0 means no differences)
    log("", colors.reset);
    log("🚫 PRE-PUSH HOOK FAILED", colors.red + colors.bold);
    log("", colors.reset);
    log(
      `❌ PULL-REQUEST-DETAILS.md has not been updated for branch: ${currentBranch}`,
      colors.red,
    );
    log("", colors.reset);
    log("📝 Required Action:", colors.yellow + colors.bold);
    log(
      "   Update PULL-REQUEST-DETAILS.md with details of your changes",
      colors.reset,
    );
    log("", colors.reset);
    log("💡 Quick Fix:", colors.blue);
    log("   1. Edit PULL-REQUEST-DETAILS.md with your changes", colors.reset);
    log("   2. git add PULL-REQUEST-DETAILS.md", colors.reset);
    log("   3. git commit -m 'Update PR details'", colors.reset);
    log("   4. git push origin ${currentBranch}", colors.reset);
    log("", colors.reset);
    log("📋 Reference:", colors.yellow);
    log("   - PULL-REQUEST-CHECK.txt for validation guidelines", colors.reset);
    log(
      "   - Use Cursor chat with PULL-REQUEST-CHECK.txt as context",
      colors.reset,
    );
    log("", colors.reset);
    log("🔧 Hook Details:", colors.blue);
    log(`   Branch: ${currentBranch}`, colors.reset);
    log(`   Main branch: ${mainBranch}`, colors.reset);
    log(`   File checked: ${prDetailsFile}`, colors.reset);
    log("", colors.reset);
    process.exit(1);
  } catch {
    // File HAS been modified (exit code 1 means differences found)
    log(
      "✅ PULL-REQUEST-DETAILS.md has been updated - proceeding with push",
      colors.green,
    );
    process.exit(0);
  }
}

// Execute the main function
main();
