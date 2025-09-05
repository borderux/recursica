import { useState, useCallback } from 'react';

export interface RepositoryError {
  message: string;
  details?: string;
  code?: string;
  timestamp: number;
}

export function useRepositoryError() {
  const [error, setError] = useState<RepositoryError | null>(null);

  const setRepositoryError = useCallback((message: string, details?: string, code?: string) => {
    const error: RepositoryError = {
      message,
      details,
      code,
      timestamp: Date.now(),
    };
    setError(error);
    console.error('Repository Error:', error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isExpectedError = useCallback((error: unknown): boolean => {
    if (error instanceof Error) {
      // 404 errors are expected for missing files
      if (error.message.includes('404')) return true;
      // Network errors that might be temporary
      if (error.message.includes('Network Error') || error.message.includes('fetch')) return true;
    }

    // Check for axios errors
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number } };
      const status = axiosError.response.status;
      // 404 errors are expected for missing files
      if (status === 404) return true;
      // 409 conflicts are expected for existing PRs
      if (status === 409) return true;
      // 422 validation errors might be expected in some cases
      if (status === 422) return true;
    }

    return false;
  }, []);

  const getErrorMessage = useCallback((error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: {
          status: number;
          data?: { message?: string; errors?: Array<{ message: string }> };
        };
      };
      const status = axiosError.response.status;
      switch (status) {
        case 401:
          return 'Authentication failed. Please check your access token.';
        case 403:
          return 'Access denied. You may not have permission to access this repository.';
        case 404:
          return 'Resource not found. The repository or file may not exist.';
        case 422: {
          const errorData = axiosError.response.data;
          if (errorData?.message) {
            if (errorData.message.includes('already exists')) {
              return 'The branch already exists. Using existing branch.';
            }
            return `Validation error: ${errorData.message}`;
          }
          if (errorData?.errors && errorData.errors.length > 0) {
            return `Validation errors: ${errorData.errors.map((e) => e.message).join(', ')}`;
          }
          return 'Validation error occurred.';
        }
        case 429:
          return 'Rate limit exceeded. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return axiosError.response.data?.message || `HTTP ${status} error occurred.`;
      }
    }

    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        return 'Network connection error. Please check your internet connection.';
      }
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      return error.message;
    }

    return 'An unexpected error occurred.';
  }, []);

  return {
    error,
    setRepositoryError,
    clearError,
    isExpectedError,
    getErrorMessage,
  };
}
