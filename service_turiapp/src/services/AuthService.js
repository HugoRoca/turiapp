/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../utils/logger');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Autenticar usuario con email/username y contraseña
   * @param {string} identifier - Email o username
   * @param {string} password - Contraseña en texto plano
   * @returns {Object} - Token JWT y datos del usuario
   */
  async login(identifier, password) {
    try {
      logger.info('Attempting login', { identifier });

      // Buscar usuario por email o username
      const user = await this.userRepository.findByEmailOrUsername(identifier);

      if (!user) {
        logger.warn('Login failed: User not found', { identifier });
        throw new Error('Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (!user.is_active) {
        logger.warn('Login failed: User inactive', { userId: user.id });
        throw new Error('Usuario inactivo');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        logger.warn('Login failed: Invalid password', { userId: user.id });
        throw new Error('Credenciales inválidas');
      }

      // Actualizar último login
      await this.userRepository.updateLastLogin(user.id);

      // Generar token JWT
      const token = this.generateToken(user);

      // Remover password_hash de la respuesta
      const { password_hash, ...userWithoutPassword } = user;

      logger.info('Login successful', { userId: user.id, username: user.username });

      return {
        success: true,
        token,
        user: userWithoutPassword,
        expiresIn: this.jwtExpiresIn,
      };
    } catch (error) {
      logger.error('Login error:', { error: error.message, identifier });
      throw error;
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} - Token JWT y datos del usuario
   */
  async register(userData) {
    try {
      logger.info('Attempting registration', { email: userData.email, username: userData.username });

      // Verificar si el email ya existe
      const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
      if (existingUserByEmail) {
        throw new Error('El email ya está registrado');
      }

      // Verificar si el username ya existe
      const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
      if (existingUserByUsername) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Hash de la contraseña
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Crear usuario
      const newUser = {
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || null,
        avatar_url: userData.avatar_url || null,
        birth_date: userData.birth_date || null,
        role: userData.role || 'user',
        is_verified: false,
        is_active: true,
      };

      const createdUser = await this.userRepository.create(newUser);

      // Generar token JWT
      const token = this.generateToken(createdUser);

      // Remover password_hash de la respuesta
      const { password_hash, ...userWithoutPassword } = createdUser;

      logger.info('Registration successful', { userId: createdUser.id, username: createdUser.username });

      return {
        success: true,
        token,
        user: userWithoutPassword,
        expiresIn: this.jwtExpiresIn,
      };
    } catch (error) {
      logger.error('Registration error:', { error: error.message, email: userData.email });
      throw error;
    }
  }

  /**
   * Verificar token JWT
   * @param {string} token - Token JWT
   * @returns {Object} - Datos decodificados del token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);

      // Verificar que el usuario aún existe y está activo
      const user = await this.userRepository.findById(decoded.userId);
      if (!user || !user.is_active) {
        throw new Error('Token inválido');
      }

      return decoded;
    } catch (error) {
      logger.error('Token verification error:', { error: error.message });
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Generar token JWT
   * @param {Object} user - Datos del usuario
   * @returns {string} - Token JWT
   */
  generateToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified,
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  /**
   * Cambiar contraseña
   * @param {number} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Object} - Resultado de la operación
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      logger.info('Attempting password change', { userId });

      // Obtener usuario
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hash de la nueva contraseña
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar contraseña
      await this.userRepository.updatePassword(userId, newPasswordHash);

      logger.info('Password changed successfully', { userId });

      return {
        success: true,
        message: 'Contraseña actualizada correctamente',
      };
    } catch (error) {
      logger.error('Password change error:', { error: error.message, userId });
      throw error;
    }
  }

  /**
   * Solicitar restablecimiento de contraseña
   * @param {string} email - Email del usuario
   * @returns {Object} - Resultado de la operación
   */
  async requestPasswordReset(email) {
    try {
      logger.info('Password reset requested', { email });

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        // Por seguridad, no revelamos si el email existe o no
        return {
          success: true,
          message: 'Si el email existe, se enviará un enlace de restablecimiento',
        };
      }

      // Generar token de restablecimiento
      const resetToken = jwt.sign(
        { userId: user.id, type: 'password_reset' },
        this.jwtSecret,
        { expiresIn: '1h' },
      );

      // Aquí normalmente enviarías un email con el token
      // Por ahora, solo lo logueamos
      logger.info('Password reset token generated', { userId: user.id, resetToken });

      return {
        success: true,
        message: 'Si el email existe, se enviará un enlace de restablecimiento',
        resetToken, // En producción, esto no se devolvería
      };
    } catch (error) {
      logger.error('Password reset request error:', { error: error.message, email });
      throw error;
    }
  }

  /**
   * Restablecer contraseña con token
   * @param {string} resetToken - Token de restablecimiento
   * @param {string} newPassword - Nueva contraseña
   * @returns {Object} - Resultado de la operación
   */
  async resetPassword(resetToken, newPassword) {
    try {
      logger.info('Attempting password reset');

      // Verificar token
      const decoded = jwt.verify(resetToken, this.jwtSecret);
      if (decoded.type !== 'password_reset') {
        throw new Error('Token inválido');
      }

      // Hash de la nueva contraseña
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar contraseña
      await this.userRepository.updatePassword(decoded.userId, newPasswordHash);

      logger.info('Password reset successful', { userId: decoded.userId });

      return {
        success: true,
        message: 'Contraseña restablecida correctamente',
      };
    } catch (error) {
      logger.error('Password reset error:', { error: error.message });
      throw new Error('Token inválido o expirado');
    }
  }
}

module.exports = AuthService;
