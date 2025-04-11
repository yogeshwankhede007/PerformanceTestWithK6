import http from 'k6/http';
import { check } from 'k6';

// Helper function to make HTTP requests
export function makeRequest(method, url, payload = null, params = {}) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...params
  };

  let response;
  switch (method.toUpperCase()) {
    case 'GET':
      response = http.get(url, options);
      break;
    case 'POST':
      response = http.post(url, JSON.stringify(payload), options);
      break;
    case 'PUT':
      response = http.put(url, JSON.stringify(payload), options);
      break;
    case 'DELETE':
      response = http.del(url, null, options);
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }

  return response;
}

// Helper function to validate response
export function validateResponse(response, expectedStatus, checks = {}) {
  const defaultChecks = {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    'response time < 500ms': (r) => r.timings.duration < 500,
  };

  return check(response, {
    ...defaultChecks,
    ...checks
  });
}

// Helper function to generate random user data
export function generateUserData() {
  return {
    name: `User ${Math.floor(Math.random() * 1000)}`,
    job: `Job ${Math.floor(Math.random() * 1000)}`
  };
}

// Helper function to generate random email
export function generateEmail() {
  return `user${Math.floor(Math.random() * 1000)}@reqres.in`;
}

// Helper function to calculate metrics
export function calculateMetrics(responses) {
  const metrics = {
    totalRequests: responses.length,
    successfulRequests: 0,
    failedRequests: 0,
    totalResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: Infinity
  };

  responses.forEach(response => {
    if (response.status >= 200 && response.status < 300) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }

    const responseTime = response.timings.duration;
    metrics.totalResponseTime += responseTime;
    metrics.maxResponseTime = Math.max(metrics.maxResponseTime, responseTime);
    metrics.minResponseTime = Math.min(metrics.minResponseTime, responseTime);
  });

  metrics.averageResponseTime = metrics.totalResponseTime / metrics.totalRequests;
  metrics.successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;

  return metrics;
}

// Helper function to format duration
export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
} 