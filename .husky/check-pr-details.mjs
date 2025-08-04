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

/**
 * Logs a message
 * @param {string} message - The message to log
 */
function log(message) {
  // eslint-disable-next-line no-console
  console.error(message);
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
    log(`Error getting current branch: ${error.message}`);
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
      log("Could not find main or master branch");
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
    log("Skipping PULL-REQUEST-DETAILS.md check for main/master branch");
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
      log("PRE-PUSH HOOK FAILED");
      log("");
      log(`Cannot access remote branch 'origin/${mainBranch}'`);
      log("");
      log("How to fix:");
      log("   1. git fetch origin");
      log("   2. Try pushing again");
      log("");
      log("Hook Details:");
      log(`   Branch: ${currentBranch}`);
      log(`   Main branch: ${mainBranch}`);
      log("");
      process.exit(1);
    }

    execSync(
      `git diff --quiet origin/${mainBranch}..HEAD -- ${prDetailsFile}`,
      {
        stdio: "ignore",
      },
    );
    // File has NOT been modified (exit code 0 means no differences)
    log("");
    log("PRE-PUSH HOOK FAILED");
    log("");
    log(
      `PULL-REQUEST-DETAILS.md has not been updated for branch: ${currentBranch}`,
    );
    log("");
    log("Required Action:");
    log("   Update PULL-REQUEST-DETAILS.md with details of your changes");
    log("");
    log("How to fix:");
    log("   1. Open Cursor chat");
    log(
      "   2. Type in: 'Follow the instructions found in PULL-REQUEST-CHECK.txt'",
    );
    log("   3. Let Cursor update PULL-REQUEST-DETAILS.md for you");
    log("   4. git add PULL-REQUEST-DETAILS.md");
    log("   5. git commit -m 'Update PR details'");
    log("   6. git push origin ${currentBranch}");
    process.exit(1);
  } catch {
    // File HAS been modified (exit code 1 means differences found)
    log("PULL-REQUEST-DETAILS.md has been updated - proceeding with push");
    process.exit(0);
  }
}

// Execute the main function
main();
