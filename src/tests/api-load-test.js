import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from 'k6-html-reporter';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp-up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp-up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'],             // Error rate should be below 10%
  },
};

// Test data
const testData = {
  username: 'testuser',
  password: 'testpass',
};

// Test scenario
export default function () {
  // Login request
  const loginResponse = http.post('https://api.example.com/login', JSON.stringify(testData), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Check login response
  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Extract token from response
  const token = loginResponse.json('token');

  // Get user profile
  const profileResponse = http.get('https://api.example.com/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Check profile response
  check(profileResponse, {
    'profile status is 200': (r) => r.status === 200,
    'profile response time < 300ms': (r) => r.timings.duration < 300,
  });

  // Record errors
  errorRate.add(loginResponse.status !== 200 || profileResponse.status !== 200);

  // Think time
  sleep(1);
}

// Generate HTML report
export function handleSummary(data) {
  return {
    'reports/api-load-test.html': htmlReport(data),
  };
} 