const swaggerJSDoc = require('swagger-jsdoc');
const { koaSwagger } = require('koa2-swagger-ui');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TuriApp API',
      version: '1.0.0',
      description: 'API REST para el servicio de TuriApp desarrollada con Koa.js y MySQL',
      contact: {
        name: 'TuriApp Team',
        email: 'support@turiapp.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.turiapp.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'first_name', 'last_name'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario',
              example: 1,
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario único',
              example: 'juan_perez',
              minLength: 3,
              maxLength: 50,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario',
              example: 'juan.perez@example.com',
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan',
              minLength: 2,
              maxLength: 50,
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez',
              minLength: 2,
              maxLength: 50,
            },
            phone: {
              type: 'string',
              description: 'Número de teléfono del usuario',
              example: '+1234567890',
              minLength: 10,
              maxLength: 20,
            },
            avatar_url: {
              type: 'string',
              description: 'URL del avatar del usuario',
              example: 'https://example.com/avatar.jpg',
            },
            birth_date: {
              type: 'string',
              format: 'date',
              description: 'Fecha de nacimiento del usuario',
              example: '1990-05-15',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'moderator'],
              description: 'Rol del usuario',
              example: 'user',
              default: 'user',
            },
            is_active: {
              type: 'boolean',
              description: 'Estado activo del usuario',
              example: true,
              default: true,
            },
            is_verified: {
              type: 'boolean',
              description: 'Estado de verificación del usuario',
              example: true,
              default: false,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del usuario',
              example: '2024-01-01T00:00:00.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-01T00:00:00.000Z',
            },
            last_login: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del último login',
              example: '2024-01-01T00:00:00.000Z',
              nullable: true,
            },
          },
        },
        CreateUser: {
          type: 'object',
          required: ['username', 'email', 'password_hash', 'first_name', 'last_name'],
          properties: {
            username: {
              type: 'string',
              description: 'Nombre de usuario único',
              example: 'juan_perez',
              minLength: 3,
              maxLength: 50,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario',
              example: 'juan.perez@example.com',
            },
            password_hash: {
              type: 'string',
              description: 'Hash de la contraseña',
              example: '$2b$10$hashedpassword',
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan',
              minLength: 2,
              maxLength: 50,
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez',
              minLength: 2,
              maxLength: 50,
            },
            phone: {
              type: 'string',
              description: 'Número de teléfono del usuario',
              example: '+1234567890',
              minLength: 10,
              maxLength: 20,
            },
            avatar_url: {
              type: 'string',
              description: 'URL del avatar del usuario',
              example: 'https://example.com/avatar.jpg',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'moderator'],
              description: 'Rol del usuario',
              example: 'user',
              default: 'user',
            },
          },
        },
        UpdateUser: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Nombre de usuario único',
              example: 'juan_perez_updated',
              minLength: 3,
              maxLength: 50,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario',
              example: 'juan.perez.updated@example.com',
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan Carlos',
              minLength: 2,
              maxLength: 50,
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'Pérez García',
              minLength: 2,
              maxLength: 50,
            },
            phone: {
              type: 'string',
              description: 'Número de teléfono del usuario',
              example: '+1234567890',
              minLength: 10,
              maxLength: 20,
            },
            avatar_url: {
              type: 'string',
              description: 'URL del avatar del usuario',
              example: 'https://example.com/new-avatar.jpg',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'moderator'],
              description: 'Rol del usuario',
              example: 'user',
            },
            is_active: {
              type: 'boolean',
              description: 'Estado activo del usuario',
              example: true,
            },
            is_verified: {
              type: 'boolean',
              description: 'Estado de verificación del usuario',
              example: true,
            },
          },
        },
        Place: {
          type: 'object',
          required: ['name', 'address', 'latitude', 'longitude'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del lugar',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Nombre del lugar',
              example: 'Restaurante El Gourmet',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del lugar',
              example: 'Restaurante de alta cocina con especialidades locales',
            },
            short_description: {
              type: 'string',
              description: 'Descripción corta del lugar',
              example: 'Alta cocina en el corazón de la ciudad',
            },
            address: {
              type: 'string',
              description: 'Dirección del lugar',
              example: 'Calle Principal 123, Centro',
            },
            latitude: {
              type: 'number',
              format: 'float',
              description: 'Latitud del lugar',
              example: 40.4168,
            },
            longitude: {
              type: 'number',
              format: 'float',
              description: 'Longitud del lugar',
              example: -3.7038,
            },
            phone: {
              type: 'string',
              description: 'Teléfono del lugar',
              example: '+34 91 123 4567',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del lugar',
              example: 'info@elgourmet.com',
            },
            website: {
              type: 'string',
              description: 'Sitio web del lugar',
              example: 'https://elgourmet.com',
            },
            price_range: {
              type: 'string',
              enum: ['free', 'low', 'medium', 'high', 'luxury'],
              description: 'Rango de precios',
              example: 'high',
            },
            opening_hours: {
              type: 'object',
              description: 'Horarios de apertura',
              example: {
                monday: '12:00-15:00, 20:00-23:00',
                tuesday: '12:00-15:00, 20:00-23:00',
              },
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Amenidades del lugar',
              example: ['wifi', 'parking', 'terrace'],
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'URLs de imágenes del lugar',
              example: ['https://example.com/image1.jpg'],
            },
            is_verified: {
              type: 'boolean',
              description: 'Estado de verificación del lugar',
              example: true,
              default: false,
            },
            is_active: {
              type: 'boolean',
              description: 'Estado activo del lugar',
              example: true,
              default: true,
            },
            is_featured: {
              type: 'boolean',
              description: 'Lugar destacado',
              example: true,
              default: false,
            },
            average_rating: {
              type: 'number',
              format: 'float',
              description: 'Calificación promedio',
              example: 4.5,
            },
            total_reviews: {
              type: 'integer',
              description: 'Total de reseñas',
              example: 25,
            },
            total_visits: {
              type: 'integer',
              description: 'Total de visitas',
              example: 150,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-01T00:00:00.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreatePlace: {
          type: 'object',
          required: ['name', 'address', 'coordinates'],
          properties: {
            name: {
              type: 'string',
              description: 'Nombre del lugar',
              example: 'Nuevo Restaurante',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del lugar',
              example: 'Descripción del nuevo restaurante',
            },
            short_description: {
              type: 'string',
              description: 'Descripción corta del lugar',
              example: 'Descripción corta',
            },
            address: {
              type: 'string',
              description: 'Dirección del lugar',
              example: 'Nueva Dirección 456',
            },
            coordinates: {
              type: 'object',
              required: ['latitude', 'longitude'],
              properties: {
                latitude: {
                  type: 'number',
                  format: 'float',
                  description: 'Latitud del lugar',
                  example: 40.4168,
                },
                longitude: {
                  type: 'number',
                  format: 'float',
                  description: 'Longitud del lugar',
                  example: -3.7038,
                },
              },
            },
            phone: {
              type: 'string',
              description: 'Teléfono del lugar',
              example: '+34 91 123 4567',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del lugar',
              example: 'info@nuevorestaurante.com',
            },
            website: {
              type: 'string',
              description: 'Sitio web del lugar',
              example: 'https://nuevorestaurante.com',
            },
            price_range: {
              type: 'string',
              enum: ['free', 'low', 'medium', 'high', 'luxury'],
              description: 'Rango de precios',
              example: 'medium',
            },
            opening_hours: {
              type: 'object',
              description: 'Horarios de apertura',
              example: {
                monday: '12:00-15:00, 20:00-23:00',
              },
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Amenidades del lugar',
              example: ['wifi', 'parking'],
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'URLs de imágenes del lugar',
              example: ['https://example.com/image1.jpg'],
            },
            category_ids: {
              type: 'array',
              items: {
                type: 'integer',
              },
              description: 'IDs de categorías del lugar',
              example: [1, 2],
            },
          },
        },
        UpdatePlace: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nombre del lugar',
              example: 'Restaurante Actualizado',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del lugar',
              example: 'Nueva descripción',
            },
            short_description: {
              type: 'string',
              description: 'Descripción corta del lugar',
              example: 'Nueva descripción corta',
            },
            address: {
              type: 'string',
              description: 'Dirección del lugar',
              example: 'Nueva Dirección 789',
            },
            coordinates: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'number',
                  format: 'float',
                  description: 'Latitud del lugar',
                  example: 40.4168,
                },
                longitude: {
                  type: 'number',
                  format: 'float',
                  description: 'Longitud del lugar',
                  example: -3.7038,
                },
              },
            },
            phone: {
              type: 'string',
              description: 'Teléfono del lugar',
              example: '+34 91 123 4568',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del lugar',
              example: 'nuevo@restaurante.com',
            },
            website: {
              type: 'string',
              description: 'Sitio web del lugar',
              example: 'https://nuevorestaurante.com',
            },
            price_range: {
              type: 'string',
              enum: ['free', 'low', 'medium', 'high', 'luxury'],
              description: 'Rango de precios',
              example: 'high',
            },
            opening_hours: {
              type: 'object',
              description: 'Horarios de apertura',
              example: {
                monday: '12:00-15:00, 20:00-23:00',
              },
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Amenidades del lugar',
              example: ['wifi', 'parking', 'terrace'],
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'URLs de imágenes del lugar',
              example: ['https://example.com/new-image.jpg'],
            },
            category_ids: {
              type: 'array',
              items: {
                type: 'integer',
              },
              description: 'IDs de categorías del lugar',
              example: [1, 3],
            },
          },
        },
        Review: {
          type: 'object',
          required: ['place_id', 'user_id', 'rating', 'content'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la reseña',
              example: 1,
            },
            place_id: {
              type: 'integer',
              description: 'ID del lugar',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'ID del usuario',
              example: 1,
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Calificación (1-5)',
              example: 5,
            },
            title: {
              type: 'string',
              description: 'Título de la reseña',
              example: 'Excelente experiencia',
              maxLength: 200,
            },
            content: {
              type: 'string',
              description: 'Contenido de la reseña',
              example: 'La comida estuvo deliciosa y el servicio fue excepcional.',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'URLs de imágenes de la reseña',
              example: ['https://example.com/review1.jpg'],
            },
            is_verified: {
              type: 'boolean',
              description: 'Reseña verificada',
              example: true,
              default: false,
            },
            is_public: {
              type: 'boolean',
              description: 'Reseña pública',
              example: true,
              default: true,
            },
            helpful_count: {
              type: 'integer',
              description: 'Número de votos útiles',
              example: 10,
              default: 0,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-01T00:00:00.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateReview: {
          type: 'object',
          required: ['place_id', 'rating', 'content'],
          properties: {
            place_id: {
              type: 'integer',
              description: 'ID del lugar',
              example: 1,
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Calificación (1-5)',
              example: 5,
            },
            title: {
              type: 'string',
              description: 'Título de la reseña',
              example: 'Excelente experiencia',
              maxLength: 200,
            },
            content: {
              type: 'string',
              description: 'Contenido de la reseña',
              example: 'La comida estuvo deliciosa y el servicio fue excepcional.',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'URLs de imágenes de la reseña',
              example: ['https://example.com/review1.jpg'],
            },
          },
        },
        UpdateReview: {
          type: 'object',
          properties: {
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Calificación (1-5)',
              example: 4,
            },
            title: {
              type: 'string',
              description: 'Título de la reseña',
              example: 'Muy buena experiencia',
              maxLength: 200,
            },
            content: {
              type: 'string',
              description: 'Contenido de la reseña',
              example: 'La comida estuvo muy buena, aunque el servicio podría mejorar.',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'URLs de imágenes de la reseña',
              example: ['https://example.com/updated-review.jpg'],
            },
          },
        },
        Comment: {
          type: 'object',
          required: ['review_id', 'user_id', 'content'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del comentario',
              example: 1,
            },
            review_id: {
              type: 'integer',
              description: 'ID de la reseña',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'ID del usuario',
              example: 1,
            },
            content: {
              type: 'string',
              description: 'Contenido del comentario',
              example: 'Estoy de acuerdo con tu reseña, la comida realmente estuvo excelente.',
            },
            parent_id: {
              type: 'integer',
              description: 'ID del comentario padre (para respuestas)',
              example: null,
              nullable: true,
            },
            is_public: {
              type: 'boolean',
              description: 'Comentario público',
              example: true,
              default: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-01T00:00:00.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateComment: {
          type: 'object',
          required: ['review_id', 'content'],
          properties: {
            review_id: {
              type: 'integer',
              description: 'ID de la reseña',
              example: 1,
            },
            content: {
              type: 'string',
              description: 'Contenido del comentario',
              example: 'Estoy de acuerdo con tu reseña, la comida realmente estuvo excelente.',
            },
            parent_id: {
              type: 'integer',
              description: 'ID del comentario padre (para respuestas)',
              example: null,
              nullable: true,
            },
          },
        },
        UpdateComment: {
          type: 'object',
          required: ['content'],
          properties: {
            content: {
              type: 'string',
              description: 'Contenido del comentario',
              example: 'Estoy de acuerdo con tu reseña, la comida realmente estuvo excelente. También me gustó mucho el ambiente.',
            },
          },
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la categoría',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Nombre de la categoría',
              example: 'Restaurantes',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción de la categoría',
              example: 'Lugares para comer y beber',
            },
            icon_url: {
              type: 'string',
              description: 'URL del icono de la categoría',
              example: '🍽️',
            },
            color_code: {
              type: 'string',
              description: 'Código de color de la categoría',
              example: '#FF6B6B',
            },
            parent_id: {
              type: 'integer',
              description: 'ID de la categoría padre',
              example: null,
              nullable: true,
            },
            is_active: {
              type: 'boolean',
              description: 'Estado activo de la categoría',
              example: true,
              default: true,
            },
            sort_order: {
              type: 'integer',
              description: 'Orden de clasificación',
              example: 1,
              default: 0,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-01T00:00:00.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateCategory: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'Nombre de la categoría',
              example: 'Nueva Categoría',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción de la categoría',
              example: 'Descripción de la nueva categoría',
            },
            icon_url: {
              type: 'string',
              description: 'URL del icono de la categoría',
              example: '🎯',
            },
            color_code: {
              type: 'string',
              description: 'Código de color de la categoría',
              example: '#FF6B6B',
            },
            parent_id: {
              type: 'integer',
              description: 'ID de la categoría padre',
              example: null,
              nullable: true,
            },
            sort_order: {
              type: 'integer',
              description: 'Orden de clasificación',
              example: 1,
              default: 0,
            },
          },
        },
        UpdateCategory: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nombre de la categoría',
              example: 'Categoría Actualizada',
              minLength: 2,
              maxLength: 100,
            },
            description: {
              type: 'string',
              description: 'Descripción de la categoría',
              example: 'Nueva descripción',
            },
            icon_url: {
              type: 'string',
              description: 'URL del icono de la categoría',
              example: '🎯',
            },
            color_code: {
              type: 'string',
              description: 'Código de color de la categoría',
              example: '#FF6B6B',
            },
            parent_id: {
              type: 'integer',
              description: 'ID de la categoría padre',
              example: null,
              nullable: true,
            },
            sort_order: {
              type: 'integer',
              description: 'Orden de clasificación',
              example: 2,
            },
          },
        },
        Favorite: {
          type: 'object',
          required: ['user_id', 'place_id'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del favorito',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'ID del usuario',
              example: 1,
            },
            place_id: {
              type: 'integer',
              description: 'ID del lugar',
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['identifier', 'password'],
          properties: {
            identifier: {
              type: 'string',
              description: 'Email o nombre de usuario',
              example: 'juan.perez@example.com',
            },
            password: {
              type: 'string',
              description: 'Contraseña',
              example: 'miPassword123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password', 'first_name', 'last_name'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              description: 'Nombre de usuario único',
              example: 'juan_perez',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico',
              example: 'juan.perez@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña',
              example: 'miPassword123',
            },
            first_name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Nombre',
              example: 'Juan',
            },
            last_name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Apellido',
              example: 'Pérez',
            },
            phone: {
              type: 'string',
              description: 'Teléfono',
              example: '+1234567890',
            },
            avatar_url: {
              type: 'string',
              description: 'URL del avatar',
              example: 'https://example.com/avatar.jpg',
            },
            birth_date: {
              type: 'string',
              format: 'date',
              description: 'Fecha de nacimiento (YYYY-MM-DD)',
              example: '1990-05-15',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'moderator'],
              description: 'Rol del usuario',
              example: 'user',
              default: 'user',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            token: {
              type: 'string',
              description: 'Token JWT',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            expiresIn: {
              type: 'string',
              description: 'Tiempo de expiración del token',
              example: '24h',
            },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: {
              type: 'string',
              description: 'Contraseña actual',
              example: 'miPasswordActual123',
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              description: 'Nueva contraseña',
              example: 'miNuevaPassword123',
            },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'juan.perez@example.com',
            },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'newPassword'],
          properties: {
            token: {
              type: 'string',
              description: 'Token de restablecimiento',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              description: 'Nueva contraseña',
              example: 'miNuevaPassword123',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta',
            },
            message: {
              type: 'string',
              example: 'Request processed successfully',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'User not found',
            },
            message: {
              type: 'string',
              example: 'An error occurred while processing the request',
            },
            details: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Detalles adicionales del error',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Validation error',
            },
            details: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['email must be a valid email'],
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'TuriApp API is running',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
            version: {
              type: 'string',
              example: '1.0.0',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Solicitud incorrecta',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint de login',
        },
      },
    },
    tags: [
      {
        name: 'System',
        description: 'Endpoints del sistema y estado de la API',
      },
      {
        name: 'Authentication',
        description: 'Endpoints de autenticación y autorización',
      },
      {
        name: 'Users',
        description: 'Operaciones CRUD para usuarios',
      },
      {
        name: 'Places',
        description: 'Operaciones CRUD para lugares',
      },
      {
        name: 'Reviews',
        description: 'Operaciones CRUD para reseñas',
      },
      {
        name: 'Comments',
        description: 'Operaciones CRUD para comentarios',
      },
      {
        name: 'Categories',
        description: 'Operaciones CRUD para categorías',
      },
      {
        name: 'Favorites',
        description: 'Operaciones CRUD para favoritos',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

const swaggerMiddleware = koaSwagger({
  routePrefix: '/docs',
  swaggerOptions: {
    url: '/swagger.json',
  },
});

module.exports = {
  specs,
  swaggerMiddleware,
};
