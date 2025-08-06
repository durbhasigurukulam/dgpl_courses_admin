import { env } from "./env";

/**
 * Constructs a full API URL from an endpoint
 * @param endpoint - The API endpoint (e.g., '/api/courses' or 'api/courses')
 * @returns The full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  return `${env.API_BASE_URL}${normalizedEndpoint}`;
}

/**
 * API endpoints constants for better maintainability
 */
export const API_ENDPOINTS = {
  COURSES: '/api/courses',
  TESTIMONIALS: '/api/testimonials',
  FILES: '/api/files',
  AUTH: {
    LOGIN: '/api/auth/login',
  }
} as const;
