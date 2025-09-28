const Router = require('koa-router');
const jwt = require('koa-jwt');
const PlaceController = require('../controllers/PlaceController');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Places
 *   description: Operaciones relacionadas con lugares
 */

const router = new Router({
  prefix: '/api/places',
});

const placeController = new PlaceController();

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
 * /api/places:
 *   get:
 *     summary: Obtener todos los lugares
 *     description: Retorna una lista de todos los lugares en el sistema
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar lugares por estado activo
 *       - in: query
 *         name: is_verified
 *         schema:
 *           type: boolean
 *         description: Filtrar lugares por estado verificado
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *         description: Filtrar lugares destacados
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número máximo de lugares a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de lugares a omitir
 *     responses:
 *       200:
 *         description: Lista de lugares obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Place'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', async (ctx) => {
  await placeController.getAllPlaces(ctx);
});

/**
 * @swagger
 * /api/places/nearby:
 *   get:
 *     summary: Obtener lugares cercanos
 *     description: Retorna lugares cercanos a una ubicación específica
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitud de la ubicación
 *         example: 40.4168
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitud de la ubicación
 *         example: -3.7038
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           format: float
 *           default: 10
 *         description: Radio de búsqueda en kilómetros
 *         example: 5
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Número máximo de lugares a retornar
 *     responses:
 *       200:
 *         description: Lugares cercanos obtenidos exitosamente
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
 *                           distance_km:
 *                             type: number
 *                             description: Distancia en kilómetros
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/nearby', async (ctx) => {
  await placeController.getNearbyPlaces(ctx);
});

/**
 * @swagger
 * /api/places/popular:
 *   get:
 *     summary: Obtener lugares populares
 *     description: Retorna los lugares más populares del sistema
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Número máximo de lugares a retornar
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría específica
 *     responses:
 *       200:
 *         description: Lugares populares obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Place'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/popular', async (ctx) => {
  await placeController.getPopularPlaces(ctx);
});

/**
 * @swagger
 * /api/places/featured:
 *   get:
 *     summary: Obtener lugares destacados
 *     description: Retorna los lugares destacados del sistema
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Número máximo de lugares a retornar
 *     responses:
 *       200:
 *         description: Lugares destacados obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Place'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/featured', async (ctx) => {
  await placeController.getFeaturedPlaces(ctx);
});

/**
 * @swagger
 * /api/places/verified:
 *   get:
 *     summary: Obtener lugares verificados
 *     description: Retorna los lugares verificados del sistema
 *     tags: [Places]
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
 *         description: Lugares verificados obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Place'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/verified', async (ctx) => {
  await placeController.getVerifiedPlaces(ctx);
});

/**
 * @swagger
 * /api/places/search:
 *   get:
 *     summary: Buscar lugares
 *     description: Busca lugares por nombre, descripción o dirección
 *     tags: [Places]
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
 *         description: Búsqueda de lugares completada exitosamente
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
 *                     $ref: '#/components/schemas/Place'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/search', async (ctx) => {
  await placeController.searchPlaces(ctx);
});

/**
 * @swagger
 * /api/places/category/{categoryId}:
 *   get:
 *     summary: Obtener lugares por categoría
 *     description: Retorna lugares de una categoría específica
 *     tags: [Places]
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
 *         description: Lugares de la categoría obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Place'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/category/:categoryId', async (ctx) => {
  await placeController.getPlacesByCategory(ctx);
});

/**
 * @swagger
 * /api/places/price/{priceRange}:
 *   get:
 *     summary: Obtener lugares por rango de precio
 *     description: Retorna lugares de un rango de precio específico
 *     tags: [Places]
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
 *         description: Lugares del rango de precio obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/Place'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/price/:priceRange', async (ctx) => {
  await placeController.getPlacesByPriceRange(ctx);
});

/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Obtener lugar por ID
 *     description: Retorna un lugar específico por su ID
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del lugar
 *         example: 1
 *     responses:
 *       200:
 *         description: Lugar encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Place'
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
  await placeController.getPlaceById(ctx);
});

/**
 * @swagger
 * /api/places/{id}/stats:
 *   get:
 *     summary: Obtener estadísticas del lugar
 *     description: Retorna estadísticas detalladas de un lugar
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del lugar
 *         example: 1
 *     responses:
 *       200:
 *         description: Estadísticas del lugar obtenidas exitosamente
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     average_rating:
 *                       type: number
 *                     total_reviews:
 *                       type: integer
 *                     total_visits:
 *                       type: integer
 *                     total_favorites:
 *                       type: integer
 *                     five_star_reviews:
 *                       type: integer
 *                     four_star_reviews:
 *                       type: integer
 *                     three_star_reviews:
 *                       type: integer
 *                     two_star_reviews:
 *                       type: integer
 *                     one_star_reviews:
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
  await placeController.getPlaceStats(ctx);
});

/**
 * @swagger
 * /api/places/{id}/categories:
 *   get:
 *     summary: Obtener categorías del lugar
 *     description: Retorna las categorías asociadas a un lugar
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del lugar
 *         example: 1
 *     responses:
 *       200:
 *         description: Categorías del lugar obtenidas exitosamente
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/categories', async (ctx) => {
  await placeController.getPlaceCategories(ctx);
});

/**
 * @swagger
 * /api/places/{id}/visit:
 *   post:
 *     summary: Incrementar contador de visitas
 *     description: Incrementa el contador de visitas de un lugar
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del lugar
 *         example: 1
 *     responses:
 *       200:
 *         description: Contador de visitas incrementado exitosamente
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
router.post('/:id/visit', jwtMiddleware, async (ctx) => {
  await placeController.incrementVisitCount(ctx);
});

/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Crear nuevo lugar
 *     description: Crea un nuevo lugar en el sistema
 *     tags: [Places]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlace'
 *           examples:
 *             example1:
 *               summary: Restaurante básico
 *               value:
 *                 name: "Restaurante El Buen Sabor"
 *                 description: "Restaurante familiar con comida tradicional"
 *                 short_description: "Comida tradicional en ambiente familiar"
 *                 address: "Calle Principal 123, Centro"
 *                 coordinates:
 *                   latitude: 40.4168
 *                   longitude: -3.7038
 *                 phone: "+34 91 123 4567"
 *                 email: "info@elbuensabor.com"
 *                 website: "https://elbuensabor.com"
 *                 price_range: "medium"
 *                 category_ids: [1, 2]
 *     responses:
 *       200:
 *         description: Lugar creado exitosamente
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
 *                   description: ID del lugar creado
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
  await placeController.createPlace(ctx);
});

/**
 * @swagger
 * /api/places/{id}:
 *   put:
 *     summary: Actualizar lugar
 *     description: Actualiza la información de un lugar existente
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del lugar a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlace'
 *           examples:
 *             example1:
 *               summary: Actualización básica
 *               value:
 *                 name: "Restaurante El Buen Sabor - Actualizado"
 *                 phone: "+34 91 123 4568"
 *                 price_range: "high"
 *     responses:
 *       200:
 *         description: Lugar actualizado exitosamente
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
  await placeController.updatePlace(ctx);
});

/**
 * @swagger
 * /api/places/{id}:
 *   delete:
 *     summary: Eliminar lugar
 *     description: Elimina un lugar del sistema
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del lugar a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Lugar eliminado exitosamente
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
  await placeController.deletePlace(ctx);
});

module.exports = router;
