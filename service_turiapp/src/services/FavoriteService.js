/* eslint-disable max-len */
const FavoriteRepository = require('../repositories/FavoriteRepository');
const logger = require('../utils/logger');

class FavoriteService {
  constructor() {
    this.favoriteRepository = new FavoriteRepository();
  }

  async addFavorite(userId, placeId) {
    try {
      logger.info('Adding favorite', { userId, placeId });

      // Verificar si ya es favorito
      const isAlreadyFavorite = await this.favoriteRepository.isFavorite(userId, placeId);
      if (isAlreadyFavorite) {
        throw new Error('Place is already in favorites');
      }

      const added = await this.favoriteRepository.addFavorite(userId, placeId);

      if (added) {
        logger.info('Favorite added successfully', { userId, placeId });
      }

      return added;
    } catch (error) {
      logger.error('Error adding favorite:', { error: error.message, userId, placeId });
      throw error;
    }
  }

  async removeFavorite(userId, placeId) {
    try {
      logger.info('Removing favorite', { userId, placeId });

      const removed = await this.favoriteRepository.removeFavorite(userId, placeId);

      if (removed) {
        logger.info('Favorite removed successfully', { userId, placeId });
      } else {
        logger.warn('Favorite not found', { userId, placeId });
        throw new Error('Favorite not found');
      }

      return removed;
    } catch (error) {
      logger.error('Error removing favorite:', { error: error.message, userId, placeId });
      throw error;
    }
  }

  async toggleFavorite(userId, placeId) {
    try {
      logger.info('Toggling favorite', { userId, placeId });

      const isFavorite = await this.favoriteRepository.isFavorite(userId, placeId);

      if (isFavorite) {
        await this.removeFavorite(userId, placeId);
        return { isFavorite: false, action: 'removed' };
      }
      await this.addFavorite(userId, placeId);
      return { isFavorite: true, action: 'added' };
    } catch (error) {
      logger.error('Error toggling favorite:', { error: error.message, userId, placeId });
      throw error;
    }
  }

  async isFavorite(userId, placeId) {
    try {
      const isFavorite = await this.favoriteRepository.isFavorite(userId, placeId);
      return isFavorite;
    } catch (error) {
      logger.error('Error checking if favorite:', { error: error.message, userId, placeId });
      throw error;
    }
  }

  async getUserFavorites(userId, limit = 20, offset = 0) {
    try {
      logger.info('Getting user favorites', { userId, limit, offset });
      const favorites = await this.favoriteRepository.getUserFavorites(userId, limit, offset);
      logger.info(`Retrieved ${favorites.length} favorites for user ${userId}`);
      return favorites;
    } catch (error) {
      logger.error('Error getting user favorites:', { error: error.message, userId });
      throw error;
    }
  }

  async getPlaceFavorites(placeId, limit = 20, offset = 0) {
    try {
      logger.info('Getting place favorites', { placeId, limit, offset });
      const favorites = await this.favoriteRepository.getPlaceFavorites(placeId, limit, offset);
      logger.info(`Retrieved ${favorites.length} users who favorited place ${placeId}`);
      return favorites;
    } catch (error) {
      logger.error('Error getting place favorites:', { error: error.message, placeId });
      throw error;
    }
  }

  async getUserFavoriteCount(userId) {
    try {
      logger.info('Getting user favorite count', { userId });
      const count = await this.favoriteRepository.getUserFavoriteCount(userId);
      logger.info(`User ${userId} has ${count} favorites`);
      return count;
    } catch (error) {
      logger.error('Error getting user favorite count:', { error: error.message, userId });
      throw error;
    }
  }

  async getPlaceFavoriteCount(placeId) {
    try {
      logger.info('Getting place favorite count', { placeId });
      const count = await this.favoriteRepository.getPlaceFavoriteCount(placeId);
      logger.info(`Place ${placeId} has ${count} favorites`);
      return count;
    } catch (error) {
      logger.error('Error getting place favorite count:', { error: error.message, placeId });
      throw error;
    }
  }

  async getUserFavoritesByCategory(userId, categoryId, limit = 20, offset = 0) {
    try {
      logger.info('Getting user favorites by category', {
        userId, categoryId, limit, offset,
      });
      const favorites = await this.favoriteRepository.getUserFavoritesByCategory(userId, categoryId, limit, offset);
      logger.info(`Retrieved ${favorites.length} favorites in category ${categoryId} for user ${userId}`);
      return favorites;
    } catch (error) {
      logger.error('Error getting user favorites by category:', { error: error.message, userId, categoryId });
      throw error;
    }
  }

  async getUserFavoritesByPriceRange(userId, priceRange, limit = 20, offset = 0) {
    try {
      logger.info('Getting user favorites by price range', {
        userId, priceRange, limit, offset,
      });
      const favorites = await this.favoriteRepository.getUserFavoritesByPriceRange(userId, priceRange, limit, offset);
      logger.info(`Retrieved ${favorites.length} favorites in price range ${priceRange} for user ${userId}`);
      return favorites;
    } catch (error) {
      logger.error('Error getting user favorites by price range:', { error: error.message, userId, priceRange });
      throw error;
    }
  }

  async searchUserFavorites(userId, searchTerm, limit = 20, offset = 0) {
    try {
      logger.info('Searching user favorites', {
        userId, searchTerm, limit, offset,
      });
      const favorites = await this.favoriteRepository.searchUserFavorites(userId, searchTerm, limit, offset);
      logger.info(`Found ${favorites.length} favorites matching "${searchTerm}" for user ${userId}`);
      return favorites;
    } catch (error) {
      logger.error('Error searching user favorites:', { error: error.message, userId, searchTerm });
      throw error;
    }
  }

  async getMostFavoritedPlaces(limit = 20, offset = 0) {
    try {
      logger.info('Getting most favorited places', { limit, offset });
      const places = await this.favoriteRepository.getMostFavoritedPlaces(limit, offset);
      logger.info(`Retrieved ${places.length} most favorited places`);
      return places;
    } catch (error) {
      logger.error('Error getting most favorited places:', { error: error.message });
      throw error;
    }
  }

  async getUserFavoriteStats(userId) {
    try {
      logger.info('Getting user favorite stats', { userId });
      const stats = await this.favoriteRepository.getUserFavoriteStats(userId);
      logger.info('User favorite stats retrieved', { userId });
      return stats;
    } catch (error) {
      logger.error('Error getting user favorite stats:', { error: error.message, userId });
      throw error;
    }
  }

  async getFavoriteTrends(days = 30) {
    try {
      logger.info('Getting favorite trends', { days });
      const trends = await this.favoriteRepository.getFavoriteTrends(days);
      logger.info(`Retrieved favorite trends for ${days} days`);
      return trends;
    } catch (error) {
      logger.error('Error getting favorite trends:', { error: error.message, days });
      throw error;
    }
  }

  async getCategoryFavoriteStats() {
    try {
      logger.info('Getting category favorite stats');
      const stats = await this.favoriteRepository.getCategoryFavoriteStats();
      logger.info(`Retrieved favorite stats for ${stats.length} categories`);
      return stats;
    } catch (error) {
      logger.error('Error getting category favorite stats:', { error: error.message });
      throw error;
    }
  }

  async getUserFavoritesWithDetails(userId, limit = 20, offset = 0) {
    try {
      logger.info('Getting user favorites with details', { userId, limit, offset });
      const favorites = await this.favoriteRepository.getUserFavorites(userId, limit, offset);

      // Agregar información adicional si es necesario
      const favoritesWithDetails = await Promise.all(
        favorites.map(async (favorite) => {
          const favoriteCount = await this.favoriteRepository.getPlaceFavoriteCount(favorite.place_id);
          return {
            ...favorite,
            total_favorites: favoriteCount,
          };
        }),
      );

      logger.info(`Retrieved ${favoritesWithDetails.length} favorites with details for user ${userId}`);
      return favoritesWithDetails;
    } catch (error) {
      logger.error('Error getting user favorites with details:', { error: error.message, userId });
      throw error;
    }
  }

  async getFavoriteSummary(userId) {
    try {
      logger.info('Getting favorite summary', { userId });

      const [
        totalFavorites,
        favoriteStats,
        recentFavorites,
      ] = await Promise.all([
        this.favoriteRepository.getUserFavoriteCount(userId),
        this.favoriteRepository.getUserFavoriteStats(userId),
        this.favoriteRepository.getUserFavorites(userId, 5, 0),
      ]);

      const summary = {
        total_favorites: totalFavorites,
        stats: favoriteStats,
        recent_favorites: recentFavorites,
      };

      logger.info('Favorite summary retrieved', { userId });
      return summary;
    } catch (error) {
      logger.error('Error getting favorite summary:', { error: error.message, userId });
      throw error;
    }
  }

  async bulkAddFavorites(userId, placeIds) {
    try {
      logger.info('Bulk adding favorites', { userId, placeCount: placeIds.length });

      if (!Array.isArray(placeIds) || placeIds.length === 0) {
        throw new Error('Place IDs array is required');
      }

      const results = await Promise.allSettled(
        placeIds.map((placeId) => this.addFavorite(userId, placeId)),
      );

      const successful = results.filter((result) => result.status === 'fulfilled').length;
      const failed = results.filter((result) => result.status === 'rejected').length;

      logger.info('Bulk add favorites completed', { userId, successful, failed });

      return {
        successful,
        failed,
        total: placeIds.length,
        results,
      };
    } catch (error) {
      logger.error('Error bulk adding favorites:', { error: error.message, userId, placeIds });
      throw error;
    }
  }

  async bulkRemoveFavorites(userId, placeIds) {
    try {
      logger.info('Bulk removing favorites', { userId, placeCount: placeIds.length });

      if (!Array.isArray(placeIds) || placeIds.length === 0) {
        throw new Error('Place IDs array is required');
      }

      const results = await Promise.allSettled(
        placeIds.map((placeId) => this.removeFavorite(userId, placeId)),
      );

      const successful = results.filter((result) => result.status === 'fulfilled').length;
      const failed = results.filter((result) => result.status === 'rejected').length;

      logger.info('Bulk remove favorites completed', { userId, successful, failed });

      return {
        successful,
        failed,
        total: placeIds.length,
        results,
      };
    } catch (error) {
      logger.error('Error bulk removing favorites:', { error: error.message, userId, placeIds });
      throw error;
    }
  }
}

module.exports = FavoriteService;
