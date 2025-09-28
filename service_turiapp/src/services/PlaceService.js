/* eslint-disable default-param-last */
/* eslint-disable max-len */
const PlaceRepository = require('../repositories/PlaceRepository');
const logger = require('../utils/logger');

class PlaceService {
  constructor() {
    this.placeRepository = new PlaceRepository();
  }

  async getAllPlaces(filters = {}) {
    try {
      logger.info('Getting all places', { filters });
      const places = await this.placeRepository.findAll(filters);
      logger.info(`Retrieved ${places.length} places`);
      return places;
    } catch (error) {
      logger.error('Error getting all places:', { error: error.message });
      throw error;
    }
  }

  async getPlaceById(id) {
    try {
      logger.info('Getting place by ID', { id });
      const place = await this.placeRepository.findById(id);
      if (!place) {
        logger.warn('Place not found', { id });
        return null;
      }
      logger.info('Place found', { id, name: place.name });
      return place;
    } catch (error) {
      logger.error('Error getting place by ID:', { error: error.message, id });
      throw error;
    }
  }

  async getNearbyPlaces(latitude, longitude, radiusKm = 10, limit = 20) {
    try {
      logger.info('Getting nearby places', {
        latitude, longitude, radiusKm, limit,
      });
      const places = await this.placeRepository.findNearbyPlaces(latitude, longitude, radiusKm, limit);
      logger.info(`Found ${places.length} nearby places`);
      return places;
    } catch (error) {
      logger.error('Error getting nearby places:', { error: error.message, latitude, longitude });
      throw error;
    }
  }

  async getPopularPlaces(limit = 10, categoryId = null) {
    try {
      logger.info('Getting popular places', { limit, categoryId });
      const places = await this.placeRepository.getPopularPlaces(limit, categoryId);
      logger.info(`Retrieved ${places.length} popular places`);
      return places;
    } catch (error) {
      logger.error('Error getting popular places:', { error: error.message });
      throw error;
    }
  }

  async getFeaturedPlaces(limit = 10) {
    try {
      logger.info('Getting featured places', { limit });
      const places = await this.placeRepository.findFeaturedPlaces(limit);
      logger.info(`Retrieved ${places.length} featured places`);
      return places;
    } catch (error) {
      logger.error('Error getting featured places:', { error: error.message });
      throw error;
    }
  }

  async getVerifiedPlaces(limit = 20, offset = 0) {
    try {
      logger.info('Getting verified places', { limit, offset });
      const places = await this.placeRepository.findVerifiedPlaces(limit, offset);
      logger.info(`Retrieved ${places.length} verified places`);
      return places;
    } catch (error) {
      logger.error('Error getting verified places:', { error: error.message });
      throw error;
    }
  }

  async getPlacesByCategory(categoryId, limit = 20, offset = 0) {
    try {
      logger.info('Getting places by category', { categoryId, limit, offset });
      const places = await this.placeRepository.findPlacesByCategory(categoryId, limit, offset);
      logger.info(`Retrieved ${places.length} places for category ${categoryId}`);
      return places;
    } catch (error) {
      logger.error('Error getting places by category:', { error: error.message, categoryId });
      throw error;
    }
  }

  async getPlacesByPriceRange(priceRange, limit = 20, offset = 0) {
    try {
      logger.info('Getting places by price range', { priceRange, limit, offset });
      const places = await this.placeRepository.getPlacesByPriceRange(priceRange, limit, offset);
      logger.info(`Retrieved ${places.length} places for price range ${priceRange}`);
      return places;
    } catch (error) {
      logger.error('Error getting places by price range:', { error: error.message, priceRange });
      throw error;
    }
  }

  async searchPlaces(searchTerm, limit = 20, offset = 0) {
    try {
      logger.info('Searching places', { searchTerm, limit, offset });
      const places = await this.placeRepository.searchPlaces(searchTerm, limit, offset);
      logger.info(`Found ${places.length} places matching "${searchTerm}"`);
      return places;
    } catch (error) {
      logger.error('Error searching places:', { error: error.message, searchTerm });
      throw error;
    }
  }

  async createPlace(placeData, categoryIds = [], userId) {
    try {
      logger.info('Creating new place', { name: placeData.name, userId });

      // Validar datos requeridos
      if (!placeData.name || !placeData.address || !placeData.coordinates) {
        throw new Error('Name, address, and coordinates are required');
      }

      // Preparar datos del lugar
      const placeDataWithUser = {
        ...placeData,
        created_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const placeId = await this.placeRepository.createPlaceWithCategories(
        placeDataWithUser,
        categoryIds,
      );

      logger.info('Place created successfully', { placeId, name: placeData.name });
      return placeId;
    } catch (error) {
      logger.error('Error creating place:', { error: error.message, placeData });
      throw error;
    }
  }

  async updatePlace(id, placeData, categoryIds = null, userId) {
    try {
      logger.info('Updating place', { id, userId });

      const existingPlace = await this.placeRepository.findById(id);
      if (!existingPlace) {
        logger.warn('Place not found for update', { id });
        throw new Error('Place not found');
      }

      // Verificar permisos (solo el creador o admin puede actualizar)
      if (existingPlace.created_by !== userId) {
        // Aquí podrías verificar si el usuario es admin
        throw new Error('Unauthorized to update this place');
      }

      const updatedData = {
        ...placeData,
        updated_at: new Date(),
      };

      const updated = await this.placeRepository.updatePlaceWithCategories(
        id,
        updatedData,
        categoryIds,
      );

      if (updated) {
        logger.info('Place updated successfully', { id });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error updating place:', { error: error.message, id, placeData });
      throw error;
    }
  }

  async deletePlace(id, userId) {
    try {
      logger.info('Deleting place', { id, userId });

      const existingPlace = await this.placeRepository.findById(id);
      if (!existingPlace) {
        logger.warn('Place not found for deletion', { id });
        throw new Error('Place not found');
      }

      // Verificar permisos (solo el creador o admin puede eliminar)
      if (existingPlace.created_by !== userId) {
        // Aquí podrías verificar si el usuario es admin
        throw new Error('Unauthorized to delete this place');
      }

      const deleted = await this.placeRepository.delete(id);
      if (deleted) {
        logger.info('Place deleted successfully', { id });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error deleting place:', { error: error.message, id });
      throw error;
    }
  }

  async getPlaceStats(placeId) {
    try {
      logger.info('Getting place stats', { placeId });
      const stats = await this.placeRepository.getPlaceStats(placeId);
      if (!stats) {
        logger.warn('Place stats not found', { placeId });
        return null;
      }
      logger.info('Place stats retrieved', { placeId });
      return stats;
    } catch (error) {
      logger.error('Error getting place stats:', { error: error.message, placeId });
      throw error;
    }
  }

  async getPlaceCategories(placeId) {
    try {
      logger.info('Getting place categories', { placeId });
      const categories = await this.placeRepository.getPlaceCategories(placeId);
      logger.info(`Retrieved ${categories.length} categories for place ${placeId}`);
      return categories;
    } catch (error) {
      logger.error('Error getting place categories:', { error: error.message, placeId });
      throw error;
    }
  }

  async addCategoryToPlace(placeId, categoryId) {
    try {
      logger.info('Adding category to place', { placeId, categoryId });
      const added = await this.placeRepository.addCategoryToPlace(placeId, categoryId);
      if (added) {
        logger.info('Category added to place successfully', { placeId, categoryId });
      }
      return added;
    } catch (error) {
      logger.error('Error adding category to place:', { error: error.message, placeId, categoryId });
      throw error;
    }
  }

  async removeCategoryFromPlace(placeId, categoryId) {
    try {
      logger.info('Removing category from place', { placeId, categoryId });
      const removed = await this.placeRepository.removeCategoryFromPlace(placeId, categoryId);
      if (removed) {
        logger.info('Category removed from place successfully', { placeId, categoryId });
      }
      return removed;
    } catch (error) {
      logger.error('Error removing category from place:', { error: error.message, placeId, categoryId });
      throw error;
    }
  }

  async incrementVisitCount(placeId) {
    try {
      logger.info('Incrementing visit count', { placeId });
      const incremented = await this.placeRepository.incrementVisitCount(placeId);
      if (incremented) {
        logger.info('Visit count incremented successfully', { placeId });
      }
      return incremented;
    } catch (error) {
      logger.error('Error incrementing visit count:', { error: error.message, placeId });
      throw error;
    }
  }

  async verifyPlace(placeId, userId) {
    try {
      logger.info('Verifying place', { placeId, userId });

      // Aquí podrías verificar si el usuario tiene permisos de admin/moderador
      const updated = await this.placeRepository.update(placeId, {
        is_verified: true,
        updated_at: new Date(),
      });

      if (updated) {
        logger.info('Place verified successfully', { placeId });
      }
      return updated;
    } catch (error) {
      logger.error('Error verifying place:', { error: error.message, placeId });
      throw error;
    }
  }

  async featurePlace(placeId, userId) {
    try {
      logger.info('Featuring place', { placeId, userId });

      // Aquí podrías verificar si el usuario tiene permisos de admin
      const updated = await this.placeRepository.update(placeId, {
        is_featured: true,
        updated_at: new Date(),
      });

      if (updated) {
        logger.info('Place featured successfully', { placeId });
      }
      return updated;
    } catch (error) {
      logger.error('Error featuring place:', { error: error.message, placeId });
      throw error;
    }
  }
}

module.exports = PlaceService;
