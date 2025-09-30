const Joi = require('joi');
const BaseController = require('./BaseController');
const AuthService = require('../services/AuthService');
const logger = require('../utils/logger');

class AuthController extends BaseController {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Iniciar sesión
   *     description: Autentica un usuario con email/username y contraseña
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - identifier
   *               - password
   *             properties:
   *               identifier:
   *                 type: string
   *                 description: Email o nombre de usuario
   *                 example: "juan.perez@example.com"
   *               password:
   *                 type: string
   *                 description: Contraseña
   *                 example: "miPassword123"
   *     responses:
   *       200:
   *         description: Login exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 token:
   *                   type: string
   *                   description: Token JWT
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 expiresIn:
   *                   type: string
   *                   example: "24h"
   *       400:
   *         description: Credenciales inválidas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Usuario inactivo
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async login(ctx) {
    try {
      // Validar datos de entrada
      const schema = Joi.object({
        identifier: Joi.string().required().messages({
          'string.empty': 'El email o nombre de usuario es requerido',
          'any.required': 'El email o nombre de usuario es requerido',
        }),
        password: Joi.string().required().min(6).messages({
          'string.empty': 'La contraseña es requerida',
          'string.min': 'La contraseña debe tener al menos 6 caracteres',
          'any.required': 'La contraseña es requerida',
        }),
      });

      const { error, value } = schema.validate(ctx.request.body);
      if (error) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: 'Validation error',
          details: error.details.map((detail) => detail.message),
        };
        return;
      }

      const { identifier, password } = value;

      // Autenticar usuario
      const result = await this.authService.login(identifier, password);

      logger.info('Login successful', { identifier });
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: result,
        message: 'Login exitoso',
      };
    } catch (error) {
      logger.error('Login failed:', { error: error.message });
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: error.message,
        message: 'Error de autenticación',
      };
    }
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Registrar nuevo usuario
   *     description: Crea una nueva cuenta de usuario
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *               - first_name
   *               - last_name
   *             properties:
   *               username:
   *                 type: string
   *                 minLength: 3
   *                 maxLength: 50
   *                 example: "juan_perez"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "juan.perez@example.com"
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: "miPassword123"
   *               first_name:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 50
   *                 example: "Juan"
   *               last_name:
   *                 type: string
   *                 minLength: 2
   *                 maxLength: 50
   *                 example: "Pérez"
   *               phone:
   *                 type: string
   *                 example: "+1234567890"
   *               avatar_url:
   *                 type: string
   *                 example: "https://example.com/avatar.jpg"
   *               role:
   *                 type: string
   *                 enum: [user, admin, moderator]
   *                 default: user
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 token:
   *                   type: string
   *                   description: Token JWT
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 expiresIn:
   *                   type: string
   *                   example: "24h"
   *       400:
   *         description: Datos inválidos o usuario ya existe
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async register(ctx) {
    try {
      // Validar datos de entrada
      const schema = Joi.object({
        username: Joi.string().min(3).max(50).required()
          .messages({
            'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
            'string.max': 'El nombre de usuario no puede tener más de 50 caracteres',
            'string.empty': 'El nombre de usuario es requerido',
            'any.required': 'El nombre de usuario es requerido',
          }),
        email: Joi.string().email().required().messages({
          'string.email': 'El email debe tener un formato válido',
          'string.empty': 'El email es requerido',
          'any.required': 'El email es requerido',
        }),
        password: Joi.string().min(6).required().messages({
          'string.min': 'La contraseña debe tener al menos 6 caracteres',
          'string.empty': 'La contraseña es requerida',
          'any.required': 'La contraseña es requerida',
        }),
        first_name: Joi.string().min(2).max(50).required()
          .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede tener más de 50 caracteres',
            'string.empty': 'El nombre es requerido',
            'any.required': 'El nombre es requerido',
          }),
        last_name: Joi.string().min(2).max(50).required()
          .messages({
            'string.min': 'El apellido debe tener al menos 2 caracteres',
            'string.max': 'El apellido no puede tener más de 50 caracteres',
            'string.empty': 'El apellido es requerido',
            'any.required': 'El apellido es requerido',
          }),
        phone: Joi.string().optional().allow(''),
        avatar_url: Joi.string().uri().optional().allow(''),
        birth_date: Joi.date().max('now').optional().allow(null, '')
          .messages({
            'date.max': 'La fecha de nacimiento no puede ser futura',
            'date.base': 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)',
          }),
        role: Joi.string().valid('user', 'admin', 'moderator').default('user'),
      });

      const { error, value } = schema.validate(ctx.request.body);
      if (error) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: 'Validation error',
          details: error.details.map((detail) => detail.message),
        };
        return;
      }

      // Registrar usuario
      const result = await this.authService.register(value);

      logger.info('Registration successful', { email: value.email, username: value.username });
      ctx.status = 201;
      ctx.body = {
        success: true,
        data: result,
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      logger.error('Registration failed:', { error: error.message });
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: error.message,
        message: 'Error en el registro',
      };
    }
  }

  /**
   * @swagger
   * /api/auth/verify:
   *   get:
   *     summary: Verificar token
   *     description: Verifica si un token JWT es válido
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Token válido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Token inválido o expirado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async verify(ctx) {
    try {
      const decoded = ctx.state.user; // Viene del middleware JWT

      ctx.status = 200;
      ctx.body = {
        success: true,
        data: { user: decoded },
        message: 'Token válido',
      };
    } catch (error) {
      logger.error('Token verification failed:', { error: error.message });
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: error.message,
        message: 'Token inválido',
      };
    }
  }

  /**
   * @swagger
   * /api/auth/change-password:
   *   post:
   *     summary: Cambiar contraseña
   *     description: Cambia la contraseña del usuario autenticado
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *                 description: Contraseña actual
   *                 example: "miPasswordActual123"
   *               newPassword:
   *                 type: string
   *                 minLength: 6
   *                 description: Nueva contraseña
   *                 example: "miNuevaPassword123"
   *     responses:
   *       200:
   *         description: Contraseña cambiada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Contraseña actual incorrecta
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: No autorizado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async changePassword(ctx) {
    try {
      const { userId } = ctx.state.user;

      // Validar datos de entrada
      const schema = Joi.object({
        currentPassword: Joi.string().required().messages({
          'string.empty': 'La contraseña actual es requerida',
          'any.required': 'La contraseña actual es requerida',
        }),
        newPassword: Joi.string().min(6).required().messages({
          'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
          'string.empty': 'La nueva contraseña es requerida',
          'any.required': 'La nueva contraseña es requerida',
        }),
      });

      const { error, value } = schema.validate(ctx.request.body);
      if (error) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: 'Validation error',
          details: error.details.map((detail) => detail.message),
        };
        return;
      }

      const { currentPassword, newPassword } = value;

      // Cambiar contraseña
      const result = await this.authService.changePassword(userId, currentPassword, newPassword);

      logger.info('Password changed successfully', { userId });
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: result,
        message: 'Contraseña cambiada exitosamente',
      };
    } catch (error) {
      logger.error('Password change failed:', { error: error.message });
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: error.message,
        message: 'Error al cambiar contraseña',
      };
    }
  }

  /**
   * @swagger
   * /api/auth/forgot-password:
   *   post:
   *     summary: Solicitar restablecimiento de contraseña
   *     description: Envía un enlace para restablecer la contraseña
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "juan.perez@example.com"
   *     responses:
   *       200:
   *         description: Solicitud procesada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   */
  async forgotPassword(ctx) {
    try {
      // Validar datos de entrada
      const schema = Joi.object({
        email: Joi.string().email().required().messages({
          'string.email': 'El email debe tener un formato válido',
          'string.empty': 'El email es requerido',
          'any.required': 'El email es requerido',
        }),
      });

      const { error, value } = schema.validate(ctx.request.body);
      if (error) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: 'Validation error',
          details: error.details.map((detail) => detail.message),
        };
        return;
      }

      const { email } = value;

      // Solicitar restablecimiento
      const result = await this.authService.requestPasswordReset(email);

      logger.info('Password reset requested', { email });
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: result,
        message: 'Si el email existe, se enviará un enlace de restablecimiento',
      };
    } catch (error) {
      logger.error('Password reset request failed:', { error: error.message });
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: error.message,
        message: 'Error al solicitar restablecimiento',
      };
    }
  }

  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     summary: Restablecer contraseña
   *     description: Restablece la contraseña usando un token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - newPassword
   *             properties:
   *               token:
   *                 type: string
   *                 description: Token de restablecimiento
   *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *               newPassword:
   *                 type: string
   *                 minLength: 6
   *                 description: Nueva contraseña
   *                 example: "miNuevaPassword123"
   *     responses:
   *       200:
   *         description: Contraseña restablecida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Token inválido o expirado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async resetPassword(ctx) {
    try {
      // Validar datos de entrada
      const schema = Joi.object({
        token: Joi.string().required().messages({
          'string.empty': 'El token es requerido',
          'any.required': 'El token es requerido',
        }),
        newPassword: Joi.string().min(6).required().messages({
          'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
          'string.empty': 'La nueva contraseña es requerida',
          'any.required': 'La nueva contraseña es requerida',
        }),
      });

      const { error, value } = schema.validate(ctx.request.body);
      if (error) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: 'Validation error',
          details: error.details.map((detail) => detail.message),
        };
        return;
      }

      const { token, newPassword } = value;

      // Restablecer contraseña
      const result = await this.authService.resetPassword(token, newPassword);

      logger.info('Password reset successful');
      ctx.status = 200;
      ctx.body = {
        success: true,
        data: result,
        message: 'Contraseña restablecida exitosamente',
      };
    } catch (error) {
      logger.error('Password reset failed:', { error: error.message });
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: error.message,
        message: 'Error al restablecer contraseña',
      };
    }
  }
}

module.exports = AuthController;
