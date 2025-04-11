import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from 'k6-html-reporter';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Rate('response_time_ok');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp-up to 10 users
    { duration: '3m', target: 10 },  // Stay at 10 users
    { duration: '1m', target: 20 },  // Ramp-up to 20 users
    { duration: '3m', target: 20 },  // Stay at 20 users
    { duration: '1m', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'],             // Error rate should be below 10%
    response_time_ok: ['rate>0.95'],  // 95% of responses should be within threshold
  },
};

// Base URL
const BASE_URL = 'https://reqres.in/api';

// Test data
const testUser = {
  name: 'morpheus',
  job: 'leader'
};

// Helper function to generate random user data
function generateUserData() {
  return {
    name: `User ${Math.floor(Math.random() * 1000)}`,
    job: `Job ${Math.floor(Math.random() * 1000)}`
  };
}

// Test scenario
export default function () {
  // List Users
  const listUsersResponse = http.get(`${BASE_URL}/users?page=2`);
  check(listUsersResponse, {
    'list users status is 200': (r) => r.status === 200,
    'list users response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Get Single User
  const singleUserResponse = http.get(`${BASE_URL}/users/2`);
  check(singleUserResponse, {
    'single user status is 200': (r) => r.status === 200,
    'single user response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Create User
  const createUserResponse = http.post(
    `${BASE_URL}/users`,
    JSON.stringify(testUser),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(createUserResponse, {
    'create user status is 201': (r) => r.status === 201,
    'create user response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Update User
  const updateUserResponse = http.put(
    `${BASE_URL}/users/2`,
    JSON.stringify(generateUserData()),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(updateUserResponse, {
    'update user status is 200': (r) => r.status === 200,
    'update user response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Delete User
  const deleteUserResponse = http.del(`${BASE_URL}/users/2`);
  check(deleteUserResponse, {
    'delete user status is 204': (r) => r.status === 204,
    'delete user response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Register User
  const registerResponse = http.post(
    `${BASE_URL}/register`,
    JSON.stringify({
      email: 'eve.holt@reqres.in',
      password: 'pistol'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(registerResponse, {
    'register status is 200': (r) => r.status === 200,
    'register response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Login
  const loginResponse = http.post(
    `${BASE_URL}/login`,
    JSON.stringify({
      email: 'eve.holt@reqres.in',
      password: 'cityslicka'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Record errors
  const allResponses = [
    listUsersResponse,
    singleUserResponse,
    createUserResponse,
    updateUserResponse,
    deleteUserResponse,
    registerResponse,
    loginResponse
  ];

  allResponses.forEach(response => {
    errorRate.add(response.status !== 200 && response.status !== 201 && response.status !== 204);
    responseTime.add(response.timings.duration < 500);
  });

  // Think time between requests
  sleep(1);
}

// Generate HTML report
export function handleSummary(data) {
  return {
    'reports/reqres-api-test.html': htmlReport(data),
  };
} 