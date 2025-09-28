const logger = require('../utils/logger');

const requestLogger = async (ctx, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  // Add request ID to context for tracking
  ctx.requestId = requestId;

  logger.info('Incoming request', {
    requestId,
    method: ctx.method,
    path: ctx.path,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent'),
    query: ctx.query,
    body: ctx.method !== 'GET' ? ctx.request.body : undefined,
  });

  await next();

  const duration = Date.now() - start;

  logger.info('Request completed', {
    requestId,
    method: ctx.method,
    path: ctx.path,
    status: ctx.status,
    duration: `${duration}ms`,
    responseSize: ctx.response.length || 0,
  });
};

module.exports = requestLogger;
