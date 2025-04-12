import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { tag, group } from 'k6';
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
        { duration: '2m', target: 10 },    // Initial load
        { duration: '2m', target: 10 },    // Baseline
        { duration: '2m', target: 20 },    // Increase load
        { duration: '2m', target: 20 },    // Measure stability
        { duration: '2m', target: 30 },    // Push limits
        { duration: '2m', target: 30 },    // Measure under stress
        { duration: '2m', target: 40 },    // Extreme load
        { duration: '2m', target: 40 },    // Measure breaking point
        { duration: '2m', target: 0 },     // Recovery
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.1'],
    errors: ['rate<0.2'],
    response_time_ok: ['rate>0.8'],
  },
};

// Test data
const testData = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

// Test scenario
export default function () {
  // Apply test tags
  tag('type', 'stress');
  tag('environment', __ENV.ENVIRONMENT || 'staging');
  tag('component', 'api');
  tag('priority', 'high');
  tag('service', 'reqres-api');
  tag('test-scope', 'endurance');
  
  logger.info(`Starting stress test iteration for VU ${__VU}`);

  // Group API endpoints
  group('User Management API', function() {
    // List Users
    group('List Users', function() {
      const listUsersResponse = http.get(`${__ENV.BASE_URL}/users?page=2`);
      check(listUsersResponse, {
        'list users status is 200': (r) => r.status === 200,
        'list users response time < 1000ms': (r) => r.timings.duration < 1000,
      });
      logger.debug(`List Users Response Time: ${listUsersResponse.timings.duration}ms`);
      return listUsersResponse;
    });

    // Get Single User
    group('Get Single User', function() {
      const singleUserResponse = http.get(`${__ENV.BASE_URL}/users/2`);
      check(singleUserResponse, {
        'single user status is 200': (r) => r.status === 200,
        'single user response time < 1000ms': (r) => r.timings.duration < 1000,
      });
      logger.debug(`Single User Response Time: ${singleUserResponse.timings.duration}ms`);
      return singleUserResponse;
    });

    // Create User
    group('Create User', function() {
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
      return createUserResponse;
    });

    // Update User
    group('Update User', function() {
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
      return updateUserResponse;
    });
  });

  // Authentication API
  group('Authentication API', function() {
    // Login
    group('Login', function() {
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
      return loginResponse;
    });
  });

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