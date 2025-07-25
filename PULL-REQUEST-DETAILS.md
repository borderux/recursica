# Pull Request Details

## Description

This pull request introduces a robust pre-push validation system using Husky and a custom Node.js script. The system ensures that all contributors provide meaningful, non-template content in `PULL-REQUEST-DETAILS.md` before code can be pushed. This enforces better documentation and review practices for all pull requests.

## Changes Made

- Added a cross-platform Husky pre-push hook (`.husky/pre-push`) that runs a Node.js script
- Implemented `.husky/check-pr-details.mjs` to check for:
  - Existence of `PULL-REQUEST-DETAILS.md`
  - That the file is not just template content
  - That the file is updated compared to main
- Updated `.husky/README.md` with documentation for the new hook
- Added a GitHub Actions workflow to auto-populate PR descriptions from `PULL-REQUEST-DETAILS.md`

## Testing

- Manual testing: Verified that pushes are blocked if the details file is missing or contains only template content
- Confirmed that pushes succeed when the file contains meaningful, updated content
- Validated cross-platform compatibility (Node.js script)

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Documentation updated
- [x] No breaking changes introduced

## Additional Notes

This change improves the quality and consistency of pull request documentation, making code reviews more effective and ensuring that all changes are properly described for future reference.
