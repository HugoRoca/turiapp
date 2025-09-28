-- TuriApp Stored Procedures
-- Lógica de negocio en la base de datos

USE turiapp_db;

DELIMITER //

-- Procedimiento para actualizar el rating promedio de un lugar
CREATE PROCEDURE UpdatePlaceRating(IN place_id INT)
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE total_reviews_count INT;
    
    -- Calcular rating promedio y total de reseñas
    SELECT 
        COALESCE(AVG(rating), 0.00),
        COUNT(*)
    INTO avg_rating, total_reviews_count
    FROM reviews 
    WHERE place_id = place_id AND is_public = TRUE;
    
    -- Actualizar el lugar
    UPDATE places 
    SET 
        average_rating = avg_rating,
        total_reviews = total_reviews_count,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = place_id;
END //

-- Procedimiento para crear una reseña y actualizar estadísticas
CREATE PROCEDURE CreateReview(
    IN p_place_id INT,
    IN p_user_id INT,
    IN p_rating INT,
    IN p_title VARCHAR(200),
    IN p_content TEXT,
    IN p_images JSON
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insertar la reseña
    INSERT INTO reviews (place_id, user_id, rating, title, content, images)
    VALUES (p_place_id, p_user_id, p_rating, p_title, p_content, p_images);
    
    -- Actualizar estadísticas del lugar
    CALL UpdatePlaceRating(p_place_id);
    
    COMMIT;
END //

-- Procedimiento para actualizar una reseña
CREATE PROCEDURE UpdateReview(
    IN p_review_id INT,
    IN p_user_id INT,
    IN p_rating INT,
    IN p_title VARCHAR(200),
    IN p_content TEXT,
    IN p_images JSON
)
BEGIN
    DECLARE place_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Obtener el place_id de la reseña
    SELECT place_id INTO place_id FROM reviews WHERE id = p_review_id AND user_id = p_user_id;
    
    IF place_id IS NOT NULL THEN
        -- Actualizar la reseña
        UPDATE reviews 
        SET 
            rating = p_rating,
            title = p_title,
            content = p_content,
            images = p_images,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_review_id AND user_id = p_user_id;
        
        -- Actualizar estadísticas del lugar
        CALL UpdatePlaceRating(place_id);
    END IF;
    
    COMMIT;
END //

-- Procedimiento para eliminar una reseña
CREATE PROCEDURE DeleteReview(IN p_review_id INT, IN p_user_id INT)
BEGIN
    DECLARE place_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Obtener el place_id de la reseña
    SELECT place_id INTO place_id FROM reviews WHERE id = p_review_id AND user_id = p_user_id;
    
    IF place_id IS NOT NULL THEN
        -- Eliminar la reseña
        DELETE FROM reviews WHERE id = p_review_id AND user_id = p_user_id;
        
        -- Actualizar estadísticas del lugar
        CALL UpdatePlaceRating(place_id);
    END IF;
    
    COMMIT;
END //

-- Procedimiento para buscar lugares cercanos
CREATE PROCEDURE FindNearbyPlaces(
    IN p_latitude DECIMAL(10, 8),
    IN p_longitude DECIMAL(11, 8),
    IN p_radius_km DECIMAL(8, 2),
    IN p_limit INT
)
BEGIN
    SELECT 
        p.id,
        p.name,
        p.description,
        p.short_description,
        p.address,
        p.latitude,
        p.longitude,
        p.phone,
        p.email,
        p.website,
        p.price_range,
        p.average_rating,
        p.total_reviews,
        p.is_verified,
        p.is_featured,
        (
            6371 * acos(
                cos(radians(p_latitude)) 
                * cos(radians(p.latitude)) 
                * cos(radians(p.longitude) - radians(p_longitude)) 
                + sin(radians(p_latitude)) 
                * sin(radians(p.latitude))
            )
        ) AS distance_km,
        GROUP_CONCAT(c.name SEPARATOR ', ') as categories
    FROM places p
    LEFT JOIN place_categories pc ON p.id = pc.place_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE p.is_active = TRUE
    HAVING distance_km <= p_radius_km
    ORDER BY distance_km ASC, p.average_rating DESC
    LIMIT p_limit;
END //

-- Procedimiento para obtener estadísticas de un lugar
CREATE PROCEDURE GetPlaceStats(IN p_place_id INT)
BEGIN
    SELECT 
        p.id,
        p.name,
        p.average_rating,
        p.total_reviews,
        p.total_visits,
        COUNT(DISTINCT f.id) as total_favorites,
        COUNT(DISTINCT v.id) as total_visits_by_users,
        COUNT(DISTINCT CASE WHEN r.rating = 5 THEN r.id END) as five_star_reviews,
        COUNT(DISTINCT CASE WHEN r.rating = 4 THEN r.id END) as four_star_reviews,
        COUNT(DISTINCT CASE WHEN r.rating = 3 THEN r.id END) as three_star_reviews,
        COUNT(DISTINCT CASE WHEN r.rating = 2 THEN r.id END) as two_star_reviews,
        COUNT(DISTINCT CASE WHEN r.rating = 1 THEN r.id END) as one_star_reviews
    FROM places p
    LEFT JOIN reviews r ON p.id = r.place_id AND r.is_public = TRUE
    LEFT JOIN favorites f ON p.id = f.place_id
    LEFT JOIN visits v ON p.id = v.place_id
    WHERE p.id = p_place_id
    GROUP BY p.id;
END //

-- Procedimiento para obtener lugares populares
CREATE PROCEDURE GetPopularPlaces(
    IN p_limit INT,
    IN p_category_id INT
)
BEGIN
    SELECT 
        p.id,
        p.name,
        p.short_description,
        p.address,
        p.latitude,
        p.longitude,
        p.average_rating,
        p.total_reviews,
        p.total_visits,
        p.is_verified,
        p.is_featured,
        COUNT(DISTINCT f.id) as favorites_count,
        GROUP_CONCAT(c.name SEPARATOR ', ') as categories
    FROM places p
    LEFT JOIN place_categories pc ON p.id = pc.place_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN favorites f ON p.id = f.place_id
    WHERE p.is_active = TRUE
    AND (p_category_id IS NULL OR pc.category_id = p_category_id)
    GROUP BY p.id
    ORDER BY 
        (p.average_rating * 0.4 + (p.total_reviews / 100) * 0.3 + (p.total_visits / 1000) * 0.3) DESC,
        p.is_featured DESC,
        p.created_at DESC
    LIMIT p_limit;
END //

-- Procedimiento para obtener reseñas de un lugar con paginación
CREATE PROCEDURE GetPlaceReviews(
    IN p_place_id INT,
    IN p_offset INT,
    IN p_limit INT,
    IN p_rating_filter INT
)
BEGIN
    SELECT 
        r.id,
        r.rating,
        r.title,
        r.content,
        r.images,
        r.helpful_count,
        r.created_at,
        u.id as user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.avatar_url,
        pr.bio,
        COUNT(DISTINCT c.id) as comments_count
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN persons pr ON u.id = pr.user_id
    LEFT JOIN comments c ON r.id = c.review_id AND c.is_public = TRUE
    WHERE r.place_id = p_place_id 
    AND r.is_public = TRUE
    AND (p_rating_filter IS NULL OR r.rating = p_rating_filter)
    GROUP BY r.id
    ORDER BY r.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END //

-- Procedimiento para marcar una reseña como útil
CREATE PROCEDURE MarkReviewHelpful(IN p_review_id INT, IN p_user_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verificar si el usuario ya marcó esta reseña como útil
    IF NOT EXISTS (
        SELECT 1 FROM review_helpful 
        WHERE review_id = p_review_id AND user_id = p_user_id
    ) THEN
        -- Insertar el voto útil
        INSERT INTO review_helpful (review_id, user_id) 
        VALUES (p_review_id, p_user_id);
        
        -- Actualizar el contador
        UPDATE reviews 
        SET helpful_count = helpful_count + 1 
        WHERE id = p_review_id;
    END IF;
    
    COMMIT;
END //

-- Procedimiento para obtener dashboard de usuario
CREATE PROCEDURE GetUserDashboard(IN p_user_id INT)
BEGIN
    SELECT 
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.avatar_url,
        u.created_at as member_since,
        COUNT(DISTINCT r.id) as total_reviews,
        COUNT(DISTINCT f.id) as total_favorites,
        COUNT(DISTINCT v.id) as total_visits,
        COUNT(DISTINCT c.id) as total_comments,
        AVG(r.rating) as average_rating_given,
        COUNT(DISTINCT CASE WHEN r.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN r.id END) as recent_reviews
    FROM users u
    LEFT JOIN reviews r ON u.id = r.user_id AND r.is_public = TRUE
    LEFT JOIN favorites f ON u.id = f.user_id
    LEFT JOIN visits v ON u.id = v.user_id
    LEFT JOIN comments c ON u.id = c.user_id AND c.is_public = TRUE
    WHERE u.id = p_user_id
    GROUP BY u.id;
END //

DELIMITER ;

-- Crear tabla para votos útiles en reseñas
CREATE TABLE IF NOT EXISTS review_helpful (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_review_helpful (user_id, review_id),
    INDEX idx_review_id (review_id),
    INDEX idx_user_id (user_id)
);
