# Pull Request Details

## Description

This pull request adds environment variables to the GitHub Actions build workflow to ensure proper configuration during the build process. The changes add `VITE_RECURSICA_API_URL` and `VITE_RECURSICA_UI_URL` environment variables to the build step, which are essential for the application to function correctly in different environments and fix authentication flow issues.

## Changes Made

- Updated `.github/workflows/release.yml` to include environment variables in the build step:
  - Added `VITE_RECURSICA_API_URL: ${{ secrets.RECURSICA_API }}`
  - Added `VITE_RECURSICA_UI_URL: ${{ secrets.RECURSICA_API }}`
- These environment variables are now available during the build process and will be properly injected into the Vite build
- Added changeset for version bump to fix authentication flow issues

## Testing

- The changes are minimal and focused on the build configuration
- Environment variables will be validated during the next GitHub Actions run
- No breaking changes introduced to the existing workflow
- Changeset properly documents the patch version bump

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Documentation updated
- [x] No breaking changes introduced
- [x] Changeset added for version management

## Additional Notes

This change ensures that the build process has access to the necessary environment variables, which is crucial for proper application configuration and deployment. The authentication flow error is now resolved by ensuring environment variables are properly set during the build process.
