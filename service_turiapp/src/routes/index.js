const Router = require('koa-router');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const placeRoutes = require('./placeRoutes');
const reviewRoutes = require('./reviewRoutes');
const commentRoutes = require('./commentRoutes');
const categoryRoutes = require('./categoryRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Endpoints del sistema
 */

const router = new Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Verifica el estado de la API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/health', async (ctx) => {
  logger.info('Health check requested');
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'TuriApp API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };
});

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Información de la API
 *     description: Retorna información general sobre la API y sus endpoints disponibles
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Información de la API obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: TuriApp API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     health:
 *                       type: string
 *                       example: GET /health
 *                     users:
 *                       type: object
 *                       properties:
 *                         getAll:
 *                           type: string
 *                           example: GET /api/users
 *                         getById:
 *                           type: string
 *                           example: GET /api/users/:id
 *                         getByEmail:
 *                           type: string
 *                           example: GET /api/users/email?email=example@email.com
 *                         getActive:
 *                           type: string
 *                           example: GET /api/users/active
 *                         search:
 *                           type: string
 *                           example: GET /api/users/search?name=John
 *                         create:
 *                           type: string
 *                           example: POST /api/users
 *                         update:
 *                           type: string
 *                           example: PUT /api/users/:id
 *                         delete:
 *                           type: string
 *                           example: DELETE /api/users/:id
 */
router.get('/api', async (ctx) => {
  logger.info('API info requested');
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: 'TuriApp API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        verify: 'GET /api/auth/verify',
        me: 'GET /api/auth/me',
        changePassword: 'POST /api/auth/change-password',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password',
      },
      users: 'GET /api/users',
      places: 'GET /api/places',
      reviews: 'GET /api/reviews',
      comments: 'GET /api/comments',
      categories: 'GET /api/categories',
      favorites: 'GET /api/favorites',
      docs: 'GET /docs',
      swagger: 'GET /swagger.json',
    },
  };
});

// Mount all routes
router.use(authRoutes.routes(), authRoutes.allowedMethods());
router.use(userRoutes.routes(), userRoutes.allowedMethods());
router.use(placeRoutes.routes(), placeRoutes.allowedMethods());
router.use(reviewRoutes.routes(), reviewRoutes.allowedMethods());
router.use(commentRoutes.routes(), commentRoutes.allowedMethods());
router.use(categoryRoutes.routes(), categoryRoutes.allowedMethods());
router.use(favoriteRoutes.routes(), favoriteRoutes.allowedMethods());

// 404 handler
router.all('(.*)', async (ctx) => {
  logger.warn('Route not found', { path: ctx.path, method: ctx.method });
  ctx.status = 404;
  ctx.body = {
    success: false,
    error: 'Route not found',
    message: `The requested route ${ctx.method} ${ctx.path} was not found`,
  };
});

module.exports = router;
