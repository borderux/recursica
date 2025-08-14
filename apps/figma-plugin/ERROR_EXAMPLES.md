# Error Handling Examples for Recursica Figma Plugin

This document outlines the various types of errors that can occur during the publishing process and how they are handled.

## Expected Errors (Not Shown to User)

These errors are considered normal and are handled gracefully without showing error messages to the user:

### 404 Errors

- **Missing files**: When `recursica.json`, `adapter.js`, or other configuration files don't exist
- **Missing repositories**: When a repository doesn't exist or is private
- **File not found**: When trying to access files that don't exist in the repository

### 409 Conflicts

- **Existing Pull Requests**: When a PR/MR already exists for the same branch
- **Branch conflicts**: When trying to create a branch that already exists

### 422 Validation Errors

- **Invalid request data**: When the API request format is incorrect
- **Validation failures**: When the repository platform rejects the request format

## Unexpected Errors (Shown to User)

These errors are unexpected and will be displayed to the user in the error step:

### Authentication Errors (401)

```
Error: Authentication failed. Please check your access token.
Details: The provided access token is invalid or has expired
Code: USER_INFO_FETCH_ERROR
```

### Permission Errors (403)

```
Error: Access denied. You may not have permission to access this repository.
Details: The access token doesn't have sufficient permissions
Code: PROJECTS_FETCH_ERROR
```

### Rate Limiting (429)

```
Error: Rate limit exceeded. Please try again later.
Details: Too many requests to the API in a short time period
Code: PUBLISH_FILES_ERROR
```

**Note**: The plugin now automatically handles rate limiting by batching file commits and adding delays between batches. This error should rarely occur in normal operation.

### Server Errors (500, 503)

```
Error: Server error. Please try again later.
Details: The repository platform is experiencing issues
Code: PUBLISH_FILES_ERROR
```

### Network Errors

```
Error: Network connection error. Please check your internet connection.
Details: Unable to connect to the repository platform
Code: USER_INFO_FETCH_ERROR
```

### Timeout Errors

```
Error: Request timed out. Please try again.
Details: The request took too long to complete
Code: PUBLISH_FILES_ERROR
```

### Worker Execution Errors

```
Error: Worker execution failed: SyntaxError in adapter.js
Details: The adapter file contains invalid JavaScript code
Code: PUBLISH_FILES_ERROR
```

### Configuration Errors

```
Error: No project selected
Details: Please select a project before publishing files
Code: NO_PROJECT_SELECTED
```

```
Error: Repository not initialized
Details: Please check your repository connection
Code: REPOSITORY_NOT_INITIALIZED
```

## Error Handling Flow

1. **Error Detection**: Errors are caught in try-catch blocks throughout the application
2. **Error Classification**: The `isExpectedError()` function determines if an error should be shown to the user
3. **Error Formatting**: The `getErrorMessage()` function converts technical errors into user-friendly messages
4. **Error Display**: Errors are stored in the `error` state and displayed in the error step
5. **Error Recovery**: Users can clear errors and retry operations

## Common Error Scenarios

### Scenario 1: Invalid Access Token

- User provides an expired or invalid GitHub/GitLab token
- Plugin tries to fetch user info and gets 401 error
- Error is displayed: "Authentication failed. Please check your access token."

### Scenario 2: Network Issues

- User has poor internet connection
- Plugin can't reach GitHub/GitLab API
- Error is displayed: "Network connection error. Please check your internet connection."

### Scenario 3: Rate Limiting

- User makes too many requests in a short time
- GitHub/GitLab API returns 429 error
- Error is displayed: "Rate limit exceeded. Please try again later."
- **Note**: The plugin now automatically prevents this by batching commits and adding delays

### Scenario 4: Permission Issues

- User's token doesn't have write access to the repository
- Plugin gets 403 error when trying to commit files
- Error is displayed: "Access denied. You may not have permission to access this repository."

### Scenario 5: Invalid Adapter Code

- The `adapter.js` file contains syntax errors
- Worker fails to execute the adapter
- Error is displayed: "Worker execution failed: [specific error message]"

### Scenario 6: Missing Configuration

- User tries to publish without selecting a project
- Plugin detects no project is selected
- Error is displayed: "No project selected. Please select a project before publishing files."

## Error Recovery Actions

Users can recover from errors by:

1. **Going Back**: Clicking the "Back" button to return to the project selection step
2. **Retrying**: Selecting a project and trying the publish operation again
3. **Checking Configuration**: Verifying their access token and repository permissions
4. **Reporting Issues**: Using the "Send bug" button to report unexpected errors

## Error Logging

All errors are logged to the console for debugging purposes, even if they're not shown to the user. This helps with troubleshooting and development.
