const winston = require('winston');
require('dotenv').config();

const {
  combine, timestamp, printf, colorize,
} = winston.format;

// Custom format for console output
const consoleFormat = printf(({
  level, message, timestamp: ts, ...meta
}) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
  return `${ts} [${level}]: ${message} ${metaStr}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    consoleFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        consoleFormat,
      ),
    }),
  ],
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }));
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
  }));
}

module.exports = logger;
