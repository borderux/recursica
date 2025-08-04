# Pull Request Details

## Description

This pull request implements automated GitHub Pages deployment for the UI Kit Mantine Storybook documentation. The deployment will automatically build and publish the Storybook to GitHub Pages whenever changes are made to the ui-kit-mantine package on the main branch.

## Changes Made

### GitHub Actions Workflow:

- **Created `.github/workflows/storybook-deploy.yml`**: New CI/CD pipeline for automated Storybook deployment
  - Triggers on pushes to main branch that affect ui-kit-mantine package
  - Triggers on pull requests for preview builds
  - Supports manual workflow dispatch
  - Uses Node.js 20 with npm caching for faster builds
  - Implements proper GitHub Pages permissions and concurrency controls
  - Only deploys from main branch (not from pull requests)

### Storybook Configuration:

- **Updated `.storybook/main.ts`**: Added Vite configuration for GitHub Pages subpath deployment
  - Sets base path to `/ui-kit-mantine/` for production builds
  - Maintains local development with `/` base path
  - Ensures proper asset loading on GitHub Pages

### Package Configuration:

- **Updated `package.json`**: Modified build-storybook script to output to `storybook-static` directory
  - Changed from default `storybook-static` to explicit output directory
  - Ensures consistent build output location for GitHub Actions

### Documentation Updates:

- **Updated `README.md`**: Updated Storybook documentation URL
  - Changed from Vercel deployment to GitHub Pages URL
  - New URL: `https://borderux.github.io/recursica/ui-kit-mantine/`

### GitHub Pages Setup:

- **Added `.nojekyll` file**: Prevents Jekyll processing on GitHub Pages
  - Ensures static files are served correctly
  - Required for proper Storybook deployment

## Technical Implementation

### Deployment Process:

1. **Build Job**:

   - Checks out repository code
   - Sets up Node.js 20 environment with npm caching
   - Installs all dependencies (including monorepo packages)
   - Builds Storybook static files to `storybook-static` directory
   - Uploads build artifacts for deployment

2. **Deploy Job**:
   - Only runs on main branch pushes (not pull requests)
   - Deploys uploaded artifacts to GitHub Pages
   - Provides deployment URL for verification

### Security & Permissions:

- Uses GitHub's OIDC (OpenID Connect) for secure authentication
- Implements proper permission scoping (read contents, write pages, write id-token)
- Prevents multiple simultaneous deployments with concurrency controls

### Performance Optimizations:

- Uses npm caching for faster dependency installation
- Implements proper build artifact handling
- Configures Vite for optimized production builds

## Testing & Validation

- **Build Testing**: Verified Storybook builds successfully with new configuration
- **Linting**: Confirmed no new linting errors introduced
- **Configuration**: Validated GitHub Pages subpath configuration works correctly
- **Documentation**: Updated README with correct deployment URL

## Deployment URL

Once merged to main, the Storybook will be available at:
**https://borderux.github.io/recursica/ui-kit-mantine/**

## Checklist

- [x] GitHub Actions workflow created and configured
- [x] Storybook build configuration updated for GitHub Pages
- [x] Package.json build script modified
- [x] Documentation updated with correct URL
- [x] .nojekyll file added for proper static file serving
- [x] Build testing completed successfully
- [x] Linting passes without errors
- [x] No breaking changes introduced

## Additional Notes

This deployment setup provides several benefits:

- **Automated**: No manual deployment required
- **Versioned**: Each main branch push creates a new deployment
- **Fast**: Uses caching and optimized build processes
- **Secure**: Implements proper GitHub security practices
- **Reliable**: Includes proper error handling and concurrency controls

The deployment will automatically trigger whenever changes are made to the ui-kit-mantine package, ensuring the documentation stays up-to-date with the latest component changes.
