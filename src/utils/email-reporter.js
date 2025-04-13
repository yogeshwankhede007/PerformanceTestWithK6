import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Constants
const SMTP_CONFIG = {
    service: 'gmail',
    auth: {
        user: 'yogirajwankhede@gmail.com',
        pass: 'Yogiraj@1994'
    }
};

const EMAIL_CONFIG = {
    from: 'yogirajwankhede@gmail.com',
    to: 'yogirajwankhede@gmail.com'
};

/**
 * Sends an email report with test results
 * @param {string} testType - Type of test (smoke, load, stress, etc.)
 * @param {Object} testResults - Test results data
 * @param {string} htmlReportPath - Path to HTML report file
 * @returns {Promise<boolean>} - Success status
 */
export async function sendEmailReport(testType, testResults, htmlReportPath) {
    try {
        console.log('Starting email report process...');
        console.log('Test type:', testType);
        console.log('HTML report path:', htmlReportPath);

        // Create transporter
        const transporter = nodemailer.createTransport(SMTP_CONFIG);

        // Verify connection
        try {
            await transporter.verify();
            console.log('SMTP connection verified successfully');
        } catch (verifyError) {
            console.error('SMTP connection verification failed:', verifyError);
            throw verifyError;
        }

        // Read the HTML report
        console.log('Reading HTML report...');
        const htmlReport = fs.readFileSync(htmlReportPath, 'utf8');
        console.log('HTML report read successfully');

        // Prepare email content
        const mailOptions = {
            ...EMAIL_CONFIG,
            subject: `K6 ${testType} Test Results - ${new Date().toISOString()}`,
            html: generateEmailContent(testType, testResults),
            attachments: [
                {
                    filename: `${testType.toLowerCase()}-test-report.html`,
                    content: htmlReport
                }
            ]
        };

        console.log('Attempting to send email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

/**
 * Generates HTML content for the email
 * @param {string} testType - Type of test
 * @param {Object} testResults - Test results data
 * @returns {string} - HTML content
 */
function generateEmailContent(testType, testResults) {
    return `
        <h2>K6 Performance Test Report</h2>
        <p><strong>Test Type:</strong> ${testType}</p>
        <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Environment:</strong> ${process.env.ENVIRONMENT || 'staging'}</p>
        <h3>Test Summary:</h3>
        <ul>
            <li><strong>Status:</strong> ${testResults.status || 'Unknown'}</li>
            <li><strong>Total Requests:</strong> ${testResults.metrics?.iterations || 0}</li>
            <li><strong>Failed Requests:</strong> ${testResults.metrics?.failed_requests || 0}</li>
            <li><strong>Response Time (p95):</strong> ${testResults.metrics?.http_req_duration?.p95?.toFixed(2) || 0}ms</li>
            <li><strong>Error Rate:</strong> ${(testResults.metrics?.errors?.rate || 0).toFixed(2)}%</li>
            <li><strong>Virtual Users:</strong> ${testResults.metrics?.vus || 0}</li>
            <li><strong>Test Duration:</strong> ${testResults.state?.testRunDuration || '0s'}</li>
        </ul>
        <p>Please find the detailed HTML report attached.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
            This is an automated email from the K6 Performance Testing Framework.<br>
            Generated on ${new Date().toLocaleString()}
        </p>
    `;
}

/**
 * Handles errors in the email reporting process
 * @param {Error} error - Error object
 */
function handleError(error) {
    console.error('Error in sendEmailReport:', error);
    if (error.code) console.error('Error code:', error.code);
    if (error.command) console.error('Failed command:', error.command);
} 