import http from 'k6/http';
import { check, sleep, tag, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Constants
const BASE_URL = 'https://reqres.in/api';
const TEST_TIMEOUT = '30s';
const SLEEP_DURATION = 1;

// Test configuration
export const options = {
    scenarios: {
        smoke_test: {
            executor: 'per-test-case',
            vus: 1,
            iterations: 1,
            maxDuration: TEST_TIMEOUT,
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    }
};

// Helper function to make HTTP requests
function makeRequest(method, endpoint, payload = null) {
    const url = `${BASE_URL}${endpoint}`;
    const params = {
        tags: { name: endpoint },
        timeout: '30s'
    };

    let response;
    switch (method.toLowerCase()) {
        case 'get':
            response = http.get(url, params);
            break;
        case 'post':
            response = http.post(url, JSON.stringify(payload), params);
            break;
        default:
            throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response;
}

// Test cases
export default function () {
    group('API Smoke Tests', function () {
        // Test 1: List Users
        const listUsersResponse = makeRequest('GET', '/users?page=2');
        check(listUsersResponse, {
            'List Users - Status is 200': (r) => r.status === 200,
            'List Users - Response time < 500ms': (r) => r.timings.duration < 500,
            'List Users - Has data': (r) => r.json().data.length > 0
        });
        sleep(SLEEP_DURATION);

        // Test 2: Get Single User
        const singleUserResponse = makeRequest('GET', '/users/2');
        check(singleUserResponse, {
            'Get Single User - Status is 200': (r) => r.status === 200,
            'Get Single User - Response time < 500ms': (r) => r.timings.duration < 500,
            'Get Single User - Has user data': (r) => r.json().data.id === 2
        });
        sleep(SLEEP_DURATION);

        // Test 3: Login
        const loginPayload = {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
        };
        const loginResponse = makeRequest('POST', '/login', loginPayload);
        check(loginResponse, {
            'Login - Status is 200': (r) => r.status === 200,
            'Login - Response time < 500ms': (r) => r.timings.duration < 500,
            'Login - Has token': (r) => r.json().token !== undefined
        });
    });
}

// Handle test summary
export function handleSummary(data) {
    return {
        'reports/smoke-test-report.html': htmlReport(data),
        'reports/smoke-test-results.json': JSON.stringify(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true })
    };
} 