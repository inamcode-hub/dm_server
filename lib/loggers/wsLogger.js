// logger.ws.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const wsLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new DailyRotateFile({
            filename: 'logs/ws-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    wsLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = wsLogger;