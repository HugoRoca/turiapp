const UserRepository = require('../repositories/UserRepository');
const logger = require('../utils/logger');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(filters = {}) {
    try {
      logger.info('Getting all users', { filters });
      const users = await this.userRepository.findAll(filters);
      logger.info(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      logger.error('Error getting all users:', { error: error.message });
      throw error;
    }
  }

  async getUserById(id) {
    try {
      logger.info('Getting user by ID', { id });
      const user = await this.userRepository.findById(id);
      if (!user) {
        logger.warn('User not found', { id });
        return null;
      }
      logger.info('User found', { id, name: user.name });
      return user;
    } catch (error) {
      logger.error('Error getting user by ID:', { error: error.message, id });
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      logger.info('Getting user by email', { email });
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        logger.warn('User not found by email', { email });
        return null;
      }
      logger.info('User found by email', { email, id: user.id });
      return user;
    } catch (error) {
      logger.error('Error getting user by email:', { error: error.message, email });
      throw error;
    }
  }

  async createUser(userData) {
    try {
      logger.info('Creating new user', { email: userData.email });

      // Check if user already exists by email or username
      const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
      if (existingUserByEmail) {
        logger.warn('User already exists with this email', { email: userData.email });
        throw new Error('User with this email already exists');
      }

      if (userData.username) {
        const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
        if (existingUserByUsername) {
          logger.warn('User already exists with this username', { username: userData.username });
          throw new Error('User with this username already exists');
        }
      }

      const userId = await this.userRepository.create({
        ...userData,
        created_at: new Date(),
        updated_at: new Date(),
      });

      logger.info('User created successfully', { id: userId, email: userData.email });
      return userId;
    } catch (error) {
      logger.error('Error creating user:', { error: error.message, userData });
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      logger.info('Updating user', { id });

      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        logger.warn('User not found for update', { id });
        throw new Error('User not found');
      }

      const updated = await this.userRepository.update(id, {
        ...userData,
        updated_at: new Date(),
      });

      if (updated) {
        logger.info('User updated successfully', { id });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error updating user:', { error: error.message, id, userData });
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      logger.info('Deleting user', { id });

      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        logger.warn('User not found for deletion', { id });
        throw new Error('User not found');
      }

      const deleted = await this.userRepository.delete(id);
      if (deleted) {
        logger.info('User deleted successfully', { id });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error deleting user:', { error: error.message, id });
      throw error;
    }
  }

  async searchUsers(name) {
    try {
      logger.info('Searching users by name', { name });
      const users = await this.userRepository.findByName(name);
      logger.info(`Found ${users.length} users matching search criteria`);
      return users;
    } catch (error) {
      logger.error('Error searching users:', { error: error.message, name });
      throw error;
    }
  }

  async getActiveUsers() {
    try {
      logger.info('Getting active users');
      const users = await this.userRepository.findActiveUsers();
      logger.info(`Retrieved ${users.length} active users`);
      return users;
    } catch (error) {
      logger.error('Error getting active users:', { error: error.message });
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      logger.info('Getting user by username', { username });
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        logger.warn('User not found by username', { username });
        return null;
      }
      logger.info('User found by username', { username, id: user.id });
      return user;
    } catch (error) {
      logger.error('Error getting user by username:', { error: error.message, username });
      throw error;
    }
  }

  async getVerifiedUsers() {
    try {
      logger.info('Getting verified users');
      const users = await this.userRepository.findVerifiedUsers();
      logger.info(`Retrieved ${users.length} verified users`);
      return users;
    } catch (error) {
      logger.error('Error getting verified users:', { error: error.message });
      throw error;
    }
  }

  async getUsersByRole(role) {
    try {
      logger.info('Getting users by role', { role });
      const users = await this.userRepository.findUsersByRole(role);
      logger.info(`Retrieved ${users.length} users with role ${role}`);
      return users;
    } catch (error) {
      logger.error('Error getting users by role:', { error: error.message, role });
      throw error;
    }
  }

  async verifyUser(id) {
    try {
      logger.info('Verifying user', { id });
      const verified = await this.userRepository.verifyUser(id);
      if (verified) {
        logger.info('User verified successfully', { id });
      }
      return verified;
    } catch (error) {
      logger.error('Error verifying user:', { error: error.message, id });
      throw error;
    }
  }

  async deactivateUser(id) {
    try {
      logger.info('Deactivating user', { id });
      const deactivated = await this.userRepository.deactivateUser(id);
      if (deactivated) {
        logger.info('User deactivated successfully', { id });
      }
      return deactivated;
    } catch (error) {
      logger.error('Error deactivating user:', { error: error.message, id });
      throw error;
    }
  }

  async activateUser(id) {
    try {
      logger.info('Activating user', { id });
      const activated = await this.userRepository.activateUser(id);
      if (activated) {
        logger.info('User activated successfully', { id });
      }
      return activated;
    } catch (error) {
      logger.error('Error activating user:', { error: error.message, id });
      throw error;
    }
  }

  async updateUserRole(id, role) {
    try {
      logger.info('Updating user role', { id, role });
      const updated = await this.userRepository.updateUserRole(id, role);
      if (updated) {
        logger.info('User role updated successfully', { id, role });
      }
      return updated;
    } catch (error) {
      logger.error('Error updating user role:', { error: error.message, id, role });
      throw error;
    }
  }

  async getUserStats(userId) {
    try {
      logger.info('Getting user stats', { userId });
      const stats = await this.userRepository.getUserStats(userId);
      if (!stats) {
        logger.warn('User stats not found', { userId });
        return null;
      }
      logger.info('User stats retrieved', { userId });
      return stats;
    } catch (error) {
      logger.error('Error getting user stats:', { error: error.message, userId });
      throw error;
    }
  }

  async getRecentUsers(days = 30, limit = 20) {
    try {
      logger.info('Getting recent users', { days, limit });
      const users = await this.userRepository.getRecentUsers(days, limit);
      logger.info(`Retrieved ${users.length} recent users`);
      return users;
    } catch (error) {
      logger.error('Error getting recent users:', { error: error.message, days, limit });
      throw error;
    }
  }

  async getUserDashboard(userId) {
    try {
      logger.info('Getting user dashboard', { userId });
      const dashboard = await this.userRepository.getUserDashboard(userId);
      if (!dashboard) {
        logger.warn('User dashboard not found', { userId });
        return null;
      }
      logger.info('User dashboard retrieved', { userId });
      return dashboard;
    } catch (error) {
      logger.error('Error getting user dashboard:', { error: error.message, userId });
      throw error;
    }
  }
}

module.exports = UserService;
