import { sleep } from 'k6';

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Current log level (can be set via environment variable)
const currentLogLevel = __ENV.LOG_LEVEL ? LOG_LEVELS[__ENV.LOG_LEVEL.toUpperCase()] : LOG_LEVELS.INFO;

// Logger class
export class Logger {
  static formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] [VU ${__VU}] ${message}`;
    return data ? `${formattedMessage} ${JSON.stringify(data)}` : formattedMessage;
  }

  static debug(message, data = null) {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, data));
    }
  }

  static info(message, data = null) {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.log(this.formatMessage('INFO', message, data));
    }
  }

  static warn(message, data = null) {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  static error(message, data = null) {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message, data));
    }
  }

  static logMetric(metricName, value) {
    this.debug(`Metric: ${metricName} = ${value}`);
  }

  static logResponse(response, requestName) {
    this.debug(`${requestName} Response:`, {
      status: response.status,
      duration: response.timings.duration,
      body: response.body,
    });
  }

  static logError(error, context = null) {
    this.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  static logThreshold(thresholdName, value, limit) {
    this.warn(`Threshold ${thresholdName} exceeded: ${value} > ${limit}`);
  }
}

// Export logger instance
export const logger = Logger; 