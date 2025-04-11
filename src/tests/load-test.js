import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { baseConfig } from '../config/base-config.js';
import { logger } from '../utils/logger.js';
import { handleSummary } from '../utils/reporter.js';

// Set test name
export const TEST_NAME = 'load_test';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Rate('response_time_ok');

// Load Test Configuration
export const options = {
    scenarios: {
        load_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 5 },   // Ramp-up to 5 users
                { duration: '1m', target: 5 },    // Stay at 5 users
                { duration: '30s', target: 10 },  // Ramp-up to 10 users
                { duration: '1m', target: 10 },   // Stay at 10 users
                { duration: '30s', target: 0 },   // Ramp-down to 0 users
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_duration: baseConfig.metrics.http_req_duration,
        http_req_failed: baseConfig.metrics.http_req_failed,
        errors: ['rate<0.1'],
        response_time_ok: ['rate>0.95'],
    },
};

// Test data
const testData = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
};

// Test scenario
export default function () {
    const baseUrl = __ENV.BASE_URL || 'https://reqres.in/api';
    logger.info(`Starting load test iteration for VU ${__VU}`);

    // List Users
    const listUsersResponse = http.get(`${baseUrl}/users?page=2`);
    check(listUsersResponse, {
        'list users status is 200': (r) => r.status === 200,
        'list users response time < 500ms': (r) => r.timings.duration < 500,
    });
    logger.debug(`List Users Response Time: ${listUsersResponse.timings.duration}ms`);

    // Get Single User
    const singleUserResponse = http.get(`${baseUrl}/users/2`);
    check(singleUserResponse, {
        'single user status is 200': (r) => r.status === 200,
        'single user response time < 500ms': (r) => r.timings.duration < 500,
    });
    logger.debug(`Single User Response Time: ${singleUserResponse.timings.duration}ms`);

    // Create User
    const createUserResponse = http.post(
        `${baseUrl}/users`,
        JSON.stringify({
            name: 'morpheus',
            job: 'leader'
        }),
        { headers: { 'Content-Type': 'application/json' } }
    );
    check(createUserResponse, {
        'create user status is 201': (r) => r.status === 201,
        'create user response time < 500ms': (r) => r.timings.duration < 500,
    });
    logger.debug(`Create User Response Time: ${createUserResponse.timings.duration}ms`);

    // Update User
    const updateUserResponse = http.put(
        `${baseUrl}/users/2`,
        JSON.stringify({
            name: 'morpheus',
            job: 'zion resident'
        }),
        { headers: { 'Content-Type': 'application/json' } }
    );
    check(updateUserResponse, {
        'update user status is 200': (r) => r.status === 200,
        'update user response time < 500ms': (r) => r.timings.duration < 500,
    });
    logger.debug(`Update User Response Time: ${updateUserResponse.timings.duration}ms`);

    // Login
    const loginResponse = http.post(
        `${baseUrl}/login`,
        JSON.stringify(testData),
        { headers: { 'Content-Type': 'application/json' } }
    );
    check(loginResponse, {
        'login status is 200': (r) => r.status === 200,
        'login response time < 500ms': (r) => r.timings.duration < 500,
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
        responseTime.add(response.timings.duration < 500);
    });

    // Think time between requests
    sleep(1);
}

export { handleSummary }; 