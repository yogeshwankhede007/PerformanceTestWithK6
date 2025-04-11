import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function handleSummary(data) {
    // Get the script name from the test run
    const testScript = __ENV.TEST_NAME || 'default';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 14);
    const reportPath = `./reports/${testScript}_${timestamp}.html`;

    return {
        [reportPath]: htmlReport(data, { 
            title: `K6 Performance Test Report - ${testScript}`,
            debug: true
        }),
        stdout: customTextSummary(data, { indent: " ", enableColors: true })
    };
}

export function customTextSummary(data, { indent = ' ', enableColors = true } = {}) {
    let output = '';
    const reset = '\x1b[0m';
    
    // Test Configuration
    output += 'Test Configuration:\n';
    output += `${indent}Test Type: ${(data.state && data.state.testType) || 'Performance Test'}\n`;
    output += `${indent}Scenarios: ${(data.state && data.state.scenarios) ? Object.keys(data.state.scenarios).join(', ') : 'N/A'}\n`;
    output += `${indent}VUs: ${(data.state && data.state.vus) || 0}\n`;
    output += `${indent}Max VUs: ${(data.state && data.state.maxVUs) || 0}\n\n`;
    
    // Test Summary
    output += 'Test Summary:\n';
    output += `${indent}Duration: ${((data.state && data.state.testRunDurationMs) / 1000 || 0).toFixed(2)}s\n`;
    output += `${indent}Iterations: ${(data.metrics && data.metrics.iterations && data.metrics.iterations.count) || 0}\n`;
    output += `${indent}HTTP Requests: ${(data.metrics && data.metrics.http_reqs && data.metrics.http_reqs.count) || 0}\n`;
    output += `${indent}Data Sent: ${((data.metrics && data.metrics.data_sent && data.metrics.data_sent.count) / 1024 || 0).toFixed(2)} KB\n`;
    output += `${indent}Data Received: ${((data.metrics && data.metrics.data_received && data.metrics.data_received.count) / 1024 || 0).toFixed(2)} KB\n\n`;
    
    // Checks Summary
    output += 'Checks Summary:\n';
    const checks = (data.metrics && data.metrics.checks && data.metrics.checks.values) || {};
    if (Object.keys(checks).length > 0) {
        Object.entries(checks).forEach(([key, value]) => {
            const passes = value.passes || 0;
            const fails = value.fails || 0;
            const total = passes + fails;
            const passRate = total > 0 ? ((passes / total) * 100).toFixed(2) : '0.00';
            output += `${indent}✓ ${key}: ${passes}/${total} (${passRate}%)\n`;
        });
    } else {
        output += `${indent}No checks defined\n`;
    }
    output += '\n';
    
    // HTTP Metrics
    output += 'HTTP Metrics:\n';
    const httpReqs = (data.metrics && data.metrics.http_reqs) || {};
    const httpReqDuration = (data.metrics && data.metrics.http_req_duration) || {};
    output += `${indent}Request Rate: ${(httpReqs.rate || 0).toFixed(2)} requests/second\n`;
    output += `${indent}Average Response Time: ${(httpReqDuration.avg || 0).toFixed(2)} ms\n`;
    output += `${indent}Min Response Time: ${(httpReqDuration.min || 0).toFixed(2)} ms\n`;
    output += `${indent}Max Response Time: ${httpReqDuration.max || 0} ms\n`;
    output += `${indent}90th Percentile: ${(httpReqDuration.p90 || 0).toFixed(2)} ms\n`;
    output += `${indent}95th Percentile: ${(httpReqDuration.p95 || 0).toFixed(2)} ms\n`;
    output += `${indent}99th Percentile: ${(httpReqDuration.p99 || 0).toFixed(2)} ms\n\n`;
    
    // Error Summary
    const errors = (data.metrics && data.metrics.http_req_failed) || {};
    if (errors.count > 0) {
        output += 'Error Summary:\n';
        output += `${indent}Failed Requests: ${errors.count || 0}\n`;
        output += `${indent}Error Rate: ${(errors.rate || 0).toFixed(2)}%\n`;
        if (data.metrics && data.metrics.errors && data.metrics.errors.values) {
            Object.entries(data.metrics.errors.values).forEach(([error, count]) => {
                output += `${indent}✗ ${error}: ${count}\n`;
            });
        }
        output += '\n';
    }
    
    // Thresholds
    output += 'Thresholds:\n';
    const thresholds = (data.state && data.state.thresholds) || {};
    if (Object.keys(thresholds).length > 0) {
        Object.entries(thresholds).forEach(([key, value]) => {
            const status = value.ok ? '✓ PASS' : '✗ FAIL';
            const color = value.ok ? '\x1b[32m' : '\x1b[31m';
            output += `${indent}${enableColors ? color : ''}${status}${enableColors ? reset : ''} ${key}: ${value.value}\n`;
        });
    } else {
        output += `${indent}No thresholds defined\n`;
    }
    
    // Test Status
    output += '\nTest Status: ';
    const failed = Object.values(thresholds).some(t => !t.ok);
    const statusColor = failed ? '\x1b[31m' : '\x1b[32m';
    const statusText = failed ? 'FAILED' : 'PASSED';
    output += `${enableColors ? statusColor : ''}${statusText}${enableColors ? reset : ''}\n`;
    
    return output;
} 