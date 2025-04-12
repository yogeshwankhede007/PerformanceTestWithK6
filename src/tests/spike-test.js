import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { tag, group } from 'k6';
import { baseConfig } from '../config/base-config.js';
import { logger } from '../utils/logger.js';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Rate('response_time_ok');
const spikeHandling = new Rate('spike_handling_ok');

// Spike Test Configuration with Parallel Scenarios
export const options = {
  scenarios: {
    // Scenario 1: User Management API Spike
    user_management_spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1 },     // Initial load
        { duration: '2m', target: 1 },     // Baseline measurement
        { duration: '1m', target: 5 },     // Small spike
        { duration: '2m', target: 5 },     // Measure stability
        { duration: '1m', target: 10 },    // Medium spike
        { duration: '2m', target: 10 },    // Measure stability
        { duration: '1m', target: 15 },    // High spike
        { duration: '2m', target: 15 },    // Measure stability
        { duration: '1m', target: 1 },     // Return to normal
        { duration: '1m', target: 0 },     // Ramp-down
      ],
      gracefulRampDown: '30s',
      exec: 'userManagementTest',
    },

    // Scenario 2: Authentication API Spike
    auth_spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1 },     // Initial load
        { duration: '2m', target: 1 },     // Baseline measurement
        { duration: '1m', target: 3 },     // Small spike
        { duration: '2m', target: 3 },     // Measure stability
        { duration: '1m', target: 5 },     // Medium spike
        { duration: '2m', target: 5 },     // Measure stability
        { duration: '1m', target: 8 },     // High spike
        { duration: '2m', target: 8 },     // Measure stability
        { duration: '1m', target: 1 },     // Return to normal
        { duration: '1m', target: 0 },     // Ramp-down
      ],
      gracefulRampDown: '30s',
      exec: 'authTest',
    },

    // Scenario 3: Mixed API Spike
    mixed_spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1 },     // Initial load
        { duration: '2m', target: 1 },     // Baseline measurement
        { duration: '1m', target: 4 },     // Small spike
        { duration: '2m', target: 4 },     // Measure stability
        { duration: '1m', target: 7 },     // Medium spike
        { duration: '2m', target: 7 },     // Measure stability
        { duration: '1m', target: 10 },    // High spike
        { duration: '2m', target: 10 },    // Measure stability
        { duration: '1m', target: 1 },     // Return to normal
        { duration: '1m', target: 0 },     // Ramp-down
      ],
      gracefulRampDown: '30s',
      exec: 'mixedTest',
    },
  },
  thresholds: {
    // Base metrics from config
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.1'],
    // Custom metrics
    errors: ['rate<0.3'],
    response_time_ok: ['rate>0.7'],
    spike_handling_ok: ['rate>0.8'],
  },
};

// Test data
const testData = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

// User Management API Test Function
export function userManagementTest() {
  tag('type', 'spike');
  tag('environment', __ENV.ENVIRONMENT || 'staging');
  tag('component', 'api');
  tag('priority', 'high');
  tag('service', 'reqres-api');
  tag('test-scope', 'extreme');
  tag('duration', 'medium');
  tag('scenario', 'user-management');
  
  logger.info(`Starting user management spike test iteration for VU ${__VU}`);

  let responses = [];

  group('User Management API', function() {
    // List Users
    group('List Users', function() {
      const listUsersResponse = http.get(`${__ENV.BASE_URL}/users?page=2`);
      if (listUsersResponse && typeof listUsersResponse === 'object') {
        check(listUsersResponse, {
          'list users status is 200': (r) => r.status === 200,
          'list users response time < 1000ms': (r) => r.timings.duration < 1000,
        });
        logger.debug(`List Users Response Time: ${listUsersResponse.timings.duration}ms`);
        responses.push(listUsersResponse);
      }
    });

    // Get Single User
    group('Get Single User', function() {
      const singleUserResponse = http.get(`${__ENV.BASE_URL}/users/2`);
      if (singleUserResponse && typeof singleUserResponse === 'object') {
        check(singleUserResponse, {
          'single user status is 200': (r) => r.status === 200,
          'single user response time < 1000ms': (r) => r.timings.duration < 1000,
        });
        logger.debug(`Single User Response Time: ${singleUserResponse.timings.duration}ms`);
        responses.push(singleUserResponse);
      }
    });
  });

  // Record metrics for all responses
  responses.forEach(response => {
    if (response && typeof response === 'object') {
      errorRate.add(response.status !== 200 && response.status !== 201);
      responseTime.add(response.timings.duration < 1000);
      spikeHandling.add(response.status === 200 || response.status === 201);
    }
  });

  sleep(0.5);
}

// Authentication API Test Function
export function authTest() {
  tag('type', 'spike');
  tag('environment', __ENV.ENVIRONMENT || 'staging');
  tag('component', 'api');
  tag('priority', 'high');
  tag('service', 'reqres-api');
  tag('test-scope', 'extreme');
  tag('duration', 'medium');
  tag('scenario', 'authentication');
  
  logger.info(`Starting authentication spike test iteration for VU ${__VU}`);

  let responses = [];

  group('Authentication API', function() {
    // Login
    group('Login', function() {
      const loginResponse = http.post(
        `${__ENV.BASE_URL}/login`,
        JSON.stringify(testData),
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (loginResponse && typeof loginResponse === 'object') {
        check(loginResponse, {
          'login status is 200': (r) => r.status === 200,
          'login response time < 1000ms': (r) => r.timings.duration < 1000,
        });
        logger.debug(`Login Response Time: ${loginResponse.timings.duration}ms`);
        responses.push(loginResponse);
      }
    });
  });

  // Record metrics for all responses
  responses.forEach(response => {
    if (response && typeof response === 'object') {
      errorRate.add(response.status !== 200 && response.status !== 201);
      responseTime.add(response.timings.duration < 1000);
      spikeHandling.add(response.status === 200 || response.status === 201);
    }
  });

  sleep(0.5);
}

// Mixed API Test Function
export function mixedTest() {
  tag('type', 'spike');
  tag('environment', __ENV.ENVIRONMENT || 'staging');
  tag('component', 'api');
  tag('priority', 'high');
  tag('service', 'reqres-api');
  tag('test-scope', 'extreme');
  tag('duration', 'medium');
  tag('scenario', 'mixed');
  
  logger.info(`Starting mixed spike test iteration for VU ${__VU}`);

  let responses = [];

  // Randomly choose between user management and auth operations
  if (Math.random() > 0.5) {
    group('User Management API', function() {
      // List Users
      group('List Users', function() {
        const listUsersResponse = http.get(`${__ENV.BASE_URL}/users?page=2`);
        if (listUsersResponse && typeof listUsersResponse === 'object') {
          check(listUsersResponse, {
            'list users status is 200': (r) => r.status === 200,
            'list users response time < 1000ms': (r) => r.timings.duration < 1000,
          });
          logger.debug(`List Users Response Time: ${listUsersResponse.timings.duration}ms`);
          responses.push(listUsersResponse);
        }
      });

      // Get Single User
      group('Get Single User', function() {
        const singleUserResponse = http.get(`${__ENV.BASE_URL}/users/2`);
        if (singleUserResponse && typeof singleUserResponse === 'object') {
          check(singleUserResponse, {
            'single user status is 200': (r) => r.status === 200,
            'single user response time < 1000ms': (r) => r.timings.duration < 1000,
          });
          logger.debug(`Single User Response Time: ${singleUserResponse.timings.duration}ms`);
          responses.push(singleUserResponse);
        }
      });
    });
  } else {
    group('Authentication API', function() {
      // Login
      group('Login', function() {
        const loginResponse = http.post(
          `${__ENV.BASE_URL}/login`,
          JSON.stringify(testData),
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (loginResponse && typeof loginResponse === 'object') {
          check(loginResponse, {
            'login status is 200': (r) => r.status === 200,
            'login response time < 1000ms': (r) => r.timings.duration < 1000,
          });
          logger.debug(`Login Response Time: ${loginResponse.timings.duration}ms`);
          responses.push(loginResponse);
        }
      });
    });
  }

  // Record metrics for all responses
  responses.forEach(response => {
    if (response && typeof response === 'object') {
      errorRate.add(response.status !== 200 && response.status !== 201);
      responseTime.add(response.timings.duration < 1000);
      spikeHandling.add(response.status === 200 || response.status === 201);
    }
  });

  sleep(0.5);
}

// Default export for backward compatibility
export default function() {
  mixedTest();
} 