// logger.console.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const consoleLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new DailyRotateFile({
            filename: 'logs/console-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    consoleLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Override console methods
console.log = consoleLogger.info.bind(consoleLogger);
console.info = consoleLogger.info.bind(consoleLogger);
console.warn = consoleLogger.warn.bind(consoleLogger);
console.error = consoleLogger.error.bind(consoleLogger);

module.exports = consoleLogger;