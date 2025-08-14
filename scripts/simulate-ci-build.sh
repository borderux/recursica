#!/bin/bash

# Script to simulate CI build environment locally
# This replicates the conditions from .github/workflows/pull-request.yml
# Focuses on cache clearing and fresh installs

set -e  # Exit on any error

echo "🧪 Simulating CI build environment..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    echo "❌ Error: Must run this script from the project root directory"
    exit 1
fi

# Clean environment completely (like CI)
echo "🧹 Cleaning environment completely..."
echo "   - Removing node_modules"
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules

echo "   - Removing turbo cache"
rm -rf .turbo

echo "   - Removing all dist directories"
rm -rf packages/*/dist
rm -rf apps/*/dist

echo "   - Clearing npm cache"
npm cache clean --force

echo "   - Clearing turbo cache"
rm -rf .turbo

# Install dependencies like CI does (fresh install)
echo "📥 Installing dependencies (npm ci)..."
export HUSKY=0  # Prevent husky from installing git hooks (like CI)
npm ci

# Build the project
echo "🔨 Building project..."
npm run build

# Check types
echo "🔍 Checking types..."
npm run check-types

# Run tests
echo "🧪 Running tests..."
npm run test

echo ""
echo "✅ CI simulation completed successfully!"
echo "If this passes, your CI build should also pass."
