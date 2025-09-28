/* eslint-disable max-len */
const ReviewRepository = require('../repositories/ReviewRepository');
const logger = require('../utils/logger');

class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createReview(placeId, userId, rating, title, content, images = null) {
    try {
      logger.info('Creating new review', { placeId, userId, rating });

      // Validar datos
      if (!placeId || !userId || !rating || !content) {
        throw new Error('Place ID, user ID, rating, and content are required');
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Verificar si el usuario ya ha reseñado este lugar
      const canReview = await this.reviewRepository.canUserReviewPlace(placeId, userId);
      if (!canReview) {
        throw new Error('User has already reviewed this place');
      }

      const reviewId = await this.reviewRepository.createReview(
        placeId,
        userId,
        rating,
        title,
        content,
        images,
      );

      logger.info('Review created successfully', { reviewId, placeId, userId });
      return reviewId;
    } catch (error) {
      logger.error('Error creating review:', { error: error.message, placeId, userId });
      throw error;
    }
  }

  async updateReview(reviewId, userId, rating, title, content, images = null) {
    try {
      logger.info('Updating review', { reviewId, userId });

      // Validar datos
      if (rating && (rating < 1 || rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
      }

      const updated = await this.reviewRepository.updateReview(
        reviewId,
        userId,
        rating,
        title,
        content,
        images,
      );

      if (updated) {
        logger.info('Review updated successfully', { reviewId });
      } else {
        logger.warn('Review not found or unauthorized', { reviewId, userId });
        throw new Error('Review not found or unauthorized to update');
      }

      return updated;
    } catch (error) {
      logger.error('Error updating review:', { error: error.message, reviewId, userId });
      throw error;
    }
  }

  async deleteReview(reviewId, userId) {
    try {
      logger.info('Deleting review', { reviewId, userId });

      const deleted = await this.reviewRepository.deleteReview(reviewId, userId);

      if (deleted) {
        logger.info('Review deleted successfully', { reviewId });
      } else {
        logger.warn('Review not found or unauthorized', { reviewId, userId });
        throw new Error('Review not found or unauthorized to delete');
      }

      return deleted;
    } catch (error) {
      logger.error('Error deleting review:', { error: error.message, reviewId, userId });
      throw error;
    }
  }

  async getReviewById(reviewId) {
    try {
      logger.info('Getting review by ID', { reviewId });
      const review = await this.reviewRepository.getReviewById(reviewId);
      if (!review) {
        logger.warn('Review not found', { reviewId });
        return null;
      }
      logger.info('Review found', { reviewId });
      return review;
    } catch (error) {
      logger.error('Error getting review by ID:', { error: error.message, reviewId });
      throw error;
    }
  }

  async getPlaceReviews(placeId, offset = 0, limit = 10, ratingFilter = null) {
    try {
      logger.info('Getting place reviews', {
        placeId, offset, limit, ratingFilter,
      });
      const reviews = await this.reviewRepository.getPlaceReviews(placeId, offset, limit, ratingFilter);
      logger.info(`Retrieved ${reviews.length} reviews for place ${placeId}`);
      return reviews;
    } catch (error) {
      logger.error('Error getting place reviews:', { error: error.message, placeId });
      throw error;
    }
  }

  async getUserReviews(userId, limit = 20, offset = 0) {
    try {
      logger.info('Getting user reviews', { userId, limit, offset });
      const reviews = await this.reviewRepository.getUserReviews(userId, limit, offset);
      logger.info(`Retrieved ${reviews.length} reviews for user ${userId}`);
      return reviews;
    } catch (error) {
      logger.error('Error getting user reviews:', { error: error.message, userId });
      throw error;
    }
  }

  async getRecentReviews(limit = 20, offset = 0) {
    try {
      logger.info('Getting recent reviews', { limit, offset });
      const reviews = await this.reviewRepository.getRecentReviews(limit, offset);
      logger.info(`Retrieved ${reviews.length} recent reviews`);
      return reviews;
    } catch (error) {
      logger.error('Error getting recent reviews:', { error: error.message });
      throw error;
    }
  }

  async getTopRatedReviews(limit = 20, offset = 0) {
    try {
      logger.info('Getting top rated reviews', { limit, offset });
      const reviews = await this.reviewRepository.getTopRatedReviews(limit, offset);
      logger.info(`Retrieved ${reviews.length} top rated reviews`);
      return reviews;
    } catch (error) {
      logger.error('Error getting top rated reviews:', { error: error.message });
      throw error;
    }
  }

  async getReviewsByRating(rating, limit = 20, offset = 0) {
    try {
      logger.info('Getting reviews by rating', { rating, limit, offset });
      const reviews = await this.reviewRepository.getReviewsByRating(rating, limit, offset);
      logger.info(`Retrieved ${reviews.length} reviews with rating ${rating}`);
      return reviews;
    } catch (error) {
      logger.error('Error getting reviews by rating:', { error: error.message, rating });
      throw error;
    }
  }

  async markReviewHelpful(reviewId, userId) {
    try {
      logger.info('Marking review as helpful', { reviewId, userId });

      // Verificar si el usuario ya marcó esta reseña como útil
      const alreadyMarked = await this.reviewRepository.hasUserMarkedHelpful(reviewId, userId);
      if (alreadyMarked) {
        throw new Error('User has already marked this review as helpful');
      }

      const marked = await this.reviewRepository.markReviewHelpful(reviewId, userId);

      if (marked) {
        logger.info('Review marked as helpful successfully', { reviewId, userId });
      }

      return marked;
    } catch (error) {
      logger.error('Error marking review as helpful:', { error: error.message, reviewId, userId });
      throw error;
    }
  }

  async getReviewHelpfulCount(reviewId) {
    try {
      logger.info('Getting review helpful count', { reviewId });
      const count = await this.reviewRepository.getReviewHelpfulCount(reviewId);
      logger.info(`Review ${reviewId} has ${count} helpful votes`);
      return count;
    } catch (error) {
      logger.error('Error getting review helpful count:', { error: error.message, reviewId });
      throw error;
    }
  }

  async hasUserMarkedHelpful(reviewId, userId) {
    try {
      const marked = await this.reviewRepository.hasUserMarkedHelpful(reviewId, userId);
      return marked;
    } catch (error) {
      logger.error('Error checking if user marked helpful:', { error: error.message, reviewId, userId });
      throw error;
    }
  }

  async getReviewStats(placeId) {
    try {
      logger.info('Getting review stats', { placeId });
      const stats = await this.reviewRepository.getReviewStats(placeId);
      logger.info('Review stats retrieved', { placeId });
      return stats;
    } catch (error) {
      logger.error('Error getting review stats:', { error: error.message, placeId });
      throw error;
    }
  }

  async getUserReviewStats(userId) {
    try {
      logger.info('Getting user review stats', { userId });
      const stats = await this.reviewRepository.getUserReviewStats(userId);
      logger.info('User review stats retrieved', { userId });
      return stats;
    } catch (error) {
      logger.error('Error getting user review stats:', { error: error.message, userId });
      throw error;
    }
  }

  async searchReviews(searchTerm, limit = 20, offset = 0) {
    try {
      logger.info('Searching reviews', { searchTerm, limit, offset });
      const reviews = await this.reviewRepository.searchReviews(searchTerm, limit, offset);
      logger.info(`Found ${reviews.length} reviews matching "${searchTerm}"`);
      return reviews;
    } catch (error) {
      logger.error('Error searching reviews:', { error: error.message, searchTerm });
      throw error;
    }
  }

  async canUserReviewPlace(placeId, userId) {
    try {
      const canReview = await this.reviewRepository.canUserReviewPlace(placeId, userId);
      return canReview;
    } catch (error) {
      logger.error('Error checking if user can review place:', { error: error.message, placeId, userId });
      throw error;
    }
  }

  async getReviewWithDetails(reviewId) {
    try {
      logger.info('Getting review with details', { reviewId });
      const review = await this.reviewRepository.getReviewById(reviewId);

      if (!review) {
        return null;
      }

      // Agregar información adicional si es necesario
      const helpfulCount = await this.reviewRepository.getReviewHelpfulCount(reviewId);
      review.helpful_count = helpfulCount;

      logger.info('Review with details retrieved', { reviewId });
      return review;
    } catch (error) {
      logger.error('Error getting review with details:', { error: error.message, reviewId });
      throw error;
    }
  }
}

module.exports = ReviewService;
