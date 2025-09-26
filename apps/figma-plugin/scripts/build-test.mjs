#!/usr/bin/env node

/**
 * Build Test Script for Figma Plugin
 *
 * This script builds the test version of the figma plugin with cross-platform support.
 * It compiles TypeScript, builds the UI and code, copies the test manifest,
 * and copies updater scripts to the dist-test folder.
 *
 * Usage: node scripts/build-test.mjs
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parentDir = path.resolve(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`🔧 ${description}...`, 'blue');
    execSync(command, {
      stdio: 'inherit',
      cwd: parentDir,
    });
    log(`✅ ${description} completed`, 'green');
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

function copyFile(source, destination, description) {
  try {
    log(`📄 ${description}...`, 'blue');

    // Ensure destination directory exists
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(source, destination);
    log(`✅ ${description} completed`, 'green');
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

function clearDistTestFolder() {
  try {
    log(`🧹 Clearing dist-test folder...`, 'blue');

    const distTestDir = path.join(parentDir, 'dist-test');

    // Check if dist-test directory exists
    if (fs.existsSync(distTestDir)) {
      // Remove all files and subdirectories
      const files = fs.readdirSync(distTestDir);

      for (const file of files) {
        const filePath = path.join(distTestDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      }

      log(`✅ Dist-test folder cleared (${files.length} items removed)`, 'green');
    } else {
      log(`ℹ️  Dist-test folder doesn't exist, nothing to clear`, 'yellow');
    }
  } catch (error) {
    log(`❌ Failed to clear dist-test folder: ${error.message}`, 'red');
    process.exit(1);
  }
}

function copyUpdaterFiles() {
  try {
    log(`📁 Copying updater files...`, 'blue');

    const updaterDir = path.join(parentDir, 'scripts', 'updater');
    const distTestDir = path.join(parentDir, 'dist-test');

    // Check if updater directory exists
    if (!fs.existsSync(updaterDir)) {
      log(`⚠️  Updater directory not found: ${updaterDir}`, 'yellow');
      return;
    }

    // Ensure dist-test directory exists
    if (!fs.existsSync(distTestDir)) {
      fs.mkdirSync(distTestDir, { recursive: true });
    }

    // Read all files in updater directory
    const files = fs.readdirSync(updaterDir);

    for (const file of files) {
      const sourcePath = path.join(updaterDir, file);
      const destPath = path.join(distTestDir, file);

      // Skip directories, only copy files
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, destPath);
        log(`  📄 Copied ${file}`, 'cyan');
      }
    }

    log(`✅ Updater files copied (${files.length} files)`, 'green');
  } catch (error) {
    log(`❌ Failed to copy updater files: ${error.message}`, 'red');
    process.exit(1);
  }
}

function main() {
  try {
    log(`🚀 Starting ${colors.bright}Figma Plugin Test Build${colors.reset}`, 'bright');
    log(`📁 Working directory: ${parentDir}`, 'cyan');

    // Debug: Print environment variables
    log('', 'reset');
    log('🔍 DEBUG: Environment variables in main plugin build-test:', 'yellow');
    log(`  VITE_RECURSICA_API_URL: ${process.env.VITE_RECURSICA_API_URL}`, 'cyan');
    log(`  VITE_RECURSICA_UI_URL: ${process.env.VITE_RECURSICA_UI_URL}`, 'cyan');
    log(
      `  VITE_PLUGIN_PHRASE: ${process.env.VITE_PLUGIN_PHRASE ? process.env.VITE_PLUGIN_PHRASE.substring(0, 4) + '...' : 'undefined'}`,
      'cyan'
    );
    log(`  VITE_SHOW_VERSION_BANNER: ${process.env.VITE_SHOW_VERSION_BANNER}`, 'cyan');
    log(`  RECURSICA_API_TEST: ${process.env.RECURSICA_API_TEST}`, 'cyan');
    log(
      `  PLUGIN_PHRASE_TEST: ${process.env.PLUGIN_PHRASE_TEST ? process.env.PLUGIN_PHRASE_TEST.substring(0, 4) + '...' : 'undefined'}`,
      'cyan'
    );

    // Debug: Print all relevant environment variables
    log('', 'reset');
    log('🔍 DEBUG: All relevant environment variables:', 'yellow');
    const relevantEnvVars = Object.keys(process.env)
      .filter(
        (key) =>
          key.startsWith('VITE_') || key.startsWith('RECURSICA_') || key.startsWith('PLUGIN_')
      )
      .sort();

    relevantEnvVars.forEach((key) => {
      const value = process.env[key];
      // Mask sensitive values
      const displayValue =
        key.includes('PHRASE') || key.includes('TOKEN') || key.includes('SECRET')
          ? value
            ? `${value.substring(0, 4)}...`
            : 'undefined'
          : value;
      log(`  ${key}: ${displayValue}`, 'cyan');
    });

    log('');

    // Step 0: Clear dist-test folder
    clearDistTestFolder();
    log('');

    // Step 1: Compile TypeScript
    runCommand('tsc -b', 'Compiling TypeScript');
    log('');

    // Step 2: Build UI (test mode)
    runCommand('vite build --mode test', 'Building UI (test mode)');
    log('');

    // Step 3: Build code (test mode)
    runCommand('vite build --config vite.config.lib.ts --mode test', 'Building code (test mode)');
    log('');

    // Step 4: Copy test manifest
    const manifestSource = path.join(parentDir, 'manifest.test.json');
    const manifestDest = path.join(parentDir, 'dist-test', 'manifest.json');
    copyFile(manifestSource, manifestDest, 'Copying test manifest');
    log('');

    // Step 5: Copy updater files
    copyUpdaterFiles();
    log('');

    log(`🎉 Test build completed successfully!`, 'green');
    log(`📦 Output directory: ${path.join(parentDir, 'dist-test')}`, 'cyan');
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
main();
