# Pull Request Details

## Description

This pull request updates the Figma plugin's encryption phrase for production deployment and refactors the encryption service to use environment variables for better security and configuration management.

## Changes Made

### Figma Plugin:

- **Updated plugin phrase for production**: Changed the encryption phrase used in the plugin to the production version
- **Refactored encryption service**: Modified `crypto.ts` to use environment variable `VITE_PLUGIN_PHRASE` instead of hardcoded values
- **Enhanced security**: Moved sensitive configuration to environment variables for better security practices

### Release Workflow:

- **Added environment variable**: Updated `.github/workflows/release.yml` to include `VITE_PLUGIN_PHRASE` in the build environment
- **Improved deployment process**: Ensures the production plugin phrase is properly injected during the release build

### Changeset:

- **Added changeset**: Created `fast-doodles-lose.md` changeset to track the plugin phrase update for the next release

## Testing

- Verified that the encryption service properly reads from environment variables
- Confirmed that the release workflow includes the necessary environment variable
- Validated that the changeset properly documents the patch update

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Environment variables properly configured
- [x] No breaking changes introduced
- [x] Security improvements implemented
- [x] Release workflow updated
- [x] Changeset documentation added

## Additional Notes

This update improves the security posture of the Figma plugin by removing hardcoded sensitive values and using environment variables instead. The changes ensure that the production plugin uses the correct encryption phrase while maintaining the same functionality for end users.
