#!/bin/bash

# Script to simulate CI environment locally
# This script mimics the GitHub Actions environment as closely as possible

set -e  # Exit on any error

echo "🚀 Simulating CI Build Environment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the root of the recursica repository"
    exit 1
fi

print_status "Setting up CI-like environment..."

# Set CI environment variables (like GitHub Actions does)
export CI=true
export GITHUB_ACTIONS=true
export GITHUB_WORKSPACE=$(pwd)

# Set up environment variables that would come from GitHub secrets
# You can modify these values to test different scenarios
export VITE_RECURSICA_API_URL="${VITE_RECURSICA_API_URL:-https://api.recursica.com}"
export VITE_RECURSICA_UI_URL="${VITE_RECURSICA_UI_URL:-https://app.recursica.com}"
export VITE_PLUGIN_PHRASE="${VITE_PLUGIN_PHRASE:-test-phrase-123}"
export RECURSICA_API_TEST="${RECURSICA_API_TEST:-https://test-api.recursica.com}"
export PLUGIN_PHRASE_TEST="${PLUGIN_PHRASE_TEST:-test-phrase-456}"

print_status "Environment variables set:"
echo "  VITE_RECURSICA_API_URL: $VITE_RECURSICA_API_URL"
echo "  VITE_RECURSICA_UI_URL: $VITE_RECURSICA_UI_URL"
echo "  VITE_PLUGIN_PHRASE: $VITE_PLUGIN_PHRASE"
echo "  RECURSICA_API_TEST: $RECURSICA_API_TEST"
echo "  PLUGIN_PHRASE_TEST: $PLUGIN_PHRASE_TEST"
echo ""

# Clean install (like CI does)
print_status "Performing clean install (npm ci)..."
if command -v npm &> /dev/null; then
    npm ci
    print_success "Clean install completed"
else
    print_error "npm not found. Please install Node.js and npm."
    exit 1
fi

echo ""

# Run the build (this will trigger our debug output)
print_status "Running build with debug output..."
echo "=================================="

# Export environment variables to ensure they're available to all child processes
export VITE_RECURSICA_API_URL="$VITE_RECURSICA_API_URL"
export VITE_RECURSICA_UI_URL="$VITE_RECURSICA_UI_URL"
export VITE_PLUGIN_PHRASE="$VITE_PLUGIN_PHRASE"
export RECURSICA_API_TEST="$RECURSICA_API_TEST"
export PLUGIN_PHRASE_TEST="$PLUGIN_PHRASE_TEST"

echo "🔍 DEBUG: Exported environment variables:"
echo "  VITE_RECURSICA_API_URL: '$VITE_RECURSICA_API_URL'"
echo "  VITE_RECURSICA_UI_URL: '$VITE_RECURSICA_UI_URL'"
echo "  VITE_PLUGIN_PHRASE: '$VITE_PLUGIN_PHRASE'"
echo "  RECURSICA_API_TEST: '$RECURSICA_API_TEST'"
echo "  PLUGIN_PHRASE_TEST: '$PLUGIN_PHRASE_TEST'"
echo ""

# Run the build
npm run build

echo ""
print_success "CI simulation completed!"
print_status "Check the output above to see where environment variables are getting lost."