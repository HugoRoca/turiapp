/**
 * Utility functions for handling filters and query parameters
 */

/**
 * Normalizes boolean filters from string values to integer values for MySQL
 * @param {Object} filters - The filters object
 * @param {Array} booleanFields - Array of field names that should be treated as booleans
 * @returns {Object} - Normalized filters object
 */
function normalizeBooleanFilters(filters, booleanFields = []) {
  const normalizedFilters = { ...filters };

  booleanFields.forEach((field) => {
    if (normalizedFilters[field] !== undefined && normalizedFilters[field] !== null) {
      const value = normalizedFilters[field];

      // Convert string boolean values to integers
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true' || value === '1') {
          normalizedFilters[field] = 1;
        } else if (value.toLowerCase() === 'false' || value === '0') {
          normalizedFilters[field] = 0;
        }
      } else if (typeof value === 'boolean') {
        normalizedFilters[field] = value ? 1 : 0;
      }
    }
  });

  return normalizedFilters;
}

/**
 * Normalizes numeric filters from string values to numbers
 * @param {Object} filters - The filters object
 * @param {Array} numericFields - Array of field names that should be treated as numbers
 * @returns {Object} - Normalized filters object
 */
function normalizeNumericFilters(filters, numericFields = []) {
  const normalizedFilters = { ...filters };

  numericFields.forEach((field) => {
    if (normalizedFilters[field] !== undefined && normalizedFilters[field] !== null) {
      const value = normalizedFilters[field];

      if (typeof value === 'string' && !isNaN(parseFloat(value))) {
        normalizedFilters[field] = parseFloat(value);
      }
    }
  });

  return normalizedFilters;
}

/**
 * Normalizes all filters for places
 * @param {Object} filters - The filters object
 * @returns {Object} - Normalized filters object with separate pagination params
 */
function normalizePlaceFilters(filters) {
  const booleanFields = ['is_active', 'is_verified', 'is_featured'];
  const numericFields = ['min_rating', 'max_rating'];
  const paginationFields = ['limit', 'offset'];

  // Separate pagination from filter fields
  const { limit, offset, ...filterFields } = filters;

  let normalized = normalizeBooleanFilters(filterFields, booleanFields);
  normalized = normalizeNumericFilters(normalized, numericFields);

  // Add pagination back if provided
  if (limit !== undefined && limit !== null && limit !== '') {
    normalized.limit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  }
  if (offset !== undefined && offset !== null && offset !== '') {
    normalized.offset = typeof offset === 'string' ? parseInt(offset, 10) : offset;
  }

  return normalized;
}

module.exports = {
  normalizeBooleanFilters,
  normalizeNumericFilters,
  normalizePlaceFilters,
};
