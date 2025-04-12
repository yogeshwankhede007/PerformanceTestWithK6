import http from 'k6/http';
import { check, sleep } from 'k6';
import { tag, group } from 'k6';
import { baseConfig } from '../config/base-config.js';
import { logger } from '../utils/logger.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Default configuration
const BASE_URL = __ENV.BASE_URL || 'https://reqres.in/api';

// Smoke Test Configuration
export const options = {
  scenarios: {
    smoke_test: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200'], // Stricter threshold for smoke test
    http_req_failed: ['rate<0.1'],
  },
};

// Test data
const testData = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

// Handle the end of the test
export function handleSummary(data) {
  return {
    "reports/smoke-test-report.html": htmlReport(data, {
      title: "Smoke Test Results",
      showTags: true,
    }),
  };
}

// Test scenario
export default function () {
  console.log(`Starting smoke test against ${BASE_URL}`);

  let listUsersResponse, singleUserResponse, loginResponse;

  // Group API endpoints
  group('User Management API', function() {
    // List Users
    group('List Users', function() {
      console.log('Testing List Users endpoint...');
      listUsersResponse = http.get(`${BASE_URL}/users?page=1`);
      const listUsersCheck = check(listUsersResponse, {
        'list users status is 200': (r) => r.status === 200,
        'list users response time < 200ms': (r) => r.timings.duration < 200,
        'list users has data': (r) => r.json().data !== undefined,
      });
      console.log(`List Users Response: Status=${listUsersResponse.status}, Duration=${listUsersResponse.timings.duration}ms`);
      if (!listUsersCheck) {
        console.error('List Users checks failed:', listUsersResponse.body);
      }
    });

    // Get Single User
    group('Get Single User', function() {
      console.log('Testing Get Single User endpoint...');
      singleUserResponse = http.get(`${BASE_URL}/users/1`);
      const singleUserCheck = check(singleUserResponse, {
        'single user status is 200': (r) => r.status === 200,
        'single user response time < 200ms': (r) => r.timings.duration < 200,
        'single user has correct data': (r) => r.json().data !== undefined,
      });
      console.log(`Single User Response: Status=${singleUserResponse.status}, Duration=${singleUserResponse.timings.duration}ms`);
      if (!singleUserCheck) {
        console.error('Single User checks failed:', singleUserResponse.body);
      }
    });
  });

  // Authentication API
  group('Authentication API', function() {
    // Login
    group('Login', function() {
      console.log('Testing Login endpoint...');
      loginResponse = http.post(
        `${BASE_URL}/login`,
        JSON.stringify(testData),
        { headers: { 'Content-Type': 'application/json' } }
      );
      const loginCheck = check(loginResponse, {
        'login status is 200': (r) => r.status === 200,
        'login response time < 200ms': (r) => r.timings.duration < 200,
        'login returns token': (r) => r.json().token !== undefined,
      });
      console.log(`Login Response: Status=${loginResponse.status}, Duration=${loginResponse.timings.duration}ms`);
      if (!loginCheck) {
        console.error('Login checks failed:', loginResponse.body);
      }
    });
  });

  // Overall test validation
  if (listUsersResponse.status !== 200 || 
      singleUserResponse.status !== 200 || 
      loginResponse.status !== 200) {
    console.error('Smoke test failed - one or more requests failed');
    throw new Error('Smoke test failed - one or more requests failed');
  }

  console.log('Smoke test completed successfully');
} 