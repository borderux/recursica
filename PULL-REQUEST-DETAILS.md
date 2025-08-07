# Rate Limiting Implementation for File Commits

## Overview

This pull request implements automatic rate limiting for file commits to prevent hitting GitHub and GitLab API rate limits when committing large numbers of files in a short time period.

## Problem

Previously, when users tried to commit many files (hundreds or thousands) in a single operation, the plugin would hit GitHub's rate limits, resulting in 429 errors and failed commits. This was particularly problematic for users with large design systems or many generated files.

## Solution

Implemented a comprehensive rate limiting system that:

1. **Batches file commits**: Splits large file sets into batches of 50 files each
2. **Enforces rate limits**: Limits to 50 commits per minute with automatic waiting
3. **Adds delays between batches**: Waits 60 seconds between each batch to ensure compliance
4. **Works across platforms**: Supports both GitHub and GitLab repositories
5. **Maintains data integrity**: All files are eventually committed successfully

## Key Changes

### New Files

- `apps/figma-plugin/src/services/repository/rateLimiter.ts` - Rate limiting utility class

### Modified Files

- `apps/figma-plugin/src/services/repository/GitHubRepository.ts` - Added rate limiting to commit logic
- `apps/figma-plugin/src/services/repository/GitLabRepository.ts` - Added rate limiting to commit logic
- `apps/figma-plugin/ERROR_EXAMPLES.md` - Updated documentation to reflect automatic rate limiting

## Technical Implementation

### Rate Limiter Class

- Tracks commit count within rolling time windows
- Automatically resets counters after time intervals
- Provides methods for checking limits and waiting for resets
- Includes debugging status information

### Commit Batching

- Files are automatically split into batches of 50 files
- Each batch is committed as a separate Git commit
- Commit messages include batch information for traceability
- Maintains proper Git tree structure across batches

### Rate Limit Enforcement

- 50 commits maximum per minute
- 60-second wait between batches
- Automatic waiting when limits are reached
- Console logging for debugging and progress tracking

## Benefits

- **Prevents rate limit errors**: No more 429 errors during large commits
- **Transparent to users**: Batching happens automatically without user intervention
- **Reliable operation**: All files are committed successfully, just with delays
- **Cross-platform support**: Works for both GitHub and GitLab
- **Backward compatible**: No changes required to existing API or UI

## Testing

- TypeScript compilation passes without errors
- ESLint passes with no style violations
- Build process completes successfully
- Rate limiting logic has been tested with various file counts

## Impact

This change significantly improves the reliability of the plugin when working with large repositories or many generated files, eliminating a common source of user frustration and failed operations.
