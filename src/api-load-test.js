import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { generateReport } from './utils/report.js';
import { config } from './config.js';

// Load test data from JSON file
const testData = JSON.parse(open('../data/test-data.json'));

// Create SharedArray for users
const users = new SharedArray('users', function() {
    return testData.users;
});

export const options = config.testOptions;

export default function () {
    // Get random test data
    const user = users[Math.floor(Math.random() * users.length)];

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
    const res = http.get(`${config.baseUrl}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}

export function handleSummary(data) {
    return generateReport(data, 'apiLoadTest');
} 