import { sendEmailReport } from '../src/utils/email-reporter.js';
import path from 'path';
import fs from 'fs';

const testType = process.argv[2] || 'smoke';
const reportsDir = path.join(process.cwd(), 'reports');

console.log(`Preparing to send ${testType} test report...`);

// Check if reports directory exists
if (!fs.existsSync(reportsDir)) {
    console.log('Reports directory not found. Creating...');
    fs.mkdirSync(reportsDir, { recursive: true });
}

const testResultsPath = path.join(reportsDir, `${testType}-test-results.json`);
const htmlReportPath = path.join(reportsDir, `${testType}-test-report.html`);

// Check if report files exist
if (!fs.existsSync(testResultsPath)) {
    console.error(`Test results file not found: ${testResultsPath}`);
    process.exit(1);
}

if (!fs.existsSync(htmlReportPath)) {
    console.error(`HTML report file not found: ${htmlReportPath}`);
    process.exit(1);
}

console.log('Loading test results...');
const testResults = JSON.parse(fs.readFileSync(testResultsPath, 'utf8'));
console.log('Test results loaded successfully');

console.log('Email reporting is currently disabled. Reports are available in the reports directory:');
console.log(`- Test Results: ${testResultsPath}`);
console.log(`- HTML Report: ${htmlReportPath}`);

// Email reporting temporarily disabled
/*
try {
    console.log('Attempting to send email report...');
    const success = await sendEmailReport(testType, testResults, htmlReportPath);
    if (success) {
        console.log('Email report sent successfully!');
    } else {
        console.error('Failed to send email report');
        process.exit(1);
    }
} catch (error) {
    console.error('Error sending email report:', error);
    process.exit(1);
}
*/ 