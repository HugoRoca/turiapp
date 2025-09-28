/* eslint-disable max-len */
const Router = require('koa-router');
const jwt = require('koa-jwt');
const CommentController = require('../controllers/CommentController');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Operaciones relacionadas con comentarios
 */

const router = new Router({
  prefix: '/api/comments',
});

const commentController = new CommentController();

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
 * /api/comments:
 *   post:
 *     summary: Crear nuevo comentario
 *     description: Crea un nuevo comentario en una reseña
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComment'
 *           examples:
 *             example1:
 *               summary: Comentario básico
 *               value:
 *                 review_id: 1
 *                 content: "Estoy de acuerdo con tu reseña, la comida realmente estuvo excelente."
 *             example2:
 *               summary: Respuesta a comentario
 *               value:
 *                 review_id: 1
 *                 content: "Gracias por tu comentario, me alegra saber que también disfrutaste la experiencia."
 *                 parent_id: 1
 *     responses:
 *       200:
 *         description: Comentario creado exitosamente
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
 *                   description: ID del comentario creado
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
  await commentController.createComment(ctx);
});

/**
 * @swagger
 * /api/comments/recent:
 *   get:
 *     summary: Obtener comentarios recientes
 *     description: Retorna los comentarios más recientes del sistema
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de comentarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de comentarios a omitir
 *     responses:
 *       200:
 *         description: Comentarios recientes obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/recent', async (ctx) => {
  await commentController.getRecentComments(ctx);
});

/**
 * @swagger
 * /api/comments/search:
 *   get:
 *     summary: Buscar comentarios
 *     description: Busca comentarios por contenido
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Término de búsqueda
 *         example: excelente
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de comentarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de comentarios a omitir
 *     responses:
 *       200:
 *         description: Búsqueda de comentarios completada exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/search', async (ctx) => {
  await commentController.searchComments(ctx);
});

/**
 * @swagger
 * /api/comments/review/{reviewId}:
 *   get:
 *     summary: Obtener comentarios de una reseña
 *     description: Retorna todos los comentarios de una reseña específica
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la reseña
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de comentarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de comentarios a omitir
 *     responses:
 *       200:
 *         description: Comentarios de la reseña obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/review/:reviewId', async (ctx) => {
  await commentController.getCommentsByReview(ctx);
});

/**
 * @swagger
 * /api/comments/review/{reviewId}/with-replies:
 *   get:
 *     summary: Obtener comentarios con respuestas
 *     description: Retorna comentarios de una reseña con sus respuestas anidadas
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la reseña
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de comentarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de comentarios a omitir
 *     responses:
 *       200:
 *         description: Comentarios con respuestas obtenidos exitosamente
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
 *                       - $ref: '#/components/schemas/Comment'
 *                       - type: object
 *                         properties:
 *                           replies:
 *                             type: array
 *                             items:
 *                               $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/review/:reviewId/with-replies', async (ctx) => {
  await commentController.getCommentsWithReplies(ctx);
});

/**
 * @swagger
 * /api/comments/review/{reviewId}/count:
 *   get:
 *     summary: Obtener contador de comentarios de una reseña
 *     description: Retorna el número total de comentarios de una reseña
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la reseña
 *         example: 1
 *     responses:
 *       200:
 *         description: Contador de comentarios obtenido exitosamente
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
 *                   description: Número total de comentarios
 *                   example: 5
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/review/:reviewId/count', async (ctx) => {
  await commentController.getCommentCountByReview(ctx);
});

/**
 * @swagger
 * /api/comments/review/{reviewId}/can-comment:
 *   get:
 *     summary: Verificar si el usuario puede comentar en una reseña
 *     description: Verifica si el usuario actual puede crear un comentario en una reseña
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la reseña
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
 *                   description: Indica si el usuario puede comentar en la reseña
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/review/:reviewId/can-comment', async (ctx) => {
  await commentController.canUserCommentOnReview(ctx);
});

/**
 * @swagger
 * /api/comments/user/{userId}:
 *   get:
 *     summary: Obtener comentarios de un usuario
 *     description: Retorna todos los comentarios de un usuario específico
 *     tags: [Comments]
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
 *         description: Número máximo de comentarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de comentarios a omitir
 *     responses:
 *       200:
 *         description: Comentarios del usuario obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/user/:userId', async (ctx) => {
  await commentController.getUserComments(ctx);
});

/**
 * @swagger
 * /api/comments/user/{userId}/stats:
 *   get:
 *     summary: Obtener estadísticas de comentarios de un usuario
 *     description: Retorna estadísticas detalladas de los comentarios de un usuario
 *     tags: [Comments]
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
 *         description: Estadísticas de comentarios del usuario obtenidas exitosamente
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
 *                     total_comments:
 *                       type: integer
 *                     top_level_comments:
 *                       type: integer
 *                     reply_comments:
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
  await commentController.getUserCommentStats(ctx);
});

/**
 * @swagger
 * /api/comments/my:
 *   get:
 *     summary: Obtener mis comentarios
 *     description: Retorna los comentarios del usuario actual
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de comentarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de comentarios a omitir
 *     responses:
 *       200:
 *         description: Mis comentarios obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my', async (ctx) => {
  await commentController.getMyComments(ctx);
});

/**
 * @swagger
 * /api/comments/my/stats:
 *   get:
 *     summary: Obtener mis estadísticas de comentarios
 *     description: Retorna las estadísticas de comentarios del usuario actual
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Mis estadísticas de comentarios obtenidas exitosamente
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
 *                     total_comments:
 *                       type: integer
 *                     top_level_comments:
 *                       type: integer
 *                     reply_comments:
 *                       type: integer
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/my/stats', async (ctx) => {
  await commentController.getMyCommentStats(ctx);
});

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Obtener comentario por ID
 *     description: Retorna un comentario específico por su ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del comentario
 *         example: 1
 *     responses:
 *       200:
 *         description: Comentario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
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
  await commentController.getCommentById(ctx);
});

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Actualizar comentario
 *     description: Actualiza un comentario existente
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del comentario a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateComment'
 *           examples:
 *             example1:
 *               summary: Actualización básica
 *               value:
 *                 content: "Estoy de acuerdo con tu reseña, la comida realmente estuvo excelente. También me gustó mucho el ambiente."
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
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
  await commentController.updateComment(ctx);
});

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Eliminar comentario
 *     description: Elimina un comentario del sistema
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del comentario a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
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
  await commentController.deleteComment(ctx);
});

/**
 * @swagger
 * /api/comments/{id}/replies:
 *   get:
 *     summary: Obtener respuestas de un comentario
 *     description: Retorna las respuestas de un comentario específico
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del comentario padre
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número máximo de respuestas a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de respuestas a omitir
 *     responses:
 *       200:
 *         description: Respuestas del comentario obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/replies', async (ctx) => {
  await commentController.getCommentReplies(ctx);
});

/**
 * @swagger
 * /api/comments/{id}/thread:
 *   get:
 *     summary: Obtener hilo completo de comentarios
 *     description: Retorna el hilo completo de comentarios incluyendo respuestas anidadas
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del comentario raíz
 *         example: 1
 *     responses:
 *       200:
 *         description: Hilo de comentarios obtenido exitosamente
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
 *                       - $ref: '#/components/schemas/Comment'
 *                       - type: object
 *                         properties:
 *                           level:
 *                             type: integer
 *                             description: Nivel de anidamiento del comentario
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/thread', async (ctx) => {
  await commentController.getCommentThread(ctx);
});

/**
 * @swagger
 * /api/comments/{id}/moderate:
 *   post:
 *     summary: Moderar comentario (Admin)
 *     description: Permite a los administradores moderar comentarios
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del comentario a moderar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [hide, show, delete]
 *                 description: Acción a realizar
 *             required:
 *               - action
 *           examples:
 *             example1:
 *               summary: Ocultar comentario
 *               value:
 *                 action: "hide"
 *             example2:
 *               summary: Mostrar comentario
 *               value:
 *                 action: "show"
 *             example3:
 *               summary: Eliminar comentario
 *               value:
 *                 action: "delete"
 *     responses:
 *       200:
 *         description: Comentario moderado exitosamente
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
 *                   description: Indica si la moderación fue exitosa
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
router.post('/:id/moderate', jwtMiddleware, async (ctx) => {
  await commentController.moderateComment(ctx);
});

module.exports = router;
