const BASE_URL = import.meta.env.VITE_RECURSICA_API_URL;

const getSecureHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
});

// API endpoints configuration
export const API_ENDPOINTS = {
  keys: `${BASE_URL}/api/plugin/keys`,
  authorize: `${BASE_URL}/api/plugin/authorize`,
  token: `${BASE_URL}/api/plugin/token`,
} as const;

// Secure fetch wrapper with built-in security headers
export const secureApiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const secureOptions: RequestInit = {
    ...options,
    headers: {
      ...getSecureHeaders(),
      ...options.headers,
    },
  };

  return fetch(endpoint, secureOptions);
};

// API service methods
export const apiService = {
  // Generate authentication keys
  generateKeys: async (userId: string) => {
    const response = await secureApiCall(API_ENDPOINTS.keys, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to generate keys');
    }

    return response.json();
  },

  // Get GitHub authorization URL
  authorize: async (
    userId: string,
    readKey: string,
    writeKey: string,
    code: string,
    provider: string
  ) => {
    const response = await secureApiCall(API_ENDPOINTS.authorize, {
      method: 'POST',
      body: JSON.stringify({ userId, readKey, writeKey, code, provider }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to get authorization URL');
    }

    return response.json();
  },

  // Poll for access token
  getToken: async (userId: string, readKey: string, code: string) => {
    const response = await secureApiCall(API_ENDPOINTS.token, {
      method: 'POST',
      body: JSON.stringify({ userId, readKey, code }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Authentication failed');
      }
      // For 202 (pending) or other statuses, return the response for handling
    }

    return response.json();
  },
};
