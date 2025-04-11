import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { generateReport } from './utils/report.js';
import { config } from './config.js';
import { Rate } from 'k6/metrics';
import { handleSummary } from './utils/reporter.js';

// Set test name
export const TEST_NAME = 'api_test';

// Load test data from JSON file
const testData = JSON.parse(open('../data/test-data.json'));

// Create SharedArrays for each data type
const users = new SharedArray('users', function() {
    return testData.users;
});

const products = new SharedArray('products', function() {
    return testData.products;
});

const orders = new SharedArray('orders', function() {
    return testData.orders;
});

export const options = config.testOptions;

export default function () {
    // Get random test data
    const user = users[Math.floor(Math.random() * users.length)];

    // Test user registration
    const registerRes = http.post(`${config.baseUrl}/register`, JSON.stringify({
        email: user.username,
        password: user.password,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(registerRes, {
        'registration successful': (r) => r.status === 200,
    });

    // Test user login
    const loginRes = http.post(`${config.baseUrl}/login`, JSON.stringify({
        email: user.username,
        password: user.password,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    check(loginRes, {
        'login successful': (r) => r.status === 200,
    });

    const token = loginRes.json('token');

    // Test user list endpoint
    const usersRes = http.get(`${config.baseUrl}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    check(usersRes, {
        'users list successful': (r) => r.status === 200,
    });

    // Test single user endpoint
    const userRes = http.get(`${config.baseUrl}/users/1`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    check(userRes, {
        'user details successful': (r) => r.status === 200,
    });

    sleep(1);
}

export { handleSummary }; 