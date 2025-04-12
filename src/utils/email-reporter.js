import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function sendEmailReport(testType, testResults, htmlReportPath) {
    try {
        // Create transporter using environment variables
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
            }
        });

        // Read the HTML report
        const htmlReport = fs.readFileSync(htmlReportPath, 'utf8');

        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'yogi.wankhede007@gmail.com',
            subject: `K6 ${testType} Test Results - ${new Date().toISOString()}`,
            html: `
                <h2>K6 Performance Test Report</h2>
                <p><strong>Test Type:</strong> ${testType}</p>
                <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
                <h3>Test Summary:</h3>
                <ul>
                    <li><strong>Status:</strong> ${testResults.status}</li>
                    <li><strong>Total Requests:</strong> ${testResults.metrics.iterations}</li>
                    <li><strong>Failed Requests:</strong> ${testResults.metrics.failed_requests || 0}</li>
                    <li><strong>Response Time (p95):</strong> ${testResults.metrics.http_req_duration?.p95.toFixed(2)}ms</li>
                    <li><strong>Error Rate:</strong> ${(testResults.metrics.errors?.rate || 0).toFixed(2)}%</li>
                </ul>
                <p>Please find the detailed HTML report attached.</p>
            `,
            attachments: [
                {
                    filename: `${testType.toLowerCase()}-test-report.html`,
                    content: htmlReport
                }
            ]
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email report sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email report:', error);
        return false;
    }
} 