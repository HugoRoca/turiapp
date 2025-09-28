/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../utils/logger');

class AuthMiddleware {
  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  /**
   * Middleware para verificar JWT token
   */
  async authenticate(ctx, next) {
    try {
      const token = this.extractToken(ctx);
      
      if (!token) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          error: 'Token de acceso requerido',
          message: 'Debe proporcionar un token de autenticación',
        };
        return;
      }

      const decoded = jwt.verify(token, this.jwtSecret);
      
      // Verificar que el usuario aún existe y está activo
      const user = await this.userRepository.findById(decoded.userId);
      if (!user || !user.is_active) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          error: 'Token inválido',
          message: 'El usuario no existe o está inactivo',
        };
        return;
      }

      // Agregar información del usuario al contexto
      ctx.state.user = {
        ...decoded,
        user,
      };

      await next();
    } catch (error) {
      logger.error('Authentication error:', { error: error.message });
      
      if (error.name === 'JsonWebTokenError') {
        ctx.status = 401;
        ctx.body = {
          success: false,
          error: 'Token inválido',
          message: 'El token proporcionado no es válido',
        };
      } else if (error.name === 'TokenExpiredError') {
        ctx.status = 401;
        ctx.body = {
          success: false,
          error: 'Token expirado',
          message: 'El token ha expirado, por favor inicie sesión nuevamente',
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          success: false,
          error: 'Error de autenticación',
          message: 'Error interno del servidor',
        };
      }
    }
  }

  /**
   * Middleware para verificar roles específicos
   */
  requireRole(roles) {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    return async (ctx, next) => {
      if (!ctx.state.user) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          error: 'No autorizado',
          message: 'Debe estar autenticado para acceder a este recurso',
        };
        return;
      }

      const userRole = ctx.state.user.role;
      if (!roleArray.includes(userRole)) {
        ctx.status = 403;
        ctx.body = {
          success: false,
          error: 'Acceso denegado',
          message: 'No tiene permisos para acceder a este recurso',
        };
        return;
      }

      await next();
    };
  }

  /**
   * Middleware para verificar si el usuario es el propietario del recurso o admin
   */
  requireOwnershipOrAdmin(resourceUserIdField = 'userId') {
    return async (ctx, next) => {
      if (!ctx.state.user) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          error: 'No autorizado',
          message: 'Debe estar autenticado para acceder a este recurso',
        };
        return;
      }

      const currentUserId = ctx.state.user.userId;
      const userRole = ctx.state.user.role;
      const resourceUserId = ctx.params[resourceUserIdField] || ctx.request.body[resourceUserIdField];

      // Los administradores pueden acceder a todo
      if (userRole === 'admin') {
        await next();
        return;
      }

      // Verificar si es el propietario del recurso
      if (currentUserId.toString() !== resourceUserId?.toString()) {
        ctx.status = 403;
        ctx.body = {
          success: false,
          error: 'Acceso denegado',
          message: 'Solo puede acceder a sus propios recursos',
        };
        return;
      }

      await next();
    };
  }

  /**
   * Middleware opcional de autenticación (no falla si no hay token)
   */
  async optionalAuth(ctx, next) {
    try {
      const token = this.extractToken(ctx);
      
      if (token) {
        const decoded = jwt.verify(token, this.jwtSecret);
        const user = await this.userRepository.findById(decoded.userId);
        
        if (user && user.is_active) {
          ctx.state.user = {
            ...decoded,
            user,
          };
        }
      }
    } catch (error) {
      // En autenticación opcional, no fallamos si hay error
      logger.warn('Optional auth failed:', { error: error.message });
    }

    await next();
  }

  /**
   * Extraer token del header Authorization
   */
  extractToken(ctx) {
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Middleware para verificar si el usuario está verificado
   */
  async requireVerified(ctx, next) {
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: 'No autorizado',
        message: 'Debe estar autenticado para acceder a este recurso',
      };
      return;
    }

    if (!ctx.state.user.isVerified) {
      ctx.status = 403;
      ctx.body = {
        success: false,
        error: 'Usuario no verificado',
        message: 'Debe verificar su cuenta para acceder a este recurso',
      };
      return;
    }

    await next();
  }
}

module.exports = new AuthMiddleware();
