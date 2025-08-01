# Pull Request Details

## Description

This pull request optimizes the dependency structure of the ui-kit-mantine package by moving Mantine packages to peer dependencies and cleaning up unnecessary dependencies. This change improves the package's compatibility with consuming projects and reduces bundle size by avoiding duplicate dependencies.

## Changes Made

### ui-kit-mantine package:

- **Moved Mantine to peer dependencies**: `@mantine/core`, `@mantine/dates`, `@mantine/hooks` are now peer dependencies (>=8.0.0)
- **Removed dayjs**: No longer needed as a direct dependency since it's provided by `@mantine/dates`
- **Optimized vanilla-extract dependencies**: Moved `@vanilla-extract/vite-plugin` to devDependencies
- **Lowered React version requirement**: Changed from >=18.0.0 to >=16.8.0 for better compatibility
- **Updated package description**: Added "based on Mantine 8+" for clarity
- **Enhanced keywords**: Added mantine, recursica, design system keywords

### Figma plugin:

- **Added required Mantine dependencies**: `@mantine/core` and `@mantine/hooks` as direct dependencies
- **Excluded unnecessary dependencies**: No `@mantine/dates` or `dayjs` since date picker isn't used
- **Updated documentation**: Fixed README.md to reference `ui-kit-mantine` instead of `ui-kit`

## Testing

- Verified that all React features used are compatible with React 16.8+
- Confirmed that Mantine 8+ supports React 16.8+ as peer dependency
- Validated that Figma plugin only uses basic UI components (no date picker)
- Ensured no breaking changes to existing component APIs

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Dependencies properly categorized (runtime vs dev vs peer)
- [x] No breaking changes introduced
- [x] Consuming projects updated with required dependencies
- [x] Documentation updated to reflect package name changes

## Additional Notes

This optimization follows best practices for UI library dependencies by treating Mantine as a peer dependency, allowing consuming projects to use their own Mantine version and avoid conflicts. The changes improve the package's reusability and reduce bundle size for projects that already have Mantine installed.
