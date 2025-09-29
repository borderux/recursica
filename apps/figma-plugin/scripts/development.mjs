#!/usr/bin/env node
/* eslint-disable no-undef */
/**
 * Development script for Figma plugin
 * Handles the complete development workflow with proper sequencing
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DIST_DEV_DIR = path.resolve(projectRoot, 'dist-dev');
const MANIFEST_SOURCE = path.resolve(projectRoot, 'manifest.development.json');
const MANIFEST_DEST = path.resolve(DIST_DEV_DIR, 'manifest.json');

function log(message) {
  console.log(`[dev] ${message}`);
}

function error(message) {
  console.error(`[dev] ❌ ${message}`);
}

function success(message) {
  console.log(`[dev] ✅ ${message}`);
}

function setupDistDev() {
  log('Setting up dist-dev directory...');

  // Create dist-dev directory
  if (!fs.existsSync(DIST_DEV_DIR)) {
    fs.mkdirSync(DIST_DEV_DIR, { recursive: true });
    success('Created dist-dev directory');
  }

  // Copy manifest
  if (fs.existsSync(MANIFEST_SOURCE)) {
    fs.copyFileSync(MANIFEST_SOURCE, MANIFEST_DEST);
    success('Copied manifest.development.json to dist-dev/manifest.json');
  } else {
    error('manifest.development.json not found');
    process.exit(1);
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function buildUIOnce() {
  log('Building UI once to create index.html...');
  try {
    await runCommand('npx', ['vite', 'build', '--mode', 'development']);
    success('UI built successfully');
  } catch (err) {
    error(`Failed to build UI: ${err.message}`);
    process.exit(1);
  }
}

function startWatchers() {
  log('Starting development watchers...');

  const uiProcess = spawn('npx', ['vite', 'build', '--watch', '--mode', 'development'], {
    stdio: 'inherit',
    shell: true,
    cwd: projectRoot,
  });

  const codeProcess = spawn(
    'npx',
    ['vite', 'build', '--watch', '--config', 'vite.config.lib.ts', '--mode', 'development'],
    {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,
    }
  );

  // Handle cleanup on exit
  process.on('SIGINT', () => {
    log('Shutting down development servers...');
    uiProcess.kill('SIGINT');
    codeProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('Shutting down development servers...');
    uiProcess.kill('SIGTERM');
    codeProcess.kill('SIGTERM');
    process.exit(0);
  });

  success('Development servers started');
  log('Press Ctrl+C to stop');
}

async function main() {
  try {
    log('Starting Figma plugin development...');

    // Step 1: Setup dist-dev directory
    setupDistDev();

    // Step 2: Build UI once to create index.html
    await buildUIOnce();

    // Step 3: Start watchers
    startWatchers();
  } catch (err) {
    error(`Development setup failed: ${err.message}`);
    process.exit(1);
  }
}

// Run the development script
main();
