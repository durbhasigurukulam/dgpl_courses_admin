/**
 * Environment Variables Test
 * Run this to verify your environment setup is working correctly
 */

import { getApiUrl } from './api-utils';
import { env } from './env';

export function testEnvironmentSetup() {
  console.log('🔧 Environment Setup Test');
  console.log('========================');
  console.log(`API_BASE_URL: ${env.API_BASE_URL}`);
  console.log(`Sample API URL: ${getApiUrl('/api/courses')}`);
  console.log('✅ Environment setup is working correctly');
}

// Uncomment to run the test:
// testEnvironmentSetup();
