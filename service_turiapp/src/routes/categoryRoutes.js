const Router = require('koa-router');
const jwt = require('koa-jwt');
const CategoryController = require('../controllers/CategoryController');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Operaciones relacionadas con categorías
 */

const router = new Router({
  prefix: '/api/categories',
});

const categoryController = new CategoryController();

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
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     description: Retorna una lista de todas las categorías activas
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', async (ctx) => {
  await categoryController.getAllCategories(ctx);
});

/**
 * @swagger
 * /api/categories/parents:
 *   get:
 *     summary: Obtener categorías padre
 *     description: Retorna solo las categorías padre (sin subcategorías)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categorías padre obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/parents', async (ctx) => {
  await categoryController.getParentCategories(ctx);
});

/**
 * @swagger
 * /api/categories/hierarchy:
 *   get:
 *     summary: Obtener jerarquía de categorías
 *     description: Retorna la jerarquía completa de categorías con conteos de lugares
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Jerarquía de categorías obtenida exitosamente
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
 *                       - $ref: '#/components/schemas/Category'
 *                       - type: object
 *                         properties:
 *                           place_count:
 *                             type: integer
 *                             description: Número de lugares en esta categoría
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/hierarchy', async (ctx) => {
  await categoryController.getCategoryHierarchy(ctx);
});

/**
 * @swagger
 * /api/categories/tree:
 *   get:
 *     summary: Obtener árbol de categorías
 *     description: Retorna el árbol completo de categorías con subcategorías anidadas
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Árbol de categorías obtenido exitosamente
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
 *                       - $ref: '#/components/schemas/Category'
 *                       - type: object
 *                         properties:
 *                           subcategories:
 *                             type: array
 *                             items:
 *                               $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/tree', async (ctx) => {
  await categoryController.getCategoryTree(ctx);
});

/**
 * @swagger
 * /api/categories/with-places:
 *   get:
 *     summary: Obtener categorías con conteo de lugares
 *     description: Retorna categorías con el número de lugares asociados
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categorías con conteo de lugares obtenidas exitosamente
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
 *                       - $ref: '#/components/schemas/Category'
 *                       - type: object
 *                         properties:
 *                           place_count:
 *                             type: integer
 *                             description: Número de lugares en esta categoría
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/with-places', async (ctx) => {
  await categoryController.getCategoriesWithPlaceCount(ctx);
});

/**
 * @swagger
 * /api/categories/popular:
 *   get:
 *     summary: Obtener categorías populares
 *     description: Retorna las categorías más populares basadas en el número de lugares
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Número máximo de categorías a retornar
 *     responses:
 *       200:
 *         description: Categorías populares obtenidas exitosamente
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
 *                       - $ref: '#/components/schemas/Category'
 *                       - type: object
 *                         properties:
 *                           place_count:
 *                             type: integer
 *                           avg_rating:
 *                             type: number
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/popular', async (ctx) => {
  await categoryController.getPopularCategories(ctx);
});

/**
 * @swagger
 * /api/categories/search:
 *   get:
 *     summary: Buscar categorías
 *     description: Busca categorías por nombre o descripción
 *     tags: [Categories]
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
 *           maximum: 50
 *           default: 20
 *         description: Número máximo de categorías a retornar
 *     responses:
 *       200:
 *         description: Búsqueda de categorías completada exitosamente
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
 *                       - $ref: '#/components/schemas/Category'
 *                       - type: object
 *                         properties:
 *                           place_count:
 *                             type: integer
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/search', async (ctx) => {
  await categoryController.searchCategories(ctx);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     description: Retorna una categoría específica por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la categoría
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
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
  await categoryController.getCategoryById(ctx);
});

/**
 * @swagger
 * /api/categories/{id}/with-subcategories:
 *   get:
 *     summary: Obtener categoría con subcategorías
 *     description: Retorna una categoría con todas sus subcategorías
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la categoría
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría con subcategorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Category'
 *                     - type: object
 *                       properties:
 *                         subcategories:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
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
router.get('/:id/with-subcategories', async (ctx) => {
  await categoryController.getCategoryWithSubcategories(ctx);
});

/**
 * @swagger
 * /api/categories/{id}/subcategories:
 *   get:
 *     summary: Obtener subcategorías
 *     description: Retorna las subcategorías de una categoría específica
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la categoría padre
 *         example: 1
 *     responses:
 *       200:
 *         description: Subcategorías obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/subcategories', async (ctx) => {
  await categoryController.getSubcategories(ctx);
});

/**
 * @swagger
 * /api/categories/{id}/stats:
 *   get:
 *     summary: Obtener estadísticas de la categoría
 *     description: Retorna estadísticas detalladas de una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la categoría
 *         example: 1
 *     responses:
 *       200:
 *         description: Estadísticas de la categoría obtenidas exitosamente
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
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     total_places:
 *                       type: integer
 *                     verified_places:
 *                       type: integer
 *                     featured_places:
 *                       type: integer
 *                     avg_rating:
 *                       type: number
 *                     total_reviews:
 *                       type: integer
 *                     total_visits:
 *                       type: integer
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
router.get('/:id/stats', async (ctx) => {
  await categoryController.getCategoryStats(ctx);
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear nueva categoría
 *     description: Crea una nueva categoría en el sistema
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *           examples:
 *             example1:
 *               summary: Categoría básica
 *               value:
 *                 name: "Restaurantes"
 *                 description: "Lugares para comer y beber"
 *                 icon_url: "🍽️"
 *                 color_code: "#FF6B6B"
 *                 sort_order: 1
 *             example2:
 *               summary: Subcategoría
 *               value:
 *                 name: "Comida Rápida"
 *                 description: "Restaurantes de comida rápida"
 *                 parent_id: 1
 *                 sort_order: 1
 *     responses:
 *       200:
 *         description: Categoría creada exitosamente
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
 *                   description: ID de la categoría creada
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
  await categoryController.createCategory(ctx);
});

/**
 * @swagger
 * /api/categories/{parentId}/subcategories:
 *   post:
 *     summary: Crear subcategoría
 *     description: Crea una nueva subcategoría bajo una categoría padre
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la categoría padre
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *           examples:
 *             example1:
 *               summary: Subcategoría básica
 *               value:
 *                 name: "Comida Rápida"
 *                 description: "Restaurantes de comida rápida"
 *                 icon_url: "🍔"
 *                 color_code: "#FFA500"
 *                 sort_order: 1
 *     responses:
 *       200:
 *         description: Subcategoría creada exitosamente
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
 *                   description: ID de la subcategoría creada
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/:parentId/subcategories', jwtMiddleware, async (ctx) => {
  await categoryController.createSubcategory(ctx);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar categoría
 *     description: Actualiza la información de una categoría existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la categoría a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *           examples:
 *             example1:
 *               summary: Actualización básica
 *               value:
 *                 name: "Restaurantes y Bares"
 *                 description: "Lugares para comer, beber y socializar"
 *                 color_code: "#FF6B6B"
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
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
  await categoryController.updateCategory(ctx);
});

/**
 * @swagger
 * /api/categories/{id}/sort-order:
 *   put:
 *     summary: Actualizar orden de categoría
 *     description: Actualiza el orden de una categoría específica
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la categoría
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *                 description: Nuevo orden de la categoría
 *             required:
 *               - sortOrder
 *           examples:
 *             example1:
 *               summary: Cambiar orden
 *               value:
 *                 sortOrder: 5
 *     responses:
 *       200:
 *         description: Orden de categoría actualizado exitosamente
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
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id/sort-order', jwtMiddleware, async (ctx) => {
  await categoryController.updateCategorySortOrder(ctx);
});

/**
 * @swagger
 * /api/categories/reorder:
 *   put:
 *     summary: Reordenar categorías
 *     description: Reordena múltiples categorías de una vez
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 categoryId:
 *                   type: integer
 *                   minimum: 1
 *                 sortOrder:
 *                   type: integer
 *                   minimum: 0
 *               required:
 *                 - categoryId
 *                 - sortOrder
 *           examples:
 *             example1:
 *               summary: Reordenar múltiples categorías
 *               value:
 *                 - categoryId: 1
 *                   sortOrder: 3
 *                 - categoryId: 2
 *                   sortOrder: 1
 *                 - categoryId: 3
 *                   sortOrder: 2
 *     responses:
 *       200:
 *         description: Categorías reordenadas exitosamente
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
 *                   description: Indica si el reordenamiento fue exitoso
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/reorder', jwtMiddleware, async (ctx) => {
  await categoryController.reorderCategories(ctx);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar categoría
 *     description: Elimina una categoría del sistema (solo si no tiene lugares ni subcategorías)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único de la categoría a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
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
  await categoryController.deleteCategory(ctx);
});

module.exports = router;
