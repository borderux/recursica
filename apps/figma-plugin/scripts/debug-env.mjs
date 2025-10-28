#!/usr/bin/env node

console.log('🔍 COMPREHENSIVE ENVIRONMENT VARIABLE DEBUGGING');
console.log('===============================================');
console.log('');

console.log('1. ALL environment variables:');
Object.keys(process.env)
  .sort()
  .forEach((key) => {
    const value = process.env[key];
    console.log(`  ${key}: ${value}`);
  });

console.log('');
console.log('2. Current working directory:');
console.log(`  cwd: ${process.cwd()}`);

console.log('');
console.log('3. Checking for .env files:');
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
console.log('4. Process arguments:');
console.log(`  argv: ${JSON.stringify(process.argv)}`);

console.log('');
console.log('===============================================');
console.log('End of environment debugging');
console.log('');
