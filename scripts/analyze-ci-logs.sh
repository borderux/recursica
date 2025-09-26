#!/bin/bash

# Script to help analyze CI logs and extract environment variable information
# This script provides commands and patterns to help debug CI environment variable issues

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}🔍 CI Log Analysis Helper${NC}"
echo "=========================="
echo ""

echo -e "${BLUE}📋 Commands to extract environment variable info from CI logs:${NC}"
echo ""
echo "1. Extract all DEBUG lines:"
echo "   grep '🔍 DEBUG:' <ci-log-file>"
echo ""
echo "2. Extract GitHub secrets values:"
echo "   grep 'GitHub secrets values' -A 10 <ci-log-file>"
echo ""
echo "3. Extract environment variables before build:"
echo "   grep 'Environment variables from env section' -A 10 <ci-log-file>"
echo ""
echo "4. Extract environment variables after build:"
echo "   grep 'Environment variables after build' -A 10 <ci-log-file>"
echo ""
echo "5. Extract all environment variables containing VITE_, RECURSICA_, or PLUGIN_:"
echo "   grep 'All environment variables containing' -A 20 <ci-log-file>"
echo ""
echo "6. Extract build output for specific packages:"
echo "   grep -A 50 '@recursica/figma-plugin:build' <ci-log-file>"
echo "   grep -A 50 '@recursica/figma-plugin-test:build' <ci-log-file>"
echo ""

echo -e "${BLUE}🔧 How to update simulation script with real CI data:${NC}"
echo ""
echo "1. Copy the CI log output to a file:"
echo "   # Save CI logs to ci-logs.txt"
echo ""
echo "2. Extract the actual values:"
echo "   # Look for lines like:"
echo "   # VITE_RECURSICA_API_URL: 'https://api.recursica.com'"
echo "   # VITE_PLUGIN_PHRASE: 'actual-phrase-value'"
echo ""
echo "3. Update scripts/simulate-ci-from-logs.sh with real values:"
echo "   # Replace PLACEHOLDER_FROM_CI_LOGS with actual values"
echo ""

echo -e "${BLUE}🚨 Common CI Environment Variable Issues:${NC}"
echo ""
echo "1. Secrets not set in GitHub repository"
echo "   - Check: Settings > Secrets and variables > Actions"
echo "   - Verify: RECURSICA_API, PLUGIN_PHRASE, RECURSICA_API_TEST, PLUGIN_PHRASE_TEST"
echo ""
echo "2. Secrets set to literal 'undefined'"
echo "   - Check if secrets were accidentally set to the string 'undefined'"
echo "   - Look for: VITE_PLUGIN_PHRASE: 'undefined'"
echo ""
echo "3. Environment variables not being exported"
echo "   - Check if export statements are working in CI"
echo "   - Look for differences between 'from env section' and 'exported' values"
echo ""
echo "4. Turborepo filtering environment variables"
echo "   - Check if turbo.json env configuration is working"
echo "   - Look for differences between root and package-level variables"
echo ""

echo -e "${BLUE}📊 Expected vs Actual Comparison:${NC}"
echo ""
echo "Expected (working locally):"
echo "  VITE_RECURSICA_API_URL: https://api.recursica.com"
echo "  VITE_PLUGIN_PHRASE: actual-phrase-value"
echo "  RECURSICA_API_TEST: https://test-api.recursica.com"
echo "  PLUGIN_PHRASE_TEST: test-phrase-value"
echo ""
echo "Actual (from CI logs):"
echo "  # Copy actual values from CI logs here"
echo ""

echo -e "${GREEN}✅ Next Steps:${NC}"
echo ""
echo "1. Run the CI workflow and capture the logs"
echo "2. Use the grep commands above to extract environment variable information"
echo "3. Update scripts/simulate-ci-from-logs.sh with real CI values"
echo "4. Run the simulation script to reproduce the CI issue locally"
echo "5. Compare local simulation with actual CI behavior"
echo "6. Identify the root cause and implement a fix"
echo ""

echo -e "${YELLOW}💡 Pro Tip:${NC}"
echo "You can also use GitHub CLI to get workflow logs:"
echo "  gh run list --workflow=release.yml"
echo "  gh run view <run-id> --log"
echo ""
