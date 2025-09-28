/* eslint-disable max-len */
const Router = require('koa-router');
const jwt = require('koa-jwt');
const ReviewController = require('../controllers/ReviewController');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Operaciones relacionadas con reseñas
 */

const router = new Router({
  prefix: '/api/reviews',
});

const reviewController = new ReviewController();

// Middleware JWT para rutas protegidas
const jwtMiddleware = jwt({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  key: 'user',
  passthrough: false,
});

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
 * /api/reviews:
 *   post:
 *     summary: Crear nueva reseña
 *     description: Crea una nueva reseña para un lugar
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReview'
 *           examples:
 *             example1:
 *               summary: Reseña básica
 *               value:
 *                 place_id: 1
 *                 rating: 5
 *                 title: "Excelente experiencia"
 *                 content: "La comida estuvo deliciosa y el servicio fue excepcional. Definitivamente volveré."
 *                 images: ["https://example.com/photo1.jpg"]
 *     responses:
 *       200:
 *         description: Reseña creada exitosamente
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
 *                   description: ID de la reseña creada
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', jwtMiddleware, async (ctx) => {
  await reviewController.createReview(ctx);
});

/**
 * @swagger
 * /api/reviews/recent:
 *   get:
 *     summary: Obtener reseñas recientes
 *     description: Retorna las reseñas más recientes del sistema
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de reseñas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de reseñas a omitir
 *     responses:
 *       200:
 *         description: Reseñas recientes obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/recent', async (ctx) => {
  await reviewController.getRecentReviews(ctx);
});

/**
 * @swagger
 * /api/reviews/top-rated:
 *   get:
 *     summary: Obtener reseñas mejor calificadas
 *     description: Retorna las reseñas con mejor calificación del sistema
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de reseñas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de reseñas a omitir
 *     responses:
 *       200:
 *         description: Reseñas mejor calificadas obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/top-rated', async (ctx) => {
  await reviewController.getTopRatedReviews(ctx);
});

/**
 * @swagger
 * /api/reviews/rating/{rating}:
 *   get:
 *     summary: Obtener reseñas por calificación
 *     description: Retorna reseñas de una calificación específica
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: rating
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Calificación de la reseña
 *         example: 5
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de reseñas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de reseñas a omitir
 *     responses:
 *       200:
 *         description: Reseñas por calificación obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/rating/:rating', async (ctx) => {
  await reviewController.getReviewsByRating(ctx);
});

/**
 * @swagger
 * /api/reviews/search:
 *   get:
 *     summary: Buscar reseñas
 *     description: Busca reseñas por título, contenido o nombre del lugar
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Término de búsqueda
 *         example: excelente comida
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de reseñas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de reseñas a omitir
 *     responses:
 *       200:
 *         description: Búsqueda de reseñas completada exitosamente
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
 *                     $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/search', async (ctx) => {
  await reviewController.searchReviews(ctx);
});

/**
 * @swagger
 * /api/reviews/place/{placeId}:
 *   get:
 *     summary: Obtener reseñas de un lugar
 *     description: Retorna todas las reseñas de un lugar específico
 *     tags: [Reviews]
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
 *           default: 10
 *         description: Número máximo de reseñas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de reseñas a omitir
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filtrar por calificación específica
 *     responses:
 *       200:
 *         description: Reseñas del lugar obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/place/:placeId', async (ctx) => {
  await reviewController.getPlaceReviews(ctx);
});

/**
 * @swagger
 * /api/reviews/place/{placeId}/stats:
 *   get:
 *     summary: Obtener estadísticas de reseñas de un lugar
 *     description: Retorna estadísticas detalladas de las reseñas de un lugar
 *     tags: [Reviews]
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
 *         description: Estadísticas de reseñas obtenidas exitosamente
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
 *                     total_reviews:
 *                       type: integer
 *                     average_rating:
 *                       type: number
 *                     five_star:
 *                       type: integer
 *                     four_star:
 *                       type: integer
 *                     three_star:
 *                       type: integer
 *                     two_star:
 *                       type: integer
 *                     one_star:
 *                       type: integer
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/place/:placeId/stats', async (ctx) => {
  await reviewController.getReviewStats(ctx);
});

/**
 * @swagger
 * /api/reviews/place/{placeId}/can-review:
 *   get:
 *     summary: Verificar si el usuario puede reseñar un lugar
 *     description: Verifica si el usuario actual puede crear una reseña para un lugar
 *     tags: [Reviews]
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
 *                   description: Indica si el usuario puede reseñar el lugar
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/place/:placeId/can-review', jwtMiddleware, async (ctx) => {
  await reviewController.canUserReviewPlace(ctx);
});

/**
 * @swagger
 * /api/reviews/user/{userId}:
 *   get:
 *     summary: Obtener reseñas de un usuario
 *     description: Retorna todas las reseñas de un usuario específico
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de reseñas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de reseñas a omitir
 *     responses:
 *       200:
 *         description: Reseñas del usuario obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/user/:userId', async (ctx) => {
  await reviewController.getUserReviews(ctx);
});

/**
 * @swagger
 * /api/reviews/user/{userId}/stats:
 *   get:
 *     summary: Obtener estadísticas de reseñas de un usuario
 *     description: Retorna estadísticas detalladas de las reseñas de un usuario
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Estadísticas de reseñas del usuario obtenidas exitosamente
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
 *                     total_reviews:
 *                       type: integer
 *                     average_rating_given:
 *                       type: number
 *                     five_star_given:
 *                       type: integer
 *                     four_star_given:
 *                       type: integer
 *                     three_star_given:
 *                       type: integer
 *                     two_star_given:
 *                       type: integer
 *                     one_star_given:
 *                       type: integer
 *                     total_helpful_received:
 *                       type: integer
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/user/:userId/stats', async (ctx) => {
  await reviewController.getUserReviewStats(ctx);
});

/**
 * @swagger
 * /api/reviews/my:
 *   get:
 *     summary: Obtener mis reseñas
 *     description: Retorna las reseñas del usuario actual
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de reseñas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de reseñas a omitir
 *     responses:
 *       200:
 *         description: Mis reseñas obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my', jwtMiddleware, async (ctx) => {
  await reviewController.getMyReviews(ctx);
});

/**
 * @swagger
 * /api/reviews/my/stats:
 *   get:
 *     summary: Obtener mis estadísticas de reseñas
 *     description: Retorna las estadísticas de reseñas del usuario actual
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Mis estadísticas de reseñas obtenidas exitosamente
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
 *                     total_reviews:
 *                       type: integer
 *                     average_rating_given:
 *                       type: number
 *                     five_star_given:
 *                       type: integer
 *                     four_star_given:
 *                       type: integer
 *                     three_star_given:
 *                       type: integer
 *                     two_star_given:
 *                       type: integer
 *                     one_star_given:
 *                       type: integer
 *                     total_helpful_received:
 *                       type: integer
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/stats', jwtMiddleware, async (ctx) => {
  await reviewController.getMyReviewStats(ctx);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Obtener reseña por ID
 *     description: Retorna una reseña específica por su ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la reseña
 *         example: 1
 *     responses:
 *       200:
 *         description: Reseña encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', async (ctx) => {
  await reviewController.getReviewById(ctx);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Actualizar reseña
 *     description: Actualiza una reseña existente
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la reseña a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReview'
 *           examples:
 *             example1:
 *               summary: Actualización básica
 *               value:
 *                 rating: 4
 *                 title: "Muy buena experiencia"
 *                 content: "La comida estuvo muy buena, aunque el servicio podría mejorar un poco."
 *     responses:
 *       200:
 *         description: Reseña actualizada exitosamente
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
 *                   description: Indica si la actualización fue exitosa
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', jwtMiddleware, async (ctx) => {
  await reviewController.updateReview(ctx);
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Eliminar reseña
 *     description: Elimina una reseña del sistema
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la reseña a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Reseña eliminada exitosamente
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
 *                   description: Indica si la eliminación fue exitosa
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', jwtMiddleware, async (ctx) => {
  await reviewController.deleteReview(ctx);
});

/**
 * @swagger
 * /api/reviews/{id}/helpful:
 *   post:
 *     summary: Marcar reseña como útil
 *     description: Marca una reseña como útil
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la reseña
 *         example: 1
 *     responses:
 *       200:
 *         description: Reseña marcada como útil exitosamente
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/:id/helpful', jwtMiddleware, async (ctx) => {
  await reviewController.markReviewHelpful(ctx);
});

/**
 * @swagger
 * /api/reviews/{id}/helpful:
 *   get:
 *     summary: Obtener contador de votos útiles
 *     description: Retorna el número de votos útiles de una reseña
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la reseña
 *         example: 1
 *     responses:
 *       200:
 *         description: Contador de votos útiles obtenido exitosamente
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
 *                   description: Número de votos útiles
 *                   example: 15
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/helpful', async (ctx) => {
  await reviewController.getReviewHelpfulCount(ctx);
});

/**
 * @swagger
 * /api/reviews/{id}/helpful/check:
 *   get:
 *     summary: Verificar si el usuario marcó la reseña como útil
 *     description: Verifica si el usuario actual marcó una reseña como útil
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la reseña
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
 *                   description: Indica si el usuario marcó la reseña como útil
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/helpful/check', jwtMiddleware, async (ctx) => {
  await reviewController.hasUserMarkedHelpful(ctx);
});

module.exports = router;
