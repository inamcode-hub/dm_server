// logger.morgan.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const morganLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => info.message)
    ),
    transports: [
        new DailyRotateFile({
            filename: 'logs/morgan-combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    morganLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
module.exports = morganLogger;