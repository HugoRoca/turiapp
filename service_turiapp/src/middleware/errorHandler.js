const logger = require('../utils/logger');

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error('Unhandled error:', {
      error: error.message,
      stack: error.stack,
      path: ctx.path,
      method: ctx.method,
      ip: ctx.ip,
    });

    // Set default error status
    ctx.status = error.status || 500;

    // Handle different types of errors
    if (error.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Validation Error',
        message: error.message,
        details: error.details,
      };
    } else if (error.name === 'CastError') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid ID format',
        message: 'The provided ID is not valid',
      };
    } else if (error.code === 'ER_DUP_ENTRY') {
      ctx.status = 409;
      ctx.body = {
        success: false,
        error: 'Duplicate Entry',
        message: 'A record with this information already exists',
      };
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Foreign Key Constraint',
        message: 'Referenced record does not exist',
      };
    } else {
      // Generic error response
      ctx.body = {
        success: false,
        error: process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : error.message,
        message: 'An unexpected error occurred',
      };
    }
  }
};

module.exports = errorHandler;
