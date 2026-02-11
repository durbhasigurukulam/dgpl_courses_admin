// lib/client-api.ts

/**
 * Client-side API utility for making authenticated requests
 * Uses the same cookie-based authentication as the backend
 */

export async function clientAuthenticatedFetch(url: string, options: RequestInit = {}) {
  // For same-origin requests, cookies are automatically included
  // Make sure credentials are included for cross-origin requests if needed
  const response = await fetch(url, {
    ...options,
    credentials: 'include',  // Include cookies in requests
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  return response;
}