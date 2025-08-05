# Figma Plugin Release Enhancement

## Overview

This PR enhances the figma-plugin release process to improve version tracking and release visibility in the server repository. The changes ensure that figma-plugin releases are properly identified by version number rather than just commit hashes.

## Changes Made

### 1. Enhanced Deploy-to-Server Action (`.github/actions/deploy-to-server/action.yml`)

- **Added new input parameter**: `plugin_version` (optional) for version-based release naming
- **Updated release naming logic**:
  - When `plugin_version` is provided: Tag becomes `figma-plugin-v{version}`, title becomes `Figma Plugin Release - v{version}`
  - Fallback behavior: Uses commit SHA for releases without version info
- **Improved release notes**: Moved commit SHA to release body along with source repository and environment context
- **Maintained backward compatibility**: All existing functionality preserved

### 2. Updated Release Workflow (`.github/workflows/release.yml`)

- **Enhanced version detection**: Added `figma-plugin-version` output to the existing version check step
- **Streamlined deployment**: Removed redundant version extraction step by using the version already detected
- **Improved parameter passing**: Now passes the detected plugin version to the deploy action

## Technical Details

### Release Format Example

When figma-plugin version 1.2.3 is released:

- **Tag**: `figma-plugin-v1.2.3`
- **Title**: `Figma Plugin Release - v1.2.3`
- **Notes**:

  ```
  Commit SHA: `abc123def456`

  Source Repository: borderux/recursica
  Environment: prod
  ```

### Benefits

1. **Better version tracking**: Releases are easily identifiable by version number
2. **Improved traceability**: Commit SHA and source context in release notes
3. **Enhanced user experience**: Clear, meaningful release names in server repository
4. **Maintained compatibility**: Existing workflows continue to work unchanged

## Testing

- The changes maintain backward compatibility with existing release processes
- Version detection logic has been tested to handle edge cases (missing versions, unchanged versions)
- Release naming logic includes fallback behavior for robustness

## Impact

- **Positive**: Improved release management and version tracking for figma-plugin
- **No breaking changes**: All existing functionality preserved
- **Enhanced observability**: Better release identification and traceability

## Files Modified

- `.github/actions/deploy-to-server/action.yml` - Enhanced with version-based release naming
- `.github/workflows/release.yml` - Updated to pass plugin version to deploy action
