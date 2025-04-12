import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function sendEmailReport(testType, testResults, htmlReportPath) {
    try {
        // Create transporter using ProtonMail SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.protonmail.ch',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        // Read the HTML report
        const htmlReport = fs.readFileSync(htmlReportPath, 'utf8');

        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECIPIENT || 'yogi.wankhede007@gmail.com',
            subject: `K6 ${testType} Test Results - ${new Date().toISOString()}`,
            html: `
                <h2>K6 Performance Test Report</h2>
                <p><strong>Test Type:</strong> ${testType}</p>
                <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Environment:</strong> ${process.env.ENVIRONMENT || 'staging'}</p>
                <h3>Test Summary:</h3>
                <ul>
                    <li><strong>Status:</strong> ${testResults.status}</li>
                    <li><strong>Total Requests:</strong> ${testResults.metrics.iterations}</li>
                    <li><strong>Failed Requests:</strong> ${testResults.metrics.failed_requests || 0}</li>
                    <li><strong>Response Time (p95):</strong> ${testResults.metrics.http_req_duration?.p95.toFixed(2)}ms</li>
                    <li><strong>Error Rate:</strong> ${(testResults.metrics.errors?.rate || 0).toFixed(2)}%</li>
                    <li><strong>Virtual Users:</strong> ${testResults.metrics.vus || 0}</li>
                    <li><strong>Test Duration:</strong> ${testResults.state.testRunDuration || '0s'}</li>
                </ul>
                <p>Please find the detailed HTML report attached.</p>
                <hr>
                <p style="font-size: 12px; color: #666;">
                    This is an automated email from the K6 Performance Testing Framework.<br>
                    Generated on ${new Date().toLocaleString()}
                </p>
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