# Performance Testing Framework with K6

A comprehensive performance testing framework using K6, following industry best practices and MAANG company standards.

## Project Structure

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
├── dashboards/            # Grafana dashboards
├── .github/               # GitHub Actions workflows
└── scripts/               # Helper scripts
```

## Prerequisites

- Node.js (v16 or higher)
- K6 (v0.45.0 or higher)
- Docker (for InfluxDB and Grafana)
- GitHub account
- Slack workspace (for notifications)

## Setup

1. Install K6:
```bash
# macOS
brew install k6
```

2. Install project dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start InfluxDB and Grafana:
```bash
docker-compose up -d
```

## Running Tests

1. Run all tests:
```bash
npm test
```

2. Run specific test:
```bash
k6 run src/tests/specific-test.js
```

## Features

- Comprehensive performance testing suite
- Integration with InfluxDB for metrics storage
- Grafana dashboards for visualization
- Automated CI/CD with GitHub Actions
- Slack notifications for test results
- Email reporting
- Custom test scenarios
- Security testing
- Load, stress, and spike testing
- Soak testing capabilities

## Configuration

### Environment Variables

- `K6_INFLUXDB_URL`: InfluxDB connection URL
- `K6_GRAFANA_URL`: Grafana dashboard URL
- `SLACK_WEBHOOK_URL`: Slack webhook for notifications
- `SMTP_CONFIG`: Email configuration

### Test Configuration

Test configurations are stored in `src/config/`. Each test type has its own configuration file.

## Reporting

- Real-time Grafana dashboards
- HTML reports in `reports/` directory
- Slack notifications
- Email reports
- GitHub Actions artifacts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, please open an issue in the GitHub repository. 