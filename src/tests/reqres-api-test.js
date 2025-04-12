import http from 'k6/http';
import { check, sleep } from 'k6';
import { group } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Rate('response_time_ok');

// Test configuration
export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% of requests should be below 2000ms
    http_req_failed: ['rate<0.01'],     // Less than 1% of requests should fail
    'errors': ['rate<0.1'],             // Error rate should be below 10%
    'response_time_ok': ['rate>0.95'],  // 95% of responses should be within threshold
  },
};

// Base URL
const BASE_URL = __ENV.BASE_URL || 'https://reqres.in/api';

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
export default function() {
  // Initialize response variables
  let listUsersResponse, singleUserResponse, createUserResponse, updateUserResponse, deleteUserResponse, loginResponse;

  group('User Management', function() {
    // List Users
    listUsersResponse = http.get(`${BASE_URL}/users?page=2`);
    check(listUsersResponse, {
      'list users status is 200': (r) => r.status === 200,
      'list users has data': (r) => r.json().data !== undefined,
    });
    console.log(`List Users Response: Status=${listUsersResponse.status}, Duration=${listUsersResponse.timings.duration}ms`);

    // Single User
    singleUserResponse = http.get(`${BASE_URL}/users/2`);
    check(singleUserResponse, {
      'single user status is 200': (r) => r.status === 200,
      'single user has correct data': (r) => r.json().data !== undefined,
    });
    console.log(`Single User Response: Status=${singleUserResponse.status}, Duration=${singleUserResponse.timings.duration}ms`);

    // Create User
    createUserResponse = http.post(
      `${BASE_URL}/users`,
      JSON.stringify(testUser),
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(createUserResponse, {
      'create user status is 201': (r) => r.status === 201,
      'create user response time < 500ms': (r) => r.timings.duration < 500,
    });
    console.log(`Create User Response: Status=${createUserResponse.status}, Duration=${createUserResponse.timings.duration}ms`);

    // Update User
    updateUserResponse = http.put(
      `${BASE_URL}/users/2`,
      JSON.stringify(generateUserData()),
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(updateUserResponse, {
      'update user status is 200': (r) => r.status === 200,
      'update user response time < 500ms': (r) => r.timings.duration < 500,
    });
    console.log(`Update User Response: Status=${updateUserResponse.status}, Duration=${updateUserResponse.timings.duration}ms`);

    // Delete User
    deleteUserResponse = http.del(`${BASE_URL}/users/2`);
    check(deleteUserResponse, {
      'delete user status is 204': (r) => r.status === 204,
      'delete user response time < 500ms': (r) => r.timings.duration < 500,
    });
    console.log(`Delete User Response: Status=${deleteUserResponse.status}, Duration=${deleteUserResponse.timings.duration}ms`);
  });

  group('Authentication', function() {
    // Login
    loginResponse = http.post(
      `${BASE_URL}/login`,
      JSON.stringify({
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(loginResponse, {
      'login status is 200': (r) => r.status === 200,
      'login returns token': (r) => r.json().token !== undefined,
    });
    console.log(`Login Response: Status=${loginResponse.status}, Duration=${loginResponse.timings.duration}ms`);
  });

  // Record errors and response times for all requests
  const allResponses = [
    listUsersResponse,
    singleUserResponse,
    createUserResponse,
    updateUserResponse,
    deleteUserResponse,
    loginResponse
  ];

  allResponses.forEach(response => {
    errorRate.add(response.status !== 200 && response.status !== 201 && response.status !== 204);
    responseTime.add(response.timings.duration < 500);
  });

  // Think time between iterations
  sleep(1);
}

// Generate HTML report
export function handleSummary(data) {
  return {
    "reports/reqres-api-test-report.html": htmlReport(data, {
      title: "ReqRes API Test Results",
      showTags: true,
    }),
  };
} 