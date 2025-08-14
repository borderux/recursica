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

- **Generic and reusable**: Can be used for any batched operation, not just Git commits
- **Simple configuration**: Just `batchSize` and `delayBetweenBatches` with sensible defaults (50 items, 60 seconds)
- **Automatic batching**: Handles all batching logic internally through the `processBatched` method
- **Comprehensive documentation**: Full JSDoc with examples and parameter descriptions
- **Type-safe**: Generic types for items and results

### Commit Batching

- **Centralized logic**: All batching is handled within the RateLimiter class
- **Automatic processing**: Repository implementations just provide a processor function
- **Flexible callbacks**: Optional hooks for batch start/completion events
- **Clean separation**: Repository code focuses on Git operations, not rate limiting

### Rate Limit Enforcement

- **Configurable limits**: 50 operations per minute (configurable)
- **Automatic delays**: 60-second delays between batches (configurable)
- **Smart waiting**: Automatically waits when rate limits are reached
- **Progress tracking**: Comprehensive logging and status information

## Benefits

- **Prevents rate limit errors**: No more 429 errors during large commits
- **Transparent to users**: Batching happens automatically without user intervention
- **Reliable operation**: All files are committed successfully, just with delays
- **Cross-platform support**: Works for both GitHub and GitLab
- **Backward compatible**: No changes required to existing API or UI

## Architecture Improvements

### Before (Scattered Logic)

- Rate limiting logic was duplicated across GitHub and GitLab repositories
- Batching logic was implemented in each repository class
- Hard-coded values for batch sizes and delays
- Manual waiting and progress tracking in each implementation

### After (Centralized Design)

- **Single responsibility**: RateLimiter class handles all rate limiting and batching
- **Configuration-driven**: All parameters are configurable through constructor
- **Generic and reusable**: Can be used for any rate-limited operation
- **Clean separation**: Repository classes focus only on Git operations
- **Type-safe**: Generic types ensure compile-time safety

## Testing

- TypeScript compilation passes without errors
- ESLint passes with no style violations
- Build process completes successfully
- Rate limiting logic has been tested with various file counts

## Impact

This change significantly improves the reliability of the plugin when working with large repositories or many generated files, eliminating a common source of user frustration and failed operations.
