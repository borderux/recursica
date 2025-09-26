#!/bin/bash

# Advanced CI simulation script with different test scenarios
# Usage: ./scripts/simulate-ci-build-advanced.sh [scenario]
# Scenarios: normal, missing-vars, undefined-vars, turbo-env-mode

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_scenario() {
    echo -e "${CYAN}🧪 $1${NC}"
}

# Get scenario from command line argument
SCENARIO=${1:-normal}

print_scenario "Running scenario: $SCENARIO"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the root of the recursica repository"
    exit 1
fi

# Function to set up environment based on scenario
setup_environment() {
    case $SCENARIO in
        "normal")
            print_status "Setting up normal CI environment..."
            export VITE_RECURSICA_API_URL="https://api.recursica.com"
            export VITE_RECURSICA_UI_URL="https://app.recursica.com"
            export VITE_PLUGIN_PHRASE="test-phrase-123"
            export RECURSICA_API_TEST="https://test-api.recursica.com"
            export PLUGIN_PHRASE_TEST="test-phrase-456"
            ;;
        "missing-vars")
            print_status "Setting up environment with missing variables..."
            export VITE_RECURSICA_API_URL="https://api.recursica.com"
            # Intentionally missing other variables
            ;;
        "undefined-vars")
            print_status "Setting up environment with undefined variables..."
            export VITE_RECURSICA_API_URL="undefined"
            export VITE_RECURSICA_UI_URL="undefined"
            export VITE_PLUGIN_PHRASE="undefined"
            export RECURSICA_API_TEST="undefined"
            export PLUGIN_PHRASE_TEST="undefined"
            ;;
        "turbo-env-mode")
            print_status "Setting up environment for turbo --env-mode=loose test..."
            export VITE_RECURSICA_API_URL="https://api.recursica.com"
            export VITE_RECURSICA_UI_URL="https://app.recursica.com"
            export VITE_PLUGIN_PHRASE="test-phrase-123"
            export RECURSICA_API_TEST="https://test-api.recursica.com"
            export PLUGIN_PHRASE_TEST="test-phrase-456"
            ;;
        *)
            print_error "Unknown scenario: $SCENARIO"
            print_status "Available scenarios: normal, missing-vars, undefined-vars, turbo-env-mode"
            exit 1
            ;;
    esac
}

# Set CI environment variables
export CI=true
export GITHUB_ACTIONS=true
export GITHUB_WORKSPACE=$(pwd)

# Setup environment based on scenario
setup_environment

print_status "Environment variables set:"
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

# Export environment variables
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

# Run build based on scenario
if [ "$SCENARIO" = "turbo-env-mode" ]; then
    print_status "Running build with --env-mode=loose..."
    npx turbo run build --env-mode=loose
else
    print_status "Running build..."
    npm run build
fi

echo ""
print_success "CI simulation completed for scenario: $SCENARIO"
print_status "Check the output above to see how environment variables are handled."
