
/**
 * Authenticated fetch wrapper that includes session cookies
 * @param url - The full URL to fetch
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  // Client-side fetch automatically sends cookies if credentials: 'include' is set
  // and the browser has the cookies for the domain.
  // Note: HTTP-only cookies cannot be read by JS, but are sent by the browser.

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Ensure cookies are sent
  });

  // If we get a 401, the session is expired
  if (response.status === 401) {
    console.error('❌ Session expired or invalid. Please login again.');
    // Client-side redirect could happen here if needed
  }

  return response;
}

