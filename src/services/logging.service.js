const winston = require('winston');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      )
    }),
    // File transport for all logs
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log')
    }),
    // Separate file for error logs
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    })
  ]
});

// Create stream for Morgan to use Winston
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Configure Morgan format based on environment
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

const loggingService = {
  init: async () => {
    try {
      logger.info('[LOGGING] Logging service initialized');
      return {
        logger,
        morgan: morgan(morganFormat, { stream: morganStream })
      };
    } catch (error) {
      console.error('[LOGGING] Error during logging service initialization', error);
      throw error;
    }
  },
  getLogger: () => logger,
  
  // Specialized logging methods for common use cases
  logAPIRequest: (req, message) => {
    logger.info(`API ${req.method} ${req.originalUrl} - ${message}`, {
      userId: req.userId,
      ip: req.ip
    });
  },
  
  logValidationError: (errors, context) => {
    logger.warn(`Validation errors in ${context}:`, { errors });
  },
  
  logDatabaseOperation: (operation, model, result) => {
    logger.debug(`DB Operation: ${operation} on ${model}`, { result });
  }
};

module.exports = loggingService;
