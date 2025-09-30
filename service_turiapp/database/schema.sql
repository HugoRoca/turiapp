-- TuriApp Database Schema
-- Aplicación de turismo y lugares de interés

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS turiapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE turiapp_db;

-- Tabla de usuarios (autenticación)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    birth_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- Tabla de personas (perfiles extendidos)
CREATE TABLE IF NOT EXISTS persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bio TEXT,
    birth_date DATE,
    nationality VARCHAR(100),
    languages JSON, -- Array de idiomas que habla
    interests JSON, -- Array de intereses/tags
    social_links JSON, -- Redes sociales
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    location_coordinates POINT NOT NULL, -- Para geolocalización
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_location_country (location_country),
    INDEX idx_location_city (location_city),
    SPATIAL INDEX idx_coordinates (location_coordinates)
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    color_code VARCHAR(7), -- Código hexadecimal del color
    parent_id INT NULL, -- Para subcategorías
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
);

-- Tabla de lugares
CREATE TABLE IF NOT EXISTS places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL, -- Latitud
    longitude DECIMAL(11, 8) NOT NULL, -- Longitud
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    price_range ENUM('free', 'low', 'medium', 'high', 'luxury') DEFAULT 'free',
    opening_hours JSON, -- Horarios de apertura por día
    amenities JSON, -- Servicios disponibles
    images JSON, -- URLs de imágenes
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_visits INT DEFAULT 0,
    created_by INT NOT NULL, -- Usuario que creó el lugar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active),
    INDEX idx_is_verified (is_verified),
    INDEX idx_is_featured (is_featured),
    INDEX idx_average_rating (average_rating),
    INDEX idx_created_by (created_by),
    INDEX idx_latitude (latitude),
    INDEX idx_longitude (longitude),
    INDEX idx_location (latitude, longitude)
);

-- Tabla de relación lugar-categoría (muchos a muchos)
CREATE TABLE IF NOT EXISTS place_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_place_category (place_id, category_id),
    INDEX idx_place_id (place_id),
    INDEX idx_category_id (category_id)
);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    images JSON, -- URLs de imágenes de la reseña
    is_verified BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_place_review (user_id, place_id),
    INDEX idx_place_id (place_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    INDEX idx_is_public (is_public)
);

-- Tabla de comentarios (respuestas a reseñas)
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_id INT NULL, -- Para respuestas anidadas
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_review_id (review_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at)
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_place_favorite (user_id, place_id),
    INDEX idx_user_id (user_id),
    INDEX idx_place_id (place_id)
);

-- Tabla de visitas (historial de lugares visitados)
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    visit_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_place_id (place_id),
    INDEX idx_visit_date (visit_date)
);

-- Tabla de reportes/denuncias
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    reported_type ENUM('place', 'review', 'comment', 'user') NOT NULL,
    reported_id INT NOT NULL,
    reason ENUM('spam', 'inappropriate', 'fake', 'harassment', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_reported_type (reported_type),
    INDEX idx_reported_id (reported_id),
    INDEX idx_status (status)
);