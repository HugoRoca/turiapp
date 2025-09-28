/* eslint-disable max-len */
const PersonRepository = require('../repositories/PersonRepository');
const logger = require('../utils/logger');

class PersonService {
  constructor() {
    this.personRepository = new PersonRepository();
  }

  async getPersonByUserId(userId) {
    try {
      logger.info('Getting person by user ID', { userId });
      const person = await this.personRepository.findByUserId(userId);
      if (!person) {
        logger.warn('Person profile not found', { userId });
        return null;
      }
      logger.info('Person profile found', { userId });
      return person;
    } catch (error) {
      logger.error('Error getting person by user ID:', { error: error.message, userId });
      throw error;
    }
  }

  async getPublicProfiles(limit = 20, offset = 0) {
    try {
      logger.info('Getting public profiles', { limit, offset });
      const profiles = await this.personRepository.findPublicProfiles(limit, offset);
      logger.info(`Retrieved ${profiles.length} public profiles`);
      return profiles;
    } catch (error) {
      logger.error('Error getting public profiles:', { error: error.message });
      throw error;
    }
  }

  async getProfilesByLocation(country = null, city = null, limit = 20, offset = 0) {
    try {
      logger.info('Getting profiles by location', {
        country, city, limit, offset,
      });
      const profiles = await this.personRepository.findProfilesByLocation(country, city, limit, offset);
      logger.info(`Retrieved ${profiles.length} profiles for location`);
      return profiles;
    } catch (error) {
      logger.error('Error getting profiles by location:', { error: error.message, country, city });
      throw error;
    }
  }

  async getProfilesByInterests(interests, limit = 20, offset = 0) {
    try {
      logger.info('Getting profiles by interests', { interests, limit, offset });
      const profiles = await this.personRepository.findProfilesByInterests(interests, limit, offset);
      logger.info(`Retrieved ${profiles.length} profiles with matching interests`);
      return profiles;
    } catch (error) {
      logger.error('Error getting profiles by interests:', { error: error.message, interests });
      throw error;
    }
  }

  async getProfilesByLanguages(languages, limit = 20, offset = 0) {
    try {
      logger.info('Getting profiles by languages', { languages, limit, offset });
      const profiles = await this.personRepository.findProfilesByLanguages(languages, limit, offset);
      logger.info(`Retrieved ${profiles.length} profiles with matching languages`);
      return profiles;
    } catch (error) {
      logger.error('Error getting profiles by languages:', { error: error.message, languages });
      throw error;
    }
  }

  async getProfilesByNationality(nationality, limit = 20, offset = 0) {
    try {
      logger.info('Getting profiles by nationality', { nationality, limit, offset });
      const profiles = await this.personRepository.getProfilesByNationality(nationality, limit, offset);
      logger.info(`Retrieved ${profiles.length} profiles for nationality ${nationality}`);
      return profiles;
    } catch (error) {
      logger.error('Error getting profiles by nationality:', { error: error.message, nationality });
      throw error;
    }
  }

  async searchProfiles(searchTerm, limit = 20, offset = 0) {
    try {
      logger.info('Searching profiles', { searchTerm, limit, offset });
      const profiles = await this.personRepository.searchProfiles(searchTerm, limit, offset);
      logger.info(`Found ${profiles.length} profiles matching "${searchTerm}"`);
      return profiles;
    } catch (error) {
      logger.error('Error searching profiles:', { error: error.message, searchTerm });
      throw error;
    }
  }

  async getPopularProfiles(limit = 10) {
    try {
      logger.info('Getting popular profiles', { limit });
      const profiles = await this.personRepository.getPopularProfiles(limit);
      logger.info(`Retrieved ${profiles.length} popular profiles`);
      return profiles;
    } catch (error) {
      logger.error('Error getting popular profiles:', { error: error.message });
      throw error;
    }
  }

  async createPersonProfile(userId, personData) {
    try {
      logger.info('Creating person profile', { userId });

      // Verificar si ya existe un perfil para este usuario
      const existingProfile = await this.personRepository.findByUserId(userId);
      if (existingProfile) {
        throw new Error('Person profile already exists for this user');
      }

      // Validar datos
      if (personData.languages && !Array.isArray(personData.languages)) {
        throw new Error('Languages must be an array');
      }

      if (personData.interests && !Array.isArray(personData.interests)) {
        throw new Error('Interests must be an array');
      }

      if (personData.socialLinks && typeof personData.socialLinks !== 'object') {
        throw new Error('Social links must be an object');
      }

      const personId = await this.personRepository.createPersonProfile(userId, personData);

      logger.info('Person profile created successfully', { personId, userId });
      return personId;
    } catch (error) {
      logger.error('Error creating person profile:', { error: error.message, userId, personData });
      throw error;
    }
  }

  async updatePersonProfile(userId, personData) {
    try {
      logger.info('Updating person profile', { userId });

      const existingProfile = await this.personRepository.findByUserId(userId);
      if (!existingProfile) {
        logger.warn('Person profile not found for update', { userId });
        throw new Error('Person profile not found');
      }

      // Validar datos si se proporcionan
      if (personData.languages && !Array.isArray(personData.languages)) {
        throw new Error('Languages must be an array');
      }

      if (personData.interests && !Array.isArray(personData.interests)) {
        throw new Error('Interests must be an array');
      }

      if (personData.socialLinks && typeof personData.socialLinks !== 'object') {
        throw new Error('Social links must be an object');
      }

      const updated = await this.personRepository.updatePersonProfile(userId, personData);

      if (updated) {
        logger.info('Person profile updated successfully', { userId });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error updating person profile:', { error: error.message, userId, personData });
      throw error;
    }
  }

  async getPersonStats(userId) {
    try {
      logger.info('Getting person stats', { userId });
      const stats = await this.personRepository.getPersonStats(userId);
      if (!stats) {
        logger.warn('Person stats not found', { userId });
        return null;
      }
      logger.info('Person stats retrieved', { userId });
      return stats;
    } catch (error) {
      logger.error('Error getting person stats:', { error: error.message, userId });
      throw error;
    }
  }

  async getLocationStats() {
    try {
      logger.info('Getting location stats');
      const stats = await this.personRepository.getLocationStats();
      logger.info(`Retrieved location stats for ${stats.length} locations`);
      return stats;
    } catch (error) {
      logger.error('Error getting location stats:', { error: error.message });
      throw error;
    }
  }

  async getNationalityStats() {
    try {
      logger.info('Getting nationality stats');
      const stats = await this.personRepository.getNationalityStats();
      logger.info(`Retrieved nationality stats for ${stats.length} nationalities`);
      return stats;
    } catch (error) {
      logger.error('Error getting nationality stats:', { error: error.message });
      throw error;
    }
  }

  async updateProfileVisibility(userId, isPublic) {
    try {
      logger.info('Updating profile visibility', { userId, isPublic });

      const updated = await this.personRepository.updatePersonProfile(userId, { isPublic });

      if (updated) {
        logger.info('Profile visibility updated successfully', { userId, isPublic });
      }

      return updated;
    } catch (error) {
      logger.error('Error updating profile visibility:', { error: error.message, userId, isPublic });
      throw error;
    }
  }

  async addInterest(userId, interest) {
    try {
      logger.info('Adding interest to profile', { userId, interest });

      const existingProfile = await this.personRepository.findByUserId(userId);
      if (!existingProfile) {
        throw new Error('Person profile not found');
      }

      const currentInterests = existingProfile.interests || [];
      if (!currentInterests.includes(interest)) {
        currentInterests.push(interest);
        const updated = await this.personRepository.updatePersonProfile(userId, { interests: currentInterests });

        if (updated) {
          logger.info('Interest added successfully', { userId, interest });
        }
        return updated;
      }

      return true; // Ya existe el interés
    } catch (error) {
      logger.error('Error adding interest:', { error: error.message, userId, interest });
      throw error;
    }
  }

  async removeInterest(userId, interest) {
    try {
      logger.info('Removing interest from profile', { userId, interest });

      const existingProfile = await this.personRepository.findByUserId(userId);
      if (!existingProfile) {
        throw new Error('Person profile not found');
      }

      const currentInterests = existingProfile.interests || [];
      const updatedInterests = currentInterests.filter((i) => i !== interest);

      const updated = await this.personRepository.updatePersonProfile(userId, { interests: updatedInterests });

      if (updated) {
        logger.info('Interest removed successfully', { userId, interest });
      }

      return updated;
    } catch (error) {
      logger.error('Error removing interest:', { error: error.message, userId, interest });
      throw error;
    }
  }

  async addLanguage(userId, language) {
    try {
      logger.info('Adding language to profile', { userId, language });

      const existingProfile = await this.personRepository.findByUserId(userId);
      if (!existingProfile) {
        throw new Error('Person profile not found');
      }

      const currentLanguages = existingProfile.languages || [];
      if (!currentLanguages.includes(language)) {
        currentLanguages.push(language);
        const updated = await this.personRepository.updatePersonProfile(userId, { languages: currentLanguages });

        if (updated) {
          logger.info('Language added successfully', { userId, language });
        }
        return updated;
      }

      return true; // Ya existe el idioma
    } catch (error) {
      logger.error('Error adding language:', { error: error.message, userId, language });
      throw error;
    }
  }

  async removeLanguage(userId, language) {
    try {
      logger.info('Removing language from profile', { userId, language });

      const existingProfile = await this.personRepository.findByUserId(userId);
      if (!existingProfile) {
        throw new Error('Person profile not found');
      }

      const currentLanguages = existingProfile.languages || [];
      const updatedLanguages = currentLanguages.filter((l) => l !== language);

      const updated = await this.personRepository.updatePersonProfile(userId, { languages: updatedLanguages });

      if (updated) {
        logger.info('Language removed successfully', { userId, language });
      }

      return updated;
    } catch (error) {
      logger.error('Error removing language:', { error: error.message, userId, language });
      throw error;
    }
  }
}

module.exports = PersonService;
