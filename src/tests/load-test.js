import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { tag, group } from 'k6';
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
                { duration: '2m', target: 5 },     // Ramp-up to normal load
                { duration: '5m', target: 5 },     // Stay at normal load
                { duration: '2m', target: 10 },    // Increase load
                { duration: '5m', target: 10 },    // Stay at increased load
                { duration: '2m', target: 15 },    // Increase load further
                { duration: '5m', target: 15 },    // Stay at high load
                { duration: '2m', target: 0 },     // Ramp-down
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.05'],
        errors: ['rate<0.1'],
        response_time_ok: ['rate>0.9'],
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
    
    // Apply test tags
    tag('type', 'load');
    tag('environment', __ENV.ENVIRONMENT || 'staging');
    tag('component', 'api');
    tag('priority', 'high');
    tag('service', 'reqres-api');
    
    logger.info(`Starting load test iteration for VU ${__VU}`);

    // Group API endpoints
    group('User Management API', function() {
        // List Users
        group('List Users', function() {
            const listUsersResponse = http.get(`${baseUrl}/users?page=2`);
            check(listUsersResponse, {
                'list users status is 200': (r) => r.status === 200,
                'list users response time < 500ms': (r) => r.timings.duration < 500,
            });
            logger.debug(`List Users Response Time: ${listUsersResponse.timings.duration}ms`);
            return listUsersResponse;
        });

        // Get Single User
        group('Get Single User', function() {
            const singleUserResponse = http.get(`${baseUrl}/users/2`);
            check(singleUserResponse, {
                'single user status is 200': (r) => r.status === 200,
                'single user response time < 500ms': (r) => r.timings.duration < 500,
            });
            logger.debug(`Single User Response Time: ${singleUserResponse.timings.duration}ms`);
            return singleUserResponse;
        });

        // Create User
        group('Create User', function() {
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
            return createUserResponse;
        });

        // Update User
        group('Update User', function() {
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
            return updateUserResponse;
        });
    });

    // Authentication API
    group('Authentication API', function() {
        // Login
        group('Login', function() {
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
        responseTime.add(response.timings.duration < 500);
    });

    // Think time between requests
    sleep(1);
}

export { handleSummary }; 