// plugins/api-config.client.js
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Determine the correct API URL based on environment
  const getApiUrl = () => {
    // Check if we're in browser
    if (process.client) {
      const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        // Use HTTP for local development
        return 'http://localhost:8000/api';
      }
    }

    // Use production URL from env or relative path
    return config.public.serverApiUrl || '/api';
  };

  const apiUrl = getApiUrl();

  // Log the API URL for debugging
  console.log('🔧 API Base URL:', apiUrl);

  // Create a custom fetch function
  const apiFetch = (endpoint, options = {}) => {
    const fullUrl = endpoint.startsWith('http')
      ? endpoint
      : `${apiUrl}${endpoint}`;

    return $fetch(fullUrl, options);
  };

  // Provide the API utilities
  return {
    provide: {
      apiBaseUrl: apiUrl,
      apiFetch: apiFetch,
      api: {
        get: (endpoint, params) => {
          const url = new URL(endpoint, apiUrl);
          if (params) {
            Object.keys(params).forEach(key => {
              url.searchParams.append(key, params[key]);
            });
          }
          return apiFetch(url.pathname + url.search);
        },
        post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body }),
        put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body }),
        patch: (endpoint, body) => apiFetch(endpoint, { method: 'PATCH', body }),
        del: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
      }
    }
  };
});
