'use server';

import { cookies } from "next/headers";

/**
 * Authenticated fetch wrapper that includes session cookies
 * @param url - The full URL to fetch
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const connectSid = cookieStore.get('connect.sid');
  
  // Debug: List all cookies
  const allCookies = cookieStore.getAll();
  console.log('🍪 Available cookies:', allCookies.map(c => c.name));
  
  if (!connectSid) {
    console.error('❌ No connect.sid cookie found');
    throw new Error('Authentication required. Please login first.');
  }

  const cookieString = `connect.sid=${connectSid.value}`;
  
  console.log('🔑 Using session cookie');
  console.log('🌐 Making request to:', url);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Cookie': cookieString,
    },
  });

  // If we get a 401, the session is expired
  if (response.status === 401) {
    console.error('❌ Session expired or invalid. Please login again.');
    // Clear the invalid cookie
    cookieStore.delete('connect.sid');
  }

  return response;
}
