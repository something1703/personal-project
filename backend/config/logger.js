const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');

// Transport for all logs
const allLogsTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat
});

// Transport for error logs
const errorLogsTransport = new DailyRotateFile({
    level: 'error',
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: logFormat
});

// Transport for audit logs
const auditLogsTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'audit-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '90d',
    format: logFormat
});

// Create logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'survey-tracking' },
    transports: [
        allLogsTransport,
        errorLogsTransport
    ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Create separate audit logger
const auditLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: { service: 'audit' },
    transports: [auditLogsTransport]
});

// Helper functions
const logError = (error, context = {}) => {
    logger.error(error.message, {
        stack: error.stack,
        ...context
    });
};

const logInfo = (message, meta = {}) => {
    logger.info(message, meta);
};

const logWarning = (message, meta = {}) => {
    logger.warn(message, meta);
};

const logDebug = (message, meta = {}) => {
    logger.debug(message, meta);
};

// Audit logging
const logAudit = (action, userId, details = {}) => {
    auditLogger.info('Audit Event', {
        action,
        userId,
        timestamp: new Date().toISOString(),
        ...details
    });
};

module.exports = {
    logger,
    auditLogger,
    logError,
    logInfo,
    logWarning,
    logDebug,
    logAudit
};
