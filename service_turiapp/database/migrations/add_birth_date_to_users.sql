-- Migration: Add birth_date field to users table
-- Date: 2025-09-29
-- Description: Add birth_date field to users table for registration endpoint

USE turiapp_db;

-- Add birth_date column to users table
ALTER TABLE users 
ADD COLUMN birth_date DATE AFTER avatar_url;

-- Add index for birth_date if needed for queries
-- ALTER TABLE users ADD INDEX idx_birth_date (birth_date);

-- Update existing users with NULL birth_date (optional)
-- UPDATE users SET birth_date = NULL WHERE birth_date IS NULL;
