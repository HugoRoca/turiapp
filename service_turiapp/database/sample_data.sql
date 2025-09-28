-- TuriApp Sample Data
-- Datos de ejemplo para la aplicación

USE turiapp_db;

-- Insertar categorías
INSERT INTO categories (name, description, icon_url, color_code, sort_order) VALUES
('Restaurantes', 'Lugares para comer y beber', '🍽️', '#FF6B6B', 1),
('Hoteles', 'Alojamiento y hospedaje', '🏨', '#4ECDC4', 2),
('Atracciones', 'Lugares turísticos y de interés', '🎯', '#45B7D1', 3),
('Transporte', 'Servicios de transporte', '🚗', '#96CEB4', 4),
('Compras', 'Tiendas y centros comerciales', '🛍️', '#FFEAA7', 5),
('Entretenimiento', 'Cines, teatros, bares', '🎭', '#DDA0DD', 6),
('Naturaleza', 'Parques, playas, montañas', '🌲', '#98D8C8', 7),
('Cultura', 'Museos, galerías, monumentos', '🏛️', '#F7DC6F', 8);

-- Insertar subcategorías
INSERT INTO categories (name, description, parent_id, sort_order) VALUES
('Comida Rápida', 'Restaurantes de comida rápida', 1, 1),
('Fine Dining', 'Restaurantes de alta cocina', 1, 2),
('Cafeterías', 'Cafés y lugares para desayunar', 1, 3),
('Hoteles 5 Estrellas', 'Hoteles de lujo', 2, 1),
('Hoteles Económicos', 'Hoteles y hostales económicos', 2, 2),
('Parques Nacionales', 'Parques y reservas naturales', 7, 1),
('Playas', 'Playas y costas', 7, 2);

-- Insertar usuarios de ejemplo
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, is_verified, role) VALUES
('admin', 'admin@turiapp.com', '$2b$10$example_hash_admin', 'Admin', 'User', '+1234567890', TRUE, 'admin'),
('juan_perez', 'juan.perez@example.com', '$2b$10$example_hash_juan', 'Juan', 'Pérez', '+1234567891', TRUE, 'user'),
('maria_garcia', 'maria.garcia@example.com', '$2b$10$example_hash_maria', 'María', 'García', '+1234567892', TRUE, 'user'),
('carlos_lopez', 'carlos.lopez@example.com', '$2b$10$example_hash_carlos', 'Carlos', 'López', '+1234567893', FALSE, 'user'),
('ana_martinez', 'ana.martinez@example.com', '$2b$10$example_hash_ana', 'Ana', 'Martínez', '+1234567894', TRUE, 'user'),
('luis_rodriguez', 'luis.rodriguez@example.com', '$2b$10$example_hash_luis', 'Luis', 'Rodríguez', '+1234567895', TRUE, 'user');

-- Insertar perfiles de personas
INSERT INTO persons (user_id, bio, birth_date, nationality, languages, interests, location_country, location_city, location_coordinates) VALUES
(1, 'Administrador de TuriApp', '1985-01-15', 'Español', '["español", "inglés"]', '["tecnología", "viajes", "gastronomía"]', 'España', 'Madrid', POINT(-3.7038, 40.4168)),
(2, 'Viajero apasionado y foodie', '1990-05-20', 'Mexicano', '["español", "inglés", "francés"]', '["gastronomía", "fotografía", "aventura"]', 'México', 'Ciudad de México', POINT(-99.1332, 19.4326)),
(3, 'Blogger de viajes y turismo', '1988-12-10', 'Colombiana', '["español", "inglés", "portugués"]', '["viajes", "cultura", "historia"]', 'Colombia', 'Bogotá', POINT(-74.0721, 4.7110)),
(4, 'Guía turístico local', '1982-08-25', 'Peruano', '["español", "inglés", "quechua"]', '["historia", "arqueología", "naturaleza"]', 'Perú', 'Cusco', POINT(-71.9673, -13.5319)),
(5, 'Fotógrafa de paisajes', '1995-03-14', 'Argentina', '["español", "inglés", "italiano"]', '["fotografía", "naturaleza", "arte"]', 'Argentina', 'Buenos Aires', POINT(-58.3816, -34.6037)),
(6, 'Chef y crítico gastronómico', '1987-11-30', 'Chileno', '["español", "inglés", "francés"]', '["gastronomía", "vino", "cocina"]', 'Chile', 'Santiago', POINT(-70.6483, -33.4489));

-- Insertar lugares de ejemplo
INSERT INTO places (name, description, short_description, address, latitude, longitude, phone, email, website, price_range, opening_hours, amenities, images, is_verified, is_featured, created_by) VALUES
('Restaurante El Gourmet', 'Restaurante de alta cocina con especialidades locales e internacionales. Ambiente elegante y servicio excepcional.', 'Alta cocina en el corazón de la ciudad', 'Calle Principal 123, Centro', 40.4168, -3.7038, '+34 91 123 4567', 'info@elgourmet.com', 'https://elgourmet.com', 'high', '{"monday": "12:00-15:00, 20:00-23:00", "tuesday": "12:00-15:00, 20:00-23:00", "wednesday": "12:00-15:00, 20:00-23:00", "thursday": "12:00-15:00, 20:00-23:00", "friday": "12:00-15:00, 20:00-24:00", "saturday": "12:00-24:00", "sunday": "12:00-22:00"}', '["wifi", "parking", "terrace", "air_conditioning"]', '["https://example.com/restaurant1.jpg", "https://example.com/restaurant2.jpg"]', TRUE, TRUE, 1),

('Hotel Plaza Central', 'Hotel de 4 estrellas ubicado en el centro histórico. Habitaciones modernas con todas las comodidades.', 'Hotel céntrico con todas las comodidades', 'Plaza Mayor 45, Centro Histórico', 40.4168, -3.7038, '+34 91 234 5678', 'reservas@hotelplaza.com', 'https://hotelplaza.com', 'medium', '{"check_in": "15:00", "check_out": "12:00", "reception": "24/7"}', '["wifi", "parking", "gym", "spa", "restaurant", "bar"]', '["https://example.com/hotel1.jpg", "https://example.com/hotel2.jpg"]', TRUE, TRUE, 1),

('Museo de Arte Moderno', 'Museo que alberga una impresionante colección de arte contemporáneo y moderno de artistas nacionales e internacionales.', 'Arte moderno y contemporáneo', 'Avenida Cultural 789, Distrito de Arte', 40.4168, -3.7038, '+34 91 345 6789', 'info@museoartemoderno.com', 'https://museoartemoderno.com', 'low', '{"monday": "closed", "tuesday": "10:00-18:00", "wednesday": "10:00-18:00", "thursday": "10:00-20:00", "friday": "10:00-18:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}', '["wifi", "gift_shop", "cafe", "guided_tours"]', '["https://example.com/museum1.jpg", "https://example.com/museum2.jpg"]', TRUE, FALSE, 1),

('Parque Natural Sierra Verde', 'Hermoso parque natural con senderos para caminar, áreas de picnic y vistas panorámicas espectaculares.', 'Naturaleza y senderismo', 'Carretera de la Sierra, Km 15', 40.4168, -3.7038, '+34 91 456 7890', 'info@parquesierraverde.com', 'https://parquesierraverde.com', 'free', '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "08:00-20:00", "sunday": "08:00-20:00"}', '["parking", "picnic_areas", "hiking_trails", "visitor_center"]', '["https://example.com/park1.jpg", "https://example.com/park2.jpg"]', TRUE, TRUE, 1),

('Café Central', 'Acogedor café en el centro de la ciudad, perfecto para desayunos, almuerzos ligeros y reuniones de trabajo.', 'Café acogedor en el centro', 'Calle Comercial 321, Centro', 40.4168, -3.7038, '+34 91 567 8901', 'hola@cafecentral.com', 'https://cafecentral.com', 'low', '{"monday": "07:00-20:00", "tuesday": "07:00-20:00", "wednesday": "07:00-20:00", "thursday": "07:00-20:00", "friday": "07:00-22:00", "saturday": "08:00-22:00", "sunday": "08:00-20:00"}', '["wifi", "outdoor_seating", "takeaway"]', '["https://example.com/cafe1.jpg", "https://example.com/cafe2.jpg"]', TRUE, FALSE, 1);

-- Insertar relaciones lugar-categoría
INSERT INTO place_categories (place_id, category_id) VALUES
(1, 1), (1, 2), -- Restaurante El Gourmet: Restaurantes, Fine Dining
(2, 2), (2, 4), -- Hotel Plaza Central: Hoteles, Hoteles 5 Estrellas
(3, 8), -- Museo de Arte Moderno: Cultura
(4, 7), (4, 1), -- Parque Natural Sierra Verde: Naturaleza, Parques Nacionales
(5, 1), (5, 3); -- Café Central: Restaurantes, Cafeterías

-- Insertar reseñas de ejemplo
INSERT INTO reviews (place_id, user_id, rating, title, content, images, is_verified) VALUES
(1, 2, 5, 'Experiencia gastronómica excepcional', 'La comida es simplemente increíble. Cada plato es una obra de arte. El servicio es impecable y el ambiente muy elegante. Definitivamente volveré.', '["https://example.com/review1.jpg"]', TRUE),
(1, 3, 4, 'Muy buena comida, precio elevado', 'La calidad de la comida es excelente, pero los precios son bastante altos. El servicio es bueno y el ambiente agradable.', NULL, TRUE),
(2, 2, 5, 'Hotel perfecto para una escapada', 'Habitaciones muy cómodas, desayuno excelente y ubicación perfecta. El personal es muy amable y servicial.', '["https://example.com/review2.jpg"]', TRUE),
(2, 4, 4, 'Buen hotel, algunas mejoras necesarias', 'En general es un buen hotel, pero el wifi podría ser más rápido y las habitaciones necesitan una renovación menor.', NULL, TRUE),
(3, 3, 5, 'Museo impresionante', 'Una colección increíble de arte moderno. Las exposiciones temporales son siempre muy interesantes. Recomendado para amantes del arte.', '["https://example.com/review3.jpg"]', TRUE),
(4, 5, 5, 'Parque hermoso para caminar', 'Perfecto para una caminata en familia. Los senderos están bien mantenidos y las vistas son espectaculares. Ideal para desconectar.', NULL, TRUE),
(5, 2, 4, 'Café acogedor', 'Buen café y ambiente relajado. Perfecto para trabajar o leer. Los precios son razonables.', NULL, TRUE);

-- Insertar comentarios de ejemplo
INSERT INTO comments (review_id, user_id, content) VALUES
(1, 1, 'Gracias por tu reseña detallada. Nos alegra saber que disfrutaste la experiencia.'),
(1, 3, 'Estoy de acuerdo, la comida es realmente excepcional.'),
(2, 1, 'Apreciamos tu feedback. Trabajamos constantemente para mejorar nuestros precios.'),
(3, 1, '¡Excelente! Nos complace saber que tuviste una estancia agradable.'),
(4, 1, 'Gracias por tus comentarios. Estamos trabajando en mejorar el wifi y renovar las habitaciones.'),
(5, 1, 'Nos alegra saber que disfrutaste de nuestras exposiciones.'),
(6, 1, '¡Perfecto! El parque es ideal para disfrutar de la naturaleza.'),
(7, 1, 'Gracias por tu reseña. Nos esforzamos por crear un ambiente acogedor.');

-- Insertar favoritos de ejemplo
INSERT INTO favorites (user_id, place_id) VALUES
(2, 1), (2, 2), (2, 4), -- Juan Pérez tiene varios favoritos
(3, 1), (3, 3), (3, 5), -- María García tiene otros favoritos
(4, 2), (4, 4), -- Carlos López tiene algunos favoritos
(5, 3), (5, 4), (5, 5), -- Ana Martínez tiene varios favoritos
(6, 1), (6, 2); -- Luis Rodríguez tiene algunos favoritos

-- Insertar visitas de ejemplo
INSERT INTO visits (user_id, place_id, visit_date, notes) VALUES
(2, 1, '2024-01-15', 'Cena romántica, muy recomendable'),
(2, 2, '2024-01-20', 'Estancia de fin de semana, excelente servicio'),
(3, 1, '2024-01-18', 'Almuerzo de negocios, ambiente profesional'),
(3, 3, '2024-01-25', 'Exposición temporal muy interesante'),
(4, 2, '2024-01-22', 'Hotel cómodo para viaje de trabajo'),
(5, 4, '2024-01-28', 'Caminata matutina, vistas increíbles'),
(6, 1, '2024-01-30', 'Cena con clientes, impresión excelente');

-- Actualizar estadísticas de lugares usando stored procedures
CALL UpdatePlaceRating(1);
CALL UpdatePlaceRating(2);
CALL UpdatePlaceRating(3);
CALL UpdatePlaceRating(4);
CALL UpdatePlaceRating(5);
