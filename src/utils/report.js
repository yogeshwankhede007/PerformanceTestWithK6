import { htmlReport, textSummary } from './reporter.js';

export function generateReport(data, testType) {
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getFullYear()}`;
    const reportName = `${testType}${formattedDate}.html`;
    
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }),
        [`reports/${reportName}`]: htmlReport(data),
    };
} 