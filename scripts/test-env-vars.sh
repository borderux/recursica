#!/bin/bash

# Quick script to test environment variable passing
# This runs just the debug output without doing a full build

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Testing Environment Variable Passing${NC}"
echo "=================================="

# Set up test environment variables
export VITE_RECURSICA_API_URL="https://test-api.recursica.com"
export VITE_RECURSICA_UI_URL="https://test-app.recursica.com"
export VITE_PLUGIN_PHRASE="test-phrase-123"
export RECURSICA_API_TEST="https://test-api.recursica.com"
export PLUGIN_PHRASE_TEST="test-phrase-456"

echo "🔍 Environment variables set:"
echo "  VITE_RECURSICA_API_URL: $VITE_RECURSICA_API_URL"
echo "  VITE_RECURSICA_UI_URL: $VITE_RECURSICA_UI_URL"
echo "  VITE_PLUGIN_PHRASE: $VITE_PLUGIN_PHRASE"
echo "  RECURSICA_API_TEST: $RECURSICA_API_TEST"
echo "  PLUGIN_PHRASE_TEST: $PLUGIN_PHRASE_TEST"
echo ""

echo "🔍 Testing root build script debug output..."
node -e "console.log('🔍 DEBUG: Root build env vars:'); console.log(' VITE_RECURSICA_API_URL:', process.env.VITE_RECURSICA_API_URL); console.log(' VITE_PLUGIN_PHRASE:', process.env.VITE_PLUGIN_PHRASE ? process.env.VITE_PLUGIN_PHRASE.substring(0,4) + '...' : 'undefined'); console.log(' RECURSICA_API_TEST:', process.env.RECURSICA_API_TEST); console.log(' PLUGIN_PHRASE_TEST:', process.env.PLUGIN_PHRASE_TEST);"
echo ""

echo "🔍 Testing figma-plugin build:ui debug output..."
cd apps/figma-plugin
node -e "console.log('🔍 DEBUG: Environment variables in figma-plugin build:ui:'); console.log(' VITE_RECURSICA_API_URL:', process.env.VITE_RECURSICA_API_URL); console.log(' VITE_RECURSICA_UI_URL:', process.env.VITE_RECURSICA_UI_URL); console.log(' VITE_PLUGIN_PHRASE:', process.env.VITE_PLUGIN_PHRASE ? process.env.VITE_PLUGIN_PHRASE.substring(0, 4) + '...' : 'undefined');"
cd ../..
echo ""

echo "🔍 Testing figma-plugin-test build script debug output..."
cd apps/figma-plugin-test
node scripts/build.mjs
cd ../..
echo ""

echo -e "${GREEN}✅ Environment variable test completed!${NC}"
echo "Check the output above to see where variables are getting lost."
