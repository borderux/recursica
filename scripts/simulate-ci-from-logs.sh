#!/bin/bash

# Script to simulate CI environment based on actual CI logs
# This script will be updated with real values from CI logs to replicate the exact conditions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

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

print_scenario() {
    echo -e "${CYAN}🧪 $1${NC}"
}

print_scenario "Simulating CI Environment from Logs"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the root of the recursica repository"
    exit 1
fi

# Set CI environment variables (like GitHub Actions does)
export CI=true
export GITHUB_ACTIONS=true
export GITHUB_WORKSPACE=$(pwd)

# TODO: Update these values with actual values from CI logs
# These are placeholder values that should be replaced with real CI data
export VITE_RECURSICA_API_URL="${VITE_RECURSICA_API_URL:-PLACEHOLDER_FROM_CI_LOGS}"
export VITE_RECURSICA_UI_URL="${VITE_RECURSICA_UI_URL:-PLACEHOLDER_FROM_CI_LOGS}"
export VITE_PLUGIN_PHRASE="${VITE_PLUGIN_PHRASE:-PLACEHOLDER_FROM_CI_LOGS}"
export RECURSICA_API_TEST="${RECURSICA_API_TEST:-PLACEHOLDER_FROM_CI_LOGS}"
export PLUGIN_PHRASE_TEST="${PLUGIN_PHRASE_TEST:-PLACEHOLDER_FROM_CI_LOGS}"

print_status "Environment variables set (from CI logs):"
echo "  VITE_RECURSICA_API_URL: $VITE_RECURSICA_API_URL"
echo "  VITE_RECURSICA_UI_URL: $VITE_RECURSICA_UI_URL"
echo "  VITE_PLUGIN_PHRASE: $VITE_PLUGIN_PHRASE"
echo "  RECURSICA_API_TEST: $RECURSICA_API_TEST"
echo "  PLUGIN_PHRASE_TEST: $PLUGIN_PHRASE_TEST"
echo ""

# Clean install
print_status "Performing clean install (npm ci)..."
npm ci
print_success "Clean install completed"
echo ""

# Export environment variables (mimicking the CI workflow)
export VITE_RECURSICA_API_URL="$VITE_RECURSICA_API_URL"
export VITE_RECURSICA_UI_URL="$VITE_RECURSICA_UI_URL"
export VITE_PLUGIN_PHRASE="$VITE_PLUGIN_PHRASE"
export RECURSICA_API_TEST="$RECURSICA_API_TEST"
export PLUGIN_PHRASE_TEST="$PLUGIN_PHRASE_TEST"

echo "🔍 DEBUG: GitHub secrets values (raw):"
echo "  RECURSICA_API: '$VITE_RECURSICA_API_URL'"
echo "  PLUGIN_PHRASE: '$VITE_PLUGIN_PHRASE'"
echo "  RECURSICA_API_TEST: '$RECURSICA_API_TEST'"
echo "  PLUGIN_PHRASE_TEST: '$PLUGIN_PHRASE_TEST'"
echo ""
echo "🔍 DEBUG: GitHub secrets lengths:"
echo "  RECURSICA_API length: ${#VITE_RECURSICA_API_URL}"
echo "  PLUGIN_PHRASE length: ${#VITE_PLUGIN_PHRASE}"
echo "  RECURSICA_API_TEST length: ${#RECURSICA_API_TEST}"
echo "  PLUGIN_PHRASE_TEST length: ${#PLUGIN_PHRASE_TEST}"
echo ""
echo "🔍 DEBUG: Environment variables being set in workflow:"
echo "  VITE_RECURSICA_API_URL: '$VITE_RECURSICA_API_URL'"
echo "  VITE_RECURSICA_UI_URL: '$VITE_RECURSICA_UI_URL'"
echo "  VITE_PLUGIN_PHRASE: '$VITE_PLUGIN_PHRASE'"
echo "  RECURSICA_API_TEST: '$RECURSICA_API_TEST'"
echo "  PLUGIN_PHRASE_TEST: '$PLUGIN_PHRASE_TEST'"
echo ""
echo "🔍 DEBUG: Environment variables from env section:"
echo "  VITE_RECURSICA_API_URL: '$VITE_RECURSICA_API_URL'"
echo "  VITE_RECURSICA_UI_URL: '$VITE_RECURSICA_UI_URL'"
echo "  VITE_PLUGIN_PHRASE: '$VITE_PLUGIN_PHRASE'"
echo "  RECURSICA_API_TEST: '$RECURSICA_API_TEST'"
echo "  PLUGIN_PHRASE_TEST: '$PLUGIN_PHRASE_TEST'"
echo ""
echo "🔍 DEBUG: Exported environment variables:"
echo "  VITE_RECURSICA_API_URL: '$VITE_RECURSICA_API_URL'"
echo "  VITE_RECURSICA_UI_URL: '$VITE_RECURSICA_UI_URL'"
echo "  VITE_PLUGIN_PHRASE: '$VITE_PLUGIN_PHRASE'"
echo "  RECURSICA_API_TEST: '$RECURSICA_API_TEST'"
echo "  PLUGIN_PHRASE_TEST: '$PLUGIN_PHRASE_TEST'"
echo ""
echo "🔍 DEBUG: All environment variables containing VITE_, RECURSICA_, or PLUGIN_:"
env | grep -E "(VITE_|RECURSICA_|PLUGIN_)" | sort
echo ""
echo "🔍 DEBUG: Starting build process..."
npm run build
echo ""
echo "🔍 DEBUG: Environment variables after build:"
echo "  VITE_RECURSICA_API_URL: '$VITE_RECURSICA_API_URL'"
echo "  VITE_RECURSICA_UI_URL: '$VITE_RECURSICA_UI_URL'"
echo "  VITE_PLUGIN_PHRASE: '$VITE_PLUGIN_PHRASE'"
echo "  RECURSICA_API_TEST: '$RECURSICA_API_TEST'"
echo "  PLUGIN_PHRASE_TEST: '$PLUGIN_PHRASE_TEST'"
echo ""
echo "🔍 DEBUG: All environment variables containing VITE_, RECURSICA_, or PLUGIN_ after build:"
env | grep -E "(VITE_|RECURSICA_|PLUGIN_)" | sort

echo ""
print_success "CI simulation from logs completed!"
print_status "Compare this output with the actual CI logs to identify differences."
