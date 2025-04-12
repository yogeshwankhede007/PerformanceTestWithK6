# 🚀 Performance Testing Framework with K6

[![K6 Version](https://img.shields.io/badge/k6-v0.45.0-blue)](https://k6.io/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Actions](https://github.com/yogeshwankhede007/PerformanceTestWithK6/actions/workflows/k6-tests.yml/badge.svg)](https://github.com/yogeshwankhede007/PerformanceTestWithK6/actions)

A modern, comprehensive performance testing framework using K6, following industry best practices and standards. This framework enables you to perform load, stress, and spike testing with ease, while providing detailed insights through HTML reports and automated reporting.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Test Results](#-test-results)
- [Project Structure](#-project-structure)
- [Running Tests](#-running-tests)
- [Test Types](#-test-types)
- [Configuration](#-configuration)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## ✨ Features

- 🚀 **Comprehensive Testing Suite**
  - Load testing
  - Stress testing
  - Spike testing
  - Smoke testing
  - API testing
- 📊 **Detailed Reporting**
  - HTML reports
  - Console output
  - Custom metrics
- 🔄 **CI/CD Integration**
  - GitHub Actions workflows
  - Automated test execution
- 🛠 **Developer Experience**
  - Environment configuration
  - Reusable components
  - Logging utilities
- 🏷️ **Test Organization**
  - Tag-based test filtering
  - Group-based organization
  - Reusable scenarios

## 📋 Prerequisites

- Node.js (v16 or higher)
- K6 (v0.45.0 or higher)
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yogeshwankhede007/PerformanceTestWithK6.git
   cd PerformanceTestWithK6
   ```

2. **Install K6**
   ```bash
   # macOS
   brew install k6
   
   # Windows (using Chocolatey)
   choco install k6
   
   # Linux
   sudo apt-get update && sudo apt-get install k6
   ```

## 📊 Test Results

### HTML Report
![K6 Load Test Report](https://github.com/user-attachments/assets/c756935d-4f7b-4874-8656-3e209e11b01a)

Key Metrics from Latest Run:
- Total Requests: 3535
- Failed Requests: 0
- Breached Thresholds: 0
- Failed Checks: 5
- Response Time (p95): 287.50ms
- Virtual Users: Max 10

### Console Output
![K6 Console Output](https://github.com/user-attachments/assets/4b366b43-91b9-42db-a614-168bd21daaa9)

Sample Response Times:
- List Users: 56.324ms
- Single User: 44.049ms
- Create User: 497.433ms
- Update User: 616.323ms
- Delete User: 304.546ms

### GitHub Actions Workflow

![GitHub Actions Jobs](https://github.com/user-attachments/assets/5f5288bf-308f-4793-8ebb-ecd4c2b3627)

## 📁 Project Structure
```
src/
├── tests/
│   ├── smoke-test.js      # Basic functionality testing
│   ├── reqres-api-test.js # Comprehensive API testing
│   ├── load-test.js       # Load testing scenarios
│   └── stress-test.js     # Stress testing scenarios
├── config/
│   └── base-config.js     # Shared configuration
└── utils/
    └── logger.js          # Logging utilities
```

## 🧪 Running Tests

### Basic Usage
```bash
# Run smoke test
k6 run src/tests/smoke-test.js

# Run API test
k6 run src/tests/reqres-api-test.js

# Run with custom BASE_URL
k6 run -e BASE_URL=https://your-api.com/api src/tests/reqres-api-test.js
```

### Environment Variables
- `BASE_URL`: API endpoint (default: https://reqres.in/api)
- `ENVIRONMENT`: Test environment (default: staging)

## 📋 Test Types

### 1. Smoke Test
- Basic functionality testing
- Single user, single iteration
- Core API validation
- Quick feedback loop

### 2. API Test
- Comprehensive endpoint testing
- CRUD operations
- Authentication flows
- Custom metrics
- Detailed reporting

### 3. Load Test
- Sustained load testing
- Multiple virtual users
- Performance metrics
- Threshold validation

### 4. Stress Test
- System limits testing
- Peak load simulation
- Breaking point identification
- Recovery monitoring

## ⚙️ Configuration

### Thresholds
```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
    'errors': ['rate<0.1'],
    'response_time_ok': ['rate>0.95']
  }
};
```

### Metrics
1. Response Time
   - 95th percentile < 2000ms
   - Custom tracking
2. Error Rates
   - HTTP errors < 1%
   - Custom errors < 10%
3. Custom Metrics
   - Error tracking
   - Response time validation

## 🌟 Best Practices
1. Run smoke tests first
2. Monitor error rates
3. Review response times
4. Check HTML reports
5. Adjust virtual users as needed

## 🤝 Contributing
1. Follow code structure
2. Add error handling
3. Include logging
4. Update documentation
5. Add meaningful tests

## 🔧 Troubleshooting
1. Check BASE_URL
2. Verify endpoints
3. Review error logs
4. Check HTML reports
5. Verify thresholds

## 📄 License
MIT License - see [LICENSE](LICENSE) file

---

Made with ❤️ by Yogesh Wankhede 
