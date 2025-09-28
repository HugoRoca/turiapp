const logger = require('../utils/logger');

class BaseController {
  static async handleRequest(ctx, serviceMethod, ...args) {
    try {
      logger.info(`API Request: ${ctx.method} ${ctx.path}`, {
        ip: ctx.ip,
        userAgent: ctx.get('User-Agent'),
        body: ctx.request.body,
        query: ctx.query,
      });

      const result = await serviceMethod(...args);

      logger.info(`API Response: ${ctx.method} ${ctx.path}`, {
        status: 200,
        resultLength: Array.isArray(result) ? result.length : 1,
      });

      ctx.status = 200;
      ctx.body = {
        success: true,
        data: result,
        message: 'Request processed successfully',
      };
    } catch (error) {
      logger.error(`API Error: ${ctx.method} ${ctx.path}`, {
        error: error.message,
        stack: error.stack,
        ip: ctx.ip,
      });

      ctx.status = error.status || 500;
      ctx.body = {
        success: false,
        error: error.message,
        message: 'An error occurred while processing the request',
      };
    }
  }

  static validateRequest(ctx, schema) {
    const { error, value } = schema.validate(ctx.request.body);
    if (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Validation error',
        details: error.details.map((detail) => detail.message),
      };
      return false;
    }
    return value;
  }

  static sendSuccess(ctx, data, message = 'Success', status = 200) {
    ctx.status = status;
    ctx.body = {
      success: true,
      data,
      message,
    };
  }

  static sendError(ctx, error, message = 'An error occurred', status = 500) {
    ctx.status = status;
    ctx.body = {
      success: false,
      error: error.message || error,
      message,
    };
  }
}

module.exports = BaseController;
