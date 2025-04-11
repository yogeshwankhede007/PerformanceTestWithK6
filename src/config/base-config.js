export const baseConfig = {
  // Common Metrics
  metrics: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // Response time thresholds
    http_req_failed: ['rate<0.1'],                   // Error rate threshold
    http_reqs: ['rate>100'],                         // Throughput threshold
    vus: ['value>0'],                                // Virtual users threshold
    iteration_duration: ['p(95)<1000'],              // Iteration duration threshold
  },

  // Common Options
  options: {
    vus: 1,
    duration: '30s',
    iterations: 10,
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)'],
    summaryTimeUnit: 'ms',
    noConnectionReuse: false,
    discardResponseBodies: true,
    systemTags: ['url', 'name', 'status', 'method', 'scenario'],
    userTags: ['test_type', 'endpoint', 'status_code'],
  },

  // Common Scenarios
  scenarios: {
    // Base scenario configuration
    baseScenario: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 100,
      maxDuration: '30m',
      gracefulStop: '30s',
      startTime: '0s',
    },
  },

  // Logging Configuration
  logging: {
    console: {
      level: 'info',
      format: 'text',
      timeFormat: '2006-01-02 15:04:05',
    },
    file: {
      enabled: true,
      path: './logs/k6.log',
      level: 'debug',
    },
  },

  // Error Handling
  errorHandling: {
    abortOnFail: false,
    delayAbortEval: '10s',
    noVUConnectionReuse: false,
    throw: false,
  },

  // Environment Variables
  env: {
    BASE_URL: 'https://reqres.in/api',
    TEST_ENV: 'staging',
    LOG_LEVEL: 'info',
  },
}; 