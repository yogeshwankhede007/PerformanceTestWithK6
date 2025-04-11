export const config = {
  // API Configuration
  baseUrl: 'https://reqres.in/api',
  
  // Test Configuration
  testScenarios: {
    listUsers: {
      endpoint: '/users',
      method: 'GET',
      params: { page: 2 },
      expectedStatus: 200
    },
    singleUser: {
      endpoint: '/users/2',
      method: 'GET',
      expectedStatus: 200
    },
    createUser: {
      endpoint: '/users',
      method: 'POST',
      payload: {
        name: 'morpheus',
        job: 'leader'
      },
      expectedStatus: 201
    },
    updateUser: {
      endpoint: '/users/2',
      method: 'PUT',
      expectedStatus: 200
    },
    deleteUser: {
      endpoint: '/users/2',
      method: 'DELETE',
      expectedStatus: 204
    },
    register: {
      endpoint: '/register',
      method: 'POST',
      payload: {
        email: 'eve.holt@reqres.in',
        password: 'pistol'
      },
      expectedStatus: 200
    },
    login: {
      endpoint: '/login',
      method: 'POST',
      payload: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      },
      expectedStatus: 200
    }
  },

  // Performance Thresholds
  thresholds: {
    responseTime: {
      p95: 500,  // 95th percentile should be below 500ms
      p99: 1000  // 99th percentile should be below 1000ms
    },
    errorRate: 0.1,  // Error rate should be below 10%
    throughput: 100  // Minimum requests per second
  },

  // Load Test Configuration
  loadTest: {
    stages: [
      { duration: '1m', target: 10 },  // Ramp-up to 10 users
      { duration: '3m', target: 10 },  // Stay at 10 users
      { duration: '1m', target: 20 },  // Ramp-up to 20 users
      { duration: '3m', target: 20 },  // Stay at 20 users
      { duration: '1m', target: 0 }    // Ramp-down to 0 users
    ],
    thinkTime: 1  // Think time between requests in seconds
  },

  // Monitoring Configuration
  monitoring: {
    influxdb: {
      url: process.env.K6_INFLUXDB_URL || 'http://localhost:8086',
      token: process.env.K6_INFLUXDB_TOKEN,
      org: process.env.K6_INFLUXDB_ORG,
      bucket: process.env.K6_INFLUXDB_BUCKET
    }
  }
}; 