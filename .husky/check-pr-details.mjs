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
import { existsSync } from "fs";

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
  } catch {
    log("❌ Error getting current branch", colors.red);
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
 * Checks if a file has been modified compared to the main branch
 * @param {string} filePath - The path to the file to check
 * @param {string} mainBranch - The main branch name
 * @returns {boolean} True if the file has been modified, false otherwise
 */
function checkFileModified(filePath, mainBranch) {
  try {
    // Check if the file has been modified compared to main branch
    execSync(`git diff --quiet origin/${mainBranch}..HEAD -- ${filePath}`, {
      stdio: "ignore",
    });
    return false; // File has NOT been modified (exit code 0 means no differences)
  } catch {
    return true; // File HAS been modified (exit code 1 means differences found)
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

  // Check if the file exists
  if (!existsSync(prDetailsFile)) {
    log("❌ ERROR: PULL-REQUEST-DETAILS.md does not exist!", colors.red);
    log("", colors.reset);
    log(
      "Please create PULL-REQUEST-DETAILS.md with the details of your changes before pushing.",
      colors.reset,
    );
    log("", colors.reset);
    log(
      "💡 Tip: Use Cursor chat with PULL-REQUEST-CHECK.txt as context to ensure your pull request is fully valid.",
      colors.yellow,
    );
    log("   Reference: PULL-REQUEST-CHECK.txt", colors.yellow);
    log("", colors.reset);
    process.exit(1);
  }

  // Check if the file has been modified
  if (!checkFileModified(prDetailsFile, mainBranch)) {
    log("", colors.reset);
    log("❌ ERROR: PULL-REQUEST-DETAILS.md has not been updated!", colors.red);
    log("", colors.reset);
    log(
      "Please update PULL-REQUEST-DETAILS.md with the details of your changes before pushing.",
      colors.reset,
    );
    log("", colors.reset);
    log(
      "💡 Tip: Use Cursor chat with PULL-REQUEST-CHECK.txt as context to ensure your pull request is fully valid.",
      colors.yellow,
    );
    log("   Reference: PULL-REQUEST-CHECK.txt", colors.yellow);
    log("", colors.reset);
    log(
      "After updating the file, commit your changes and try pushing again.",
      colors.reset,
    );
    log("", colors.reset);
    process.exit(1);
  }

  log(
    "✅ PULL-REQUEST-DETAILS.md has been updated - proceeding with push",
    colors.green,
  );
  process.exit(0);
}

// Execute the main function
main();
