import { sendEmailReport } from '../src/utils/email-reporter.js';
import fs from 'fs';
import path from 'path';

// Constants
const REPORTS_DIR = 'reports';
const DEFAULT_TEST_TYPE = 'smoke';

/**
 * Main function to send test reports
 * @returns {Promise<void>}
 */
async function main() {
    try {
        const testType = process.argv[2] || DEFAULT_TEST_TYPE;
        console.log(`Preparing to send ${testType} test report...`);

        // Ensure reports directory exists
        ensureReportsDirectory();

        // Get report file paths
        const { testResultsPath, htmlReportPath } = getReportPaths(testType);

        // Validate report files
        validateReportFiles(testResultsPath, htmlReportPath);

        // Load test results
        const testResults = loadTestResults(testResultsPath);

        // Send email report (currently disabled)
        console.log('Email reporting is currently disabled. Reports are available in the reports directory:');
        console.log(`- Test Results: ${testResultsPath}`);
        console.log(`- HTML Report: ${htmlReportPath}`);

    } catch (error) {
        console.error('Error in send-report script:', error.message);
        process.exit(1);
    }
}

/**
 * Ensures the reports directory exists
 */
function ensureReportsDirectory() {
    if (!fs.existsSync(REPORTS_DIR)) {
        console.log('Reports directory not found. Creating...');
        fs.mkdirSync(REPORTS_DIR, { recursive: true });
    }
}

/**
 * Gets the paths for test report files
 * @param {string} testType - Type of test
 * @returns {Object} - Object containing test results and HTML report paths
 */
function getReportPaths(testType) {
    return {
        testResultsPath: path.join(REPORTS_DIR, `${testType}-test-results.json`),
        htmlReportPath: path.join(REPORTS_DIR, `${testType}-test-report.html`)
    };
}

/**
 * Validates that report files exist
 * @param {string} testResultsPath - Path to test results file
 * @param {string} htmlReportPath - Path to HTML report file
 */
function validateReportFiles(testResultsPath, htmlReportPath) {
    if (!fs.existsSync(testResultsPath)) {
        throw new Error(`Test results file not found: ${testResultsPath}`);
    }

    if (!fs.existsSync(htmlReportPath)) {
        throw new Error(`HTML report file not found: ${htmlReportPath}`);
    }
}

/**
 * Loads and parses test results from JSON file
 * @param {string} testResultsPath - Path to test results file
 * @returns {Object} - Parsed test results
 */
function loadTestResults(testResultsPath) {
    console.log('Loading test results...');
    const testResults = JSON.parse(fs.readFileSync(testResultsPath, 'utf8'));
    console.log('Test results loaded successfully');
    return testResults;
}

// Execute the main function
main().catch(error => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
}); 