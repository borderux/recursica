# Publish Authentication and Access Control

## Overview

Add authentication and GitHub repository access verification to the publish flow. Users must authenticate and have write access to `mlmassey/recursica-figma` before they can publish.

## Implementation Steps

### 1. Create GitHub Repository Access Check Method

- **File**: `apps/figma-plugin/src/services/repository/GitHubRepository.ts`
- Add method `checkRepositoryAccess(owner: string, repo: string): Promise<boolean>` that:
  - Uses GitHub API to check if user has write/push permissions
  - Can use `GET /repos/{owner}/{repo}` endpoint and check `permissions.push` field
  - Returns `true` if user has write access, `false` otherwise

### 2. Create Publish Auth Component

- **File**: `apps/figma-plugin/src/pages/PublishChanges/steps/PublishAuth.tsx` (new file)
- Create auth component similar to `apps/recursica-publisher/src/pages/Auth.tsx`:
  - Handle OAuth flow with GitHub
  - Use existing `apiService` from `apps/figma-plugin/src/services/auth`
  - After successful auth, check access to `mlmassey/recursica-figma`
  - Navigate to `/publish/home` if access granted
  - Navigate to `/publish/unauthorized` if access denied

### 3. Create Unauthorized Error Page

- **File**: `apps/figma-plugin/src/pages/PublishChanges/steps/Unauthorized.tsx` (new file)
- Display error message: "You are not authorized to publish to the recursica Figma component library"
- Include back button to navigate to previous page

### 4. Update PublishChanges Routing

- **File**: `apps/figma-plugin/src/pages/PublishChanges/PublishChanges.tsx`
- Add new route: `/publish/auth` for `PublishAuth` component
- Add new route: `/publish/unauthorized` for `Unauthorized` component
- Add route guard logic to check authentication before allowing access to `/publish/home`
- If not authenticated, redirect to `/publish/auth`

### 5. Update Publish Component

- **File**: `apps/figma-plugin/src/pages/PublishChanges/steps/Publish.tsx`
- Add authentication check on mount
- If not authenticated, redirect to `/publish/auth` instead of showing publish UI

### 6. Export New Components

- **File**: `apps/figma-plugin/src/pages/PublishChanges/steps/index.ts`
- Export `PublishAuth` and `Unauthorized` components

## Key Implementation Details

- **Repository to check**: `mlmassey/recursica-figma`
- **Access requirement**: Write/push permissions (ability to commit and push)
- **Auth flow**: Similar to recursica-publisher Auth, but integrated into publish flow
- **Error message**: "You are not authorized to publish to the recursica Figma component library"

## Files to Modify

1. `apps/figma-plugin/src/services/repository/GitHubRepository.ts` - Add access check method
2. `apps/figma-plugin/src/pages/PublishChanges/steps/PublishAuth.tsx` - New auth component
3. `apps/figma-plugin/src/pages/PublishChanges/steps/Unauthorized.tsx` - New error page
4. `apps/figma-plugin/src/pages/PublishChanges/PublishChanges.tsx` - Add routes and guards
5. `apps/figma-plugin/src/pages/PublishChanges/steps/Publish.tsx` - Add auth check
6. `apps/figma-plugin/src/pages/PublishChanges/steps/index.ts` - Export new components

## Implementation Todos

1. Add checkRepositoryAccess method to GitHubRepository class to verify write access to a repository
2. Create PublishAuth component similar to recursica-publisher Auth, with GitHub access check after authentication
3. Create Unauthorized error page component with message 'You are not authorized to publish to the recursica Figma component library'
4. Add /publish/auth and /publish/unauthorized routes to PublishChanges component
5. Add authentication check to Publish component to redirect to /publish/auth if not authenticated
6. Export PublishAuth and Unauthorized components from steps/index.ts
