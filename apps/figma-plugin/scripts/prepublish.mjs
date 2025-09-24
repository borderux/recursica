#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Prepublish Script for Main Figma Plugin
 *
 * This script runs automatically when the main figma plugin is published via Changesets.
 * It ensures the plugin is built with production environment variables after the version
 * number has been bumped by Changesets.
 *
 * Uses the existing 'build' script which builds for production.
 *
 * Environment Variables:
 * - VITE_RECURSICA_API_URL: Production API URL
 * - VITE_RECURSICA_UI_URL: Production UI URL
 * - VITE_PLUGIN_PHRASE: Production plugin phrase
 *
 * The main figma plugin always builds for production - test environment variables
 * are handled by the separate test plugin's prepublish script.
 */

import { execSync } from 'child_process';

console.log('🔍 Detecting build environment for main figma plugin...');

// The main figma plugin always builds for production
// Test environment variables are only used by the test plugin
console.log('🚀 Building for PRODUCTION environment');
console.log('📋 Environment variables:');
console.log(`  VITE_RECURSICA_API_URL: ${process.env.VITE_RECURSICA_API_URL}`);
console.log(`  VITE_RECURSICA_UI_URL: ${process.env.VITE_RECURSICA_UI_URL}`);
console.log(`  VITE_PLUGIN_PHRASE: ${process.env.VITE_PLUGIN_PHRASE}`);

execSync('npm run build', { stdio: 'inherit' });

console.log('✅ Main plugin build completed successfully!');
