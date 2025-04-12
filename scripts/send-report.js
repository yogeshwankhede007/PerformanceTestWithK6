import { sendEmailReport } from '../src/utils/email-reporter.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

async function sendReport() {
    try {
        // Get test type from command line argument
        const testType = process.argv[2] || 'Unknown';
        
        // Read the test results JSON file
        const resultsPath = path.join(process.cwd(), 'reports', `${testType.toLowerCase()}-test-results.json`);
        const htmlReportPath = path.join(process.cwd(), 'reports', `${testType.toLowerCase()}-test-report.html`);
        
        if (!fs.existsSync(resultsPath) || !fs.existsSync(htmlReportPath)) {
            throw new Error('Test results or HTML report not found');
        }

        const testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        
        // Send email report
        const sent = await sendEmailReport(testType, testResults, htmlReportPath);
        
        if (sent) {
            console.log('Email report sent successfully');
            process.exit(0);
        } else {
            console.error('Failed to send email report');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error in send-report script:', error);
        process.exit(1);
    }
}

sendReport(); 