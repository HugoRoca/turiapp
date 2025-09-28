const Router = require('koa-router');
const jwt = require('koa-jwt');
const UserController = require('../controllers/UserController');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operaciones relacionadas con usuarios
 */

const router = new Router({
  prefix: '/api/users',
});

const userController = new UserController();

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
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista de todos los usuarios en el sistema
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filtrar usuarios por estado
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número máximo de usuarios a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de usuarios a omitir
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', jwtMiddleware, async (ctx) => {
  await userController.getAllUsers(ctx);
});

/**
 * @swagger
 * /api/users/active:
 *   get:
 *     summary: Obtener usuarios activos
 *     description: Retorna una lista de todos los usuarios con estado activo
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios activos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/active', jwtMiddleware, async (ctx) => {
  await userController.getActiveUsers(ctx);
});

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Buscar usuarios por nombre
 *     description: Busca usuarios cuyo nombre contenga el texto especificado
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Texto a buscar en el nombre del usuario
 *         example: Juan
 *     responses:
 *       200:
 *         description: Usuarios encontrados exitosamente
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
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/search', jwtMiddleware, async (ctx) => {
  await userController.searchUsers(ctx);
});

/**
 * @swagger
 * /api/users/email:
 *   get:
 *     summary: Obtener usuario por email
 *     description: Busca un usuario específico por su dirección de correo electrónico
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Dirección de correo electrónico del usuario
 *         example: juan.perez@example.com
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
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
router.get('/email', jwtMiddleware, async (ctx) => {
  await userController.getUserByEmail(ctx);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Busca un usuario específico por su ID único
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
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
router.get('/:id', jwtMiddleware, async (ctx) => {
  await userController.getUserById(ctx);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear nuevo usuario
 *     description: Crea un nuevo usuario en el sistema
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *           examples:
 *             example1:
 *               summary: Usuario básico
 *               value:
 *                 name: "Juan Pérez"
 *                 email: "juan.perez@example.com"
 *                 phone: "+1234567890"
 *                 status: "active"
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
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
 *                   description: ID del usuario creado
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Request processed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', jwtMiddleware, async (ctx) => {
  await userController.createUser(ctx);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza la información de un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *           examples:
 *             example1:
 *               summary: Actualización básica
 *               value:
 *                 name: "Juan Pérez Actualizado"
 *                 phone: "+1234567899"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
  await userController.updateUser(ctx);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Elimina un usuario del sistema
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID único del usuario a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
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
  await userController.deleteUser(ctx);
});

module.exports = router;
