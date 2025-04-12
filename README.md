# 🚀 Performance Testing Framework with K6

[![K6 Version](https://img.shields.io/badge/k6-v0.45.0-blue)](https://k6.io/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Actions](https://github.com/yourusername/PerformanceTestWithK6/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/PerformanceTestWithK6/actions)

A modern, comprehensive performance testing framework using K6, following industry best practices and standards. This framework enables you to perform load, stress, and spike testing with ease, while providing detailed insights through Grafana dashboards and automated reporting.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Reporting](#-reporting)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Features

- 🚀 **Comprehensive Testing Suite**
  - Load testing
  - Stress testing
  - Spike testing
  - Soak testing
  - Security testing
- 📊 **Real-time Monitoring**
  - Grafana dashboards
  - InfluxDB metrics storage
- 🔔 **Automated Notifications**
  - Slack integration
  - Email reporting
- 🔄 **CI/CD Integration**
  - GitHub Actions workflows
  - Automated test execution
- 🛠 **Developer Experience**
  - TypeScript support
  - ESLint configuration
  - Prettier formatting
  - Docker support
- 🏷️ **Test Organization**
  - Tag-based test filtering
  - Group-based test organization
  - Reusable test scenarios

## 📋 Prerequisites

- Node.js (v16 or higher)
- K6 (v0.45.0 or higher)
- Docker and Docker Compose
- GitHub account
- Slack workspace (optional)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PerformanceTestWithK6.git
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

3. **Install project dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the monitoring stack**
   ```bash
   docker-compose up -d
   ```

## 📁 Project Structure

```
.
├── docs/                    # Documentation
│   ├── PERFORMANCE_TESTING_STRATEGY.md
│   └── TEST_PLAN.md
├── src/                     # Source code
│   ├── tests/              # Test scripts
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
├── reports/                # Test reports
├── grafana/                # Grafana dashboards
├── .github/               # GitHub Actions workflows
└── scripts/               # Helper scripts
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
K6_INFLUXDB_URL=http://localhost:8086
K6_GRAFANA_URL=http://localhost:3000
SLACK_WEBHOOK_URL=your-slack-webhook
SMTP_CONFIG=your-smtp-config
```

### Test Configuration

Test configurations are stored in `src/config/`. Each test type has its own configuration file.

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
k6 run src/tests/specific-test.js
```

### Run with Custom Options
```bash
k6 run --vus 10 --duration 30s src/tests/load-test.js
```

### Run Tests by Tags
```bash
# Run all tests with specific tag
k6 run --tag type=load src/tests/

# Run tests with multiple tags
k6 run --tag type=load --tag environment=staging src/tests/

# Exclude tests with specific tag
k6 run --tag type!=load src/tests/
```

### Run Tests by Groups
```bash
# Run specific test group
k6 run --group "API Tests" src/tests/

# Run multiple groups
k6 run --group "API Tests" --group "UI Tests" src/tests/
```

### Run Load Test
```bash
k6 run src/tests/load-test.js
```

### Run Stress Test
```bash
k6 run src/tests/stress-test.js
```

### Run Soak Test
```bash
k6 run src/tests/soak-test.js
```

### Run Smoke Test
```bash
k6 run src/tests/smoke-test.js
```

## 🏷️ Test Organization

### Tags
Tags are used to categorize and filter tests. Common tag categories include:

- `type`: Test type (load, stress, spike, soak)
- `environment`: Deployment environment (dev, staging, prod)
- `component`: System component (api, database, ui)
- `priority`: Test priority (high, medium, low)

Example of tagging in a test file:
```javascript
import { tag } from 'k6';

export default function() {
    tag('type', 'load');
    tag('environment', 'staging');
    tag('component', 'api');
    tag('priority', 'high');
    
    // Test implementation
}
```

### Groups
Groups help organize related tests and provide better reporting. Example:

```javascript
import { group } from 'k6';

export default function() {
    group('API Endpoints', function() {
        group('Authentication', function() {
            // Authentication tests
        });
        
        group('User Management', function() {
            // User management tests
        });
    });
}
```

### Best Practices

1. **Tag Naming Convention**
   - Use lowercase letters
   - Separate words with hyphens
   - Be consistent across all tests

2. **Group Organization**
   - Create logical hierarchies
   - Keep groups focused and specific
   - Use descriptive names

3. **Tag Usage**
   - Tag all tests with at least `type` and `component`
   - Use environment tags for environment-specific tests
   - Add priority tags for critical tests

4. **Group Structure**
   - Organize by feature or component
   - Create nested groups for complex scenarios
   - Keep group names clear and concise

## 📊 Reporting

- **Real-time Monitoring**: Access Grafana dashboards at `http://localhost:3000`
- **HTML Reports**: Generated in `reports/` directory
- **Slack Notifications**: Real-time test results
- **Email Reports**: Detailed test summaries
- **GitHub Actions**: Automated test execution and reporting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, please:
- Open an issue in the GitHub repository
- Join our [Discord community](https://discord.gg/your-discord)
- Email us at support@example.com

---

Made with ❤️ by [Your Name] 

# Performance Testing Suite with k6

This project contains a comprehensive performance testing suite built with k6 for testing RESTful APIs. The suite includes smoke tests, load tests, stress tests, and spike tests.

## Test Results

### HTML Report
![K6 Load Test Report](docs/images/html-report-1.png)
![K6 Load Test Stats](docs/images/html-report-2.png)
![K6 Load Test Checks](docs/images/html-report-3.png)

Key Metrics from Latest Run:
- Total Requests: 3535
- Failed Requests: 0
- Breached Thresholds: 0
- Failed Checks: 5
- Response Time (p95): 287.50ms
- Virtual Users: Max 10

### Console Output
![K6 Console Output](docs/images/console-output.png)

Sample Response Times:
- List Users: 56.324ms
- Single User: 44.049ms
- Create User: 497.433ms
- Update User: 616.323ms
- Delete User: 304.546ms

### GitHub Actions Workflow
![GitHub Actions Jobs](docs/images/github-actions.png)

Workflow Steps:
- ✅ Set up job (1s)
- ✅ Checkout code (1s)
- ✅ Setup Node.js (8s)
- ✅ Install k6 (11s)
- ✅ Create reports directory (8s)
- ✅ Run Smoke Test (8s)
- ✅ Run API Test (38s)
- ✅ Upload Test Reports (1s)
- ✅ Upload Test Summary (8s)

## Test Types

### 1. Smoke Test (`src/tests/smoke-test.js`)
- Basic functionality testing with minimal load
- Single user, single iteration
- Validates core API endpoints
- HTML report generation

### 2. API Test (`src/tests/reqres-api-test.js`)
- Comprehensive API endpoint testing
- Features:
  - User Management operations (CRUD)
  - Authentication testing
  - Custom metrics tracking
  - Response validation
  - HTML reporting
- Configurable thresholds:
  - Response time (p95 < 2000ms)
  - Error rate (< 1%)
  - Custom metrics tracking

## Running Tests

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

## Test Reports
HTML reports are generated for each test run:
- Smoke Test: `reports/smoke-test-report.html`
- API Test: `reports/reqres-api-test-report.html`

Reports include:
- Test summary
- Response times
- Error rates
- Custom metrics
- Threshold results

## Metrics and Thresholds

### API Test Metrics
1. Response Time
   - 95th percentile < 2000ms
   - Custom response time tracking

2. Error Rates
   - HTTP errors < 1%
   - Custom error rate < 10%

3. Custom Metrics
   - `errors`: Tracks non-success responses
   - `response_time_ok`: Tracks responses within threshold

## Project Structure
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

## Recent Updates
1. Enhanced Error Handling
   - Improved response validation
   - Better error logging
   - Custom error rate tracking

2. Improved Metrics
   - Added custom response time tracking
   - Enhanced error rate monitoring
   - Detailed performance metrics

3. Better Reporting
   - HTML report generation
   - Detailed test results
   - Custom metrics visualization

4. Code Organization
   - Standardized variable naming
   - Improved code structure
   - Better documentation

## Best Practices
1. Always run smoke tests before load tests
2. Monitor error rates and response times
3. Use appropriate thresholds for your environment
4. Review HTML reports after test execution
5. Adjust virtual user counts based on your needs

## Contributing
1. Follow the established code structure
2. Add appropriate error handling
3. Include detailed logging
4. Update documentation for new features
5. Add meaningful test cases

## Troubleshooting
1. Check BASE_URL configuration
2. Verify API endpoints are accessible
3. Review error logs in test output
4. Check HTML reports for detailed metrics
5. Verify threshold configurations 