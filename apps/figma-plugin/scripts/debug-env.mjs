#!/usr/bin/env node

console.log('🔍 COMPREHENSIVE ENVIRONMENT VARIABLE DEBUGGING');
console.log('===============================================');
console.log('');

console.log('1. All VITE_ environment variables:');
Object.keys(process.env)
  .filter((key) => key.startsWith('VITE_'))
  .sort()
  .forEach((key) => {
    const value = process.env[key];
    console.log(`  ${key}: ${value}`);
  });

console.log('');
console.log('2. CI and NODE_ENV:');
console.log(`  CI: ${process.env.CI}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);

console.log('');
console.log('3. Current working directory:');
console.log(`  cwd: ${process.cwd()}`);

console.log('');
console.log('4. Checking for .env files:');
import fs from 'fs';
import path from 'path';

const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
envFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  Found: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');
    console.log('    Content:');
    content.split('\n').forEach((line) => {
      if (line.trim()) {
        console.log(`      ${line}`);
      }
    });
  } else {
    console.log(`  Not found: ${file}`);
  }
});

console.log('');
console.log('5. All environment variables (filtered for common build vars):');
const commonVars = ['CI', 'NODE_ENV', 'NODE_OPTIONS', 'npm_config_', 'npm_lifecycle_'];
Object.keys(process.env)
  .filter((key) => key.startsWith('VITE_') || commonVars.some((prefix) => key.startsWith(prefix)))
  .sort()
  .forEach((key) => {
    const value = process.env[key];
    console.log(`  ${key}: ${value}`);
  });

console.log('');
console.log('6. Process arguments:');
console.log(`  argv: ${JSON.stringify(process.argv)}`);

console.log('');
console.log('7. Vite-specific environment variables:');
const viteVars = Object.keys(process.env).filter(
  (key) =>
    key.startsWith('VITE_') ||
    key.includes('VITE') ||
    key === 'MODE' ||
    key === 'BASE_URL' ||
    key === 'PROD' ||
    key === 'DEV'
);
viteVars.forEach((key) => {
  console.log(`  ${key}: ${process.env[key]}`);
});

console.log('');
console.log('===============================================');
console.log('End of environment debugging');
console.log('');
