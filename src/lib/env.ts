/**
 * Environment configuration
 */

export const env = {
  API_BASE_URL: process.env.API_BASE_URL || '',
} as const;

export default env;
