const Router = require('koa-router');
const FavoriteController = require('../controllers/FavoriteController');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Operaciones relacionadas con favoritos
 */

const router = new Router({
  prefix: '/api/favorites',
});

const favoriteController = new FavoriteController();

// Apply logging middleware to all routes
router.use(async (ctx, next) => {
  const start = Date.now();
  logger.info(`Route accessed: ${ctx.method} ${ctx.path}`, {
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent'),
  });

  await next();

  const duration = Date.now() - start;
  logger.info(`Route completed: ${ctx.method} ${ctx.path}`, {
    status: ctx.status,
    duration: `${duration}ms`,
  });
});

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Agregar lugar a favoritos
 *     description: Agrega un lugar a los favoritos del usuario actual
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               place_id:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID del lugar a agregar a favoritos
 *             required:
 *               - place_id
 *           examples:
 *             example1:
 *               summary: Agregar lugar a favoritos
 *               value:
 *                 place_id: 1
 *     responses:
 *       200:
 *         description: Lugar agregado a favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   description: Indica si la operación fue exitosa
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', async (ctx) => {
  await favoriteController.addFavorite(ctx);
});

/**
 * @swagger
 * /api/favorites/bulk:
 *   post:
 *     summary: Agregar múltiples lugares a favoritos
 *     description: Agrega múltiples lugares a los favoritos del usuario actual
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *               minimum: 1
 *             minItems: 1
 *             maxItems: 50
 *           examples:
 *             example1:
 *               summary: Agregar múltiples lugares
 *               value: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: Lugares agregados a favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: integer
 *                       description: Número de lugares agregados exitosamente
 *                     failed:
 *                       type: integer
 *                       description: Número de lugares que fallaron
 *                     total:
 *                       type: integer
 *                       description: Total de lugares procesados
 *                     results:
 *                       type: array
 *                       description: Resultados detallados de cada operación
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/bulk', async (ctx) => {
  await favoriteController.bulkAddFavorites(ctx);
});

/**
 * @swagger
 * /api/favorites/bulk:
 *   delete:
 *     summary: Eliminar múltiples lugares de favoritos
 *     description: Elimina múltiples lugares de los favoritos del usuario actual
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *               minimum: 1
 *             minItems: 1
 *             maxItems: 50
 *           examples:
 *             example1:
 *               summary: Eliminar múltiples lugares
 *               value: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Lugares eliminados de favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: integer
 *                       description: Número de lugares eliminados exitosamente
 *                     failed:
 *                       type: integer
 *                       description: Número de lugares que fallaron
 *                     total:
 *                       type: integer
 *                       description: Total de lugares procesados
 *                     results:
 *                       type: array
 *                       description: Resultados detallados de cada operación
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/bulk', async (ctx) => {
  await favoriteController.bulkRemoveFavorites(ctx);
});

/**
 * @swagger
 * /api/favorites/my:
 *   get:
 *     summary: Obtener mis favoritos
 *     description: Retorna los lugares favoritos del usuario actual
 *     tags: [Favorites]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de favoritos a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de favoritos a omitir
 *     responses:
 *       200:
 *         description: Favoritos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Place'
 *                       - type: object
 *                         properties:
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             description: Fecha cuando se agregó a favoritos
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my', async (ctx) => {
  await favoriteController.getMyFavorites(ctx);
});

/**
 * @swagger
 * /api/favorites/my/count:
 *   get:
 *     summary: Obtener contador de mis favoritos
 *     description: Retorna el número total de favoritos del usuario actual
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Contador de favoritos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: integer
 *                   description: Número total de favoritos
 *                   example: 15
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/count', async (ctx) => {
  await favoriteController.getMyFavoriteCount(ctx);
});

/**
 * @swagger
 * /api/favorites/my/stats:
 *   get:
 *     summary: Obtener estadísticas de mis favoritos
 *     description: Retorna estadísticas detalladas de los favoritos del usuario actual
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Estadísticas de favoritos obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_favorites:
 *                       type: integer
 *                     favorite_categories:
 *                       type: integer
 *                     avg_rating_of_favorites:
 *                       type: number
 *                     free_favorites:
 *                       type: integer
 *                     low_price_favorites:
 *                       type: integer
 *                     medium_price_favorites:
 *                       type: integer
 *                     high_price_favorites:
 *                       type: integer
 *                     luxury_favorites:
 *                       type: integer
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/stats', async (ctx) => {
  await favoriteController.getMyFavoriteStats(ctx);
});

/**
 * @swagger
 * /api/favorites/my/summary:
 *   get:
 *     summary: Obtener resumen de mis favoritos
 *     description: Retorna un resumen completo de los favoritos del usuario actual
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Resumen de favoritos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_favorites:
 *                       type: integer
 *                     stats:
 *                       type: object
 *                       description: Estadísticas detalladas
 *                     recent_favorites:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Place'
 *                       description: Favoritos recientes
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/summary', async (ctx) => {
  await favoriteController.getFavoriteSummary(ctx);
});

/**
 * @swagger
 * /api/favorites/my/search:
 *   get:
 *     summary: Buscar en mis favoritos
 *     description: Busca lugares en los favoritos del usuario actual
 *     tags: [Favorites]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Término de búsqueda
 *         example: restaurante
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de favoritos a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de favoritos a omitir
 *     responses:
 *       200:
 *         description: Búsqueda en favoritos completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Place'
 *                       - type: object
 *                         properties:
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/search', async (ctx) => {
  await favoriteController.searchMyFavorites(ctx);
});

/**
 * @swagger
 * /api/favorites/my/category/{categoryId}:
 *   get:
 *     summary: Obtener mis favoritos por categoría
 *     description: Retorna los favoritos del usuario actual filtrados por categoría
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la categoría
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de favoritos a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de favoritos a omitir
 *     responses:
 *       200:
 *         description: Favoritos por categoría obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Place'
 *                       - type: object
 *                         properties:
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/category/:categoryId', async (ctx) => {
  await favoriteController.getMyFavoritesByCategory(ctx);
});

/**
 * @swagger
 * /api/favorites/my/price/{priceRange}:
 *   get:
 *     summary: Obtener mis favoritos por rango de precio
 *     description: Retorna los favoritos del usuario actual filtrados por rango de precio
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: priceRange
 *         required: true
 *         schema:
 *           type: string
 *           enum: [free, low, medium, high, luxury]
 *         description: Rango de precio
 *         example: medium
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de favoritos a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de favoritos a omitir
 *     responses:
 *       200:
 *         description: Favoritos por rango de precio obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Place'
 *                       - type: object
 *                         properties:
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/price/:priceRange', async (ctx) => {
  await favoriteController.getMyFavoritesByPriceRange(ctx);
});

/**
 * @swagger
 * /api/favorites/place/{placeId}:
 *   get:
 *     summary: Obtener usuarios que marcaron un lugar como favorito
 *     description: Retorna los usuarios que marcaron un lugar específico como favorito
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del lugar
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de usuarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de usuarios a omitir
 *     responses:
 *       200:
 *         description: Usuarios que marcaron el lugar como favorito obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       avatar_url:
 *                         type: string
 *                       is_verified:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/place/:placeId', async (ctx) => {
  await favoriteController.getPlaceFavorites(ctx);
});

/**
 * @swagger
 * /api/favorites/place/{placeId}/count:
 *   get:
 *     summary: Obtener contador de favoritos de un lugar
 *     description: Retorna el número total de usuarios que marcaron un lugar como favorito
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del lugar
 *         example: 1
 *     responses:
 *       200:
 *         description: Contador de favoritos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: integer
 *                   description: Número total de favoritos
 *                   example: 25
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/place/:placeId/count', async (ctx) => {
  await favoriteController.getPlaceFavoriteCount(ctx);
});

/**
 * @swagger
 * /api/favorites/place/{placeId}:
 *   delete:
 *     summary: Eliminar lugar de favoritos
 *     description: Elimina un lugar de los favoritos del usuario actual
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del lugar a eliminar de favoritos
 *         example: 1
 *     responses:
 *       200:
 *         description: Lugar eliminado de favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   description: Indica si la operación fue exitosa
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/place/:placeId', async (ctx) => {
  await favoriteController.removeFavorite(ctx);
});

/**
 * @swagger
 * /api/favorites/place/{placeId}/toggle:
 *   post:
 *     summary: Alternar favorito
 *     description: Alterna el estado de favorito de un lugar (agregar si no está, eliminar si está)
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del lugar
 *         example: 1
 *     responses:
 *       200:
 *         description: Estado de favorito alternado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavorite:
 *                       type: boolean
 *                       description: Estado actual del favorito
 *                     action:
 *                       type: string
 *                       enum: [added, removed]
 *                       description: Acción realizada
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/place/:placeId/toggle', async (ctx) => {
  await favoriteController.toggleFavorite(ctx);
});

/**
 * @swagger
 * /api/favorites/place/{placeId}/check:
 *   get:
 *     summary: Verificar si un lugar es favorito
 *     description: Verifica si un lugar específico está en los favoritos del usuario actual
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del lugar
 *         example: 1
 *     responses:
 *       200:
 *         description: Verificación completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   description: Indica si el lugar es favorito
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/place/:placeId/check', async (ctx) => {
  await favoriteController.isFavorite(ctx);
});

/**
 * @swagger
 * /api/favorites/most-favorited:
 *   get:
 *     summary: Obtener lugares más favoritos
 *     description: Retorna los lugares más marcados como favoritos en el sistema
 *     tags: [Favorites]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de lugares a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de lugares a omitir
 *     responses:
 *       200:
 *         description: Lugares más favoritos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Place'
 *                       - type: object
 *                         properties:
 *                           favorite_count:
 *                             type: integer
 *                             description: Número de veces marcado como favorito
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/most-favorited', async (ctx) => {
  await favoriteController.getMostFavoritedPlaces(ctx);
});

module.exports = router;
