export const config = {
    baseUrl: 'https://reqres.in/api',
    testOptions: {
        stages: [
            { duration: '3s', target: 2 }, // Ramp up to 20 users
            { duration: '10s', target: 2 },  // Stay at 20 users
            { duration: '3s', target: 0 },  // Ramp down to 0 users
        ],
        thresholds: {
            http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
            http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
        },
    }
}; 