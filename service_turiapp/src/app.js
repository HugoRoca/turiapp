const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const { testConnection } = require('./config/database');
const { specs, swaggerMiddleware } = require('./config/swagger');
const appLogger = require('./utils/logger');

const app = new Koa();
const PORT = process.env.PORT || 3000;

// Test database connection on startup
testConnection();

// Middleware
app.use(errorHandler);
app.use(requestLogger);
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser({
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb',
}));

// Swagger JSON endpoint
app.use(async (ctx, next) => {
  if (ctx.path === '/swagger.json') {
    ctx.body = specs;
    return;
  }
  await next();
});

// Swagger UI
app.use(swaggerMiddleware);

// Routes
app.use(routes.routes(), routes.allowedMethods());

// Start server
const server = app.listen(PORT, () => {
  appLogger.info(`🚀 TuriApp API Server started on port ${PORT}`);
  appLogger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  appLogger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  appLogger.info(`📖 API docs: http://localhost:${PORT}/api`);
  appLogger.info(`📚 Swagger UI: http://localhost:${PORT}/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  appLogger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    appLogger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  appLogger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    appLogger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = app;
