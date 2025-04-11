import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { baseConfig } from '../config/base-config.js';
import { logger } from '../utils/logger.js';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Rate('response_time_ok');
const throughput = new Rate('throughput');

// Stress Test Configuration
export const options = {
  ...baseConfig.options,
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },   // Ramp-up to 50 users
        { duration: '2m', target: 50 },   // Stay at 50 users
        { duration: '1m', target: 100 },  // Ramp-up to 100 users
        { duration: '2m', target: 100 },  // Stay at 100 users
        { duration: '1m', target: 200 },  // Ramp-up to 200 users
        { duration: '2m', target: 200 },  // Stay at 200 users
        { duration: '1m', target: 0 },    // Ramp-down to 0 users
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    ...baseConfig.metrics,
    errors: ['rate<0.2'],  // Higher error rate threshold for stress test
    response_time_ok: ['rate>0.8'],  // Lower response time threshold for stress test
    throughput: ['rate>50'],  // Minimum throughput requirement
  },
};

// Test data
const testData = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

// Test scenario
export default function () {
  logger.info(`Starting stress test iteration for VU ${__VU}`);

  // List Users
  const listUsersResponse = http.get(`${__ENV.BASE_URL}/users?page=2`);
  check(listUsersResponse, {
    'list users status is 200': (r) => r.status === 200,
    'list users response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  logger.debug(`List Users Response Time: ${listUsersResponse.timings.duration}ms`);

  // Get Single User
  const singleUserResponse = http.get(`${__ENV.BASE_URL}/users/2`);
  check(singleUserResponse, {
    'single user status is 200': (r) => r.status === 200,
    'single user response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  logger.debug(`Single User Response Time: ${singleUserResponse.timings.duration}ms`);

  // Create User
  const createUserResponse = http.post(
    `${__ENV.BASE_URL}/users`,
    JSON.stringify({
      name: 'morpheus',
      job: 'leader'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(createUserResponse, {
    'create user status is 201': (r) => r.status === 201,
    'create user response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  logger.debug(`Create User Response Time: ${createUserResponse.timings.duration}ms`);

  // Update User
  const updateUserResponse = http.put(
    `${__ENV.BASE_URL}/users/2`,
    JSON.stringify({
      name: 'morpheus',
      job: 'zion resident'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(updateUserResponse, {
    'update user status is 200': (r) => r.status === 200,
    'update user response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  logger.debug(`Update User Response Time: ${updateUserResponse.timings.duration}ms`);

  // Login
  const loginResponse = http.post(
    `${__ENV.BASE_URL}/login`,
    JSON.stringify(testData),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  logger.debug(`Login Response Time: ${loginResponse.timings.duration}ms`);

  // Record metrics
  const responses = [
    listUsersResponse,
    singleUserResponse,
    createUserResponse,
    updateUserResponse,
    loginResponse
  ];

  responses.forEach(response => {
    errorRate.add(response.status !== 200 && response.status !== 201);
    responseTime.add(response.timings.duration < 1000);
    throughput.add(true);
  });

  // Minimal think time for stress test
  sleep(0.5);
} 