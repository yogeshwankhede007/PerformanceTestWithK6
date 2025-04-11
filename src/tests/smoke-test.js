import http from 'k6/http';
import { check, sleep } from 'k6';
import { baseConfig } from '../config/base-config.js';
import { logger } from '../utils/logger.js';

// Smoke Test Configuration
export const options = {
  ...baseConfig.options,
  scenarios: {
    smoke_test: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '1m',
    },
  },
  thresholds: {
    ...baseConfig.metrics,
    http_req_duration: ['p(95)<200'], // Stricter threshold for smoke test
  },
};

// Test data
const testData = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

// Test scenario
export default function () {
  logger.info('Starting smoke test...');

  // List Users
  const listUsersResponse = http.get(`${__ENV.BASE_URL}/users?page=1`);
  check(listUsersResponse, {
    'list users status is 200': (r) => r.status === 200,
    'list users response time < 200ms': (r) => r.timings.duration < 200,
  });
  logger.info(`List Users Response: ${listUsersResponse.status}`);

  // Get Single User
  const singleUserResponse = http.get(`${__ENV.BASE_URL}/users/1`);
  check(singleUserResponse, {
    'single user status is 200': (r) => r.status === 200,
    'single user response time < 200ms': (r) => r.timings.duration < 200,
  });
  logger.info(`Single User Response: ${singleUserResponse.status}`);

  // Login
  const loginResponse = http.post(
    `${__ENV.BASE_URL}/login`,
    JSON.stringify(testData),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 200ms': (r) => r.timings.duration < 200,
  });
  logger.info(`Login Response: ${loginResponse.status}`);

  // Error handling
  if (listUsersResponse.status !== 200 || 
      singleUserResponse.status !== 200 || 
      loginResponse.status !== 200) {
    logger.error('Smoke test failed!');
    throw new Error('Smoke test failed - one or more requests failed');
  }

  logger.info('Smoke test completed successfully');
} 