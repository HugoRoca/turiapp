# TuriApp API Service

API REST desarrollada con Koa.js y MySQL para el servicio de TuriApp.

## 🚀 Características

- **Framework**: Koa.js
- **Base de datos**: MySQL con mysql2
- **Arquitectura**: Repository Pattern + Service Layer + Controller
- **Validación**: Joi
- **Logging**: Winston
- **Documentación**: Swagger/OpenAPI 3.0
- **Linting**: ESLint con configuración Airbnb
- **Build**: Babel para transpilación

## 📁 Estructura del Proyecto

```
service_turiapp/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de MySQL
│   │   └── swagger.js           # Configuración de Swagger
│   ├── controllers/
│   │   ├── BaseController.js    # Controlador base
│   │   ├── UserController.js    # Controlador de usuarios
│   │   ├── PlaceController.js   # Controlador de lugares
│   │   ├── ReviewController.js  # Controlador de reseñas
│   │   ├── CommentController.js # Controlador de comentarios
│   │   ├── CategoryController.js # Controlador de categorías
│   │   └── FavoriteController.js # Controlador de favoritos
│   ├── middleware/
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── requestLogger.js     # Logging de requests
│   ├── repositories/
│   │   ├── BaseRepository.js    # Repository base
│   │   ├── UserRepository.js    # Repository de usuarios
│   │   ├── PlaceRepository.js   # Repository de lugares
│   │   ├── ReviewRepository.js  # Repository de reseñas
│   │   ├── CommentRepository.js # Repository de comentarios
│   │   ├── CategoryRepository.js # Repository de categorías
│   │   └── FavoriteRepository.js # Repository de favoritos
│   ├── routes/
│   │   ├── index.js             # Rutas principales
│   │   ├── userRoutes.js        # Rutas de usuarios
│   │   ├── placeRoutes.js       # Rutas de lugares
│   │   ├── reviewRoutes.js      # Rutas de reseñas
│   │   ├── commentRoutes.js     # Rutas de comentarios
│   │   ├── categoryRoutes.js    # Rutas de categorías
│   │   └── favoriteRoutes.js    # Rutas de favoritos
│   ├── services/
│   │   ├── UserService.js       # Lógica de negocio de usuarios
│   │   ├── PlaceService.js      # Lógica de negocio de lugares
│   │   ├── ReviewService.js     # Lógica de negocio de reseñas
│   │   ├── CommentService.js    # Lógica de negocio de comentarios
│   │   ├── CategoryService.js   # Lógica de negocio de categorías
│   │   └── FavoriteService.js   # Lógica de negocio de favoritos
│   ├── utils/
│   │   └── logger.js            # Configuración de logging
│   └── app.js                   # Aplicación principal
├── dist/                        # Código transpilado
├── database/
│   ├── schema.sql               # Esquema de base de datos
│   ├── stored_procedures.sql    # Procedimientos almacenados
│   └── sample_data.sql          # Datos de ejemplo
├── package.json
├── .eslintrc.js
├── .babelrc
└── env.example
```

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd service_turiapp
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos**

**Opción 1: Usando Docker (Recomendado)**
```bash
# Iniciar MySQL con Docker Compose
docker-compose up -d

# Verificar que el contenedor esté corriendo
docker ps
```

**Opción 2: MySQL local**
```bash
# Crear la base de datos MySQL
mysql -u root -p < database/schema.sql

# Ejecutar procedimientos almacenados
mysql -u root -p turiapp_db < database/stored_procedures.sql

# Insertar datos de ejemplo (opcional)
mysql -u root -p turiapp_db < database/sample_data.sql
```

5. **Compilar el proyecto**
```bash
npm run build
```

6. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta en modo desarrollo con nodemon
- `npm run build` - Compila el código con Babel
- `npm start` - Ejecuta la aplicación compilada
- `npm run lint` - Ejecuta ESLint
- `npm run lint:fix` - Corrige errores de ESLint automáticamente
- `npm test` - Ejecuta las pruebas
- `npm run clean` - Limpia la carpeta dist

## 📡 Endpoints Disponibles

### Health Check
- `GET /health` - Estado de la API

### Información de la API
- `GET /api` - Información y documentación de endpoints

### Documentación Swagger
- `GET /docs` - Interfaz de Swagger UI
- `GET /swagger.json` - Especificación OpenAPI en formato JSON

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/verify` - Verificar token JWT
- `GET /api/auth/me` - Obtener perfil del usuario autenticado
- `POST /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/forgot-password` - Solicitar restablecimiento de contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña con token

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/users/email?email=example@email.com` - Obtener usuario por email
- `GET /api/users/active` - Obtener usuarios activos
- `GET /api/users/search?name=John` - Buscar usuarios por nombre
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Lugares
- `GET /api/places` - Obtener todos los lugares
- `GET /api/places/:id` - Obtener lugar por ID
- `GET /api/places/search?q=restaurante` - Buscar lugares
- `GET /api/places/category/:categoryId` - Obtener lugares por categoría
- `GET /api/places/featured` - Obtener lugares destacados
- `GET /api/places/popular` - Obtener lugares populares
- `POST /api/places` - Crear nuevo lugar
- `PUT /api/places/:id` - Actualizar lugar
- `DELETE /api/places/:id` - Eliminar lugar

### Reseñas
- `GET /api/reviews` - Obtener todas las reseñas
- `GET /api/reviews/:id` - Obtener reseña por ID
- `GET /api/reviews/place/:placeId` - Obtener reseñas de un lugar
- `GET /api/reviews/user/:userId` - Obtener reseñas de un usuario
- `GET /api/reviews/recent` - Obtener reseñas recientes
- `POST /api/reviews` - Crear nueva reseña
- `PUT /api/reviews/:id` - Actualizar reseña
- `DELETE /api/reviews/:id` - Eliminar reseña

### Comentarios
- `GET /api/comments` - Obtener todos los comentarios
- `GET /api/comments/:id` - Obtener comentario por ID
- `GET /api/comments/review/:reviewId` - Obtener comentarios de una reseña
- `GET /api/comments/user/:userId` - Obtener comentarios de un usuario
- `GET /api/comments/recent` - Obtener comentarios recientes
- `POST /api/comments` - Crear nuevo comentario
- `PUT /api/comments/:id` - Actualizar comentario
- `DELETE /api/comments/:id` - Eliminar comentario

### Categorías
- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/:id` - Obtener categoría por ID
- `GET /api/categories/active` - Obtener categorías activas
- `GET /api/categories/parent/:parentId` - Obtener subcategorías
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Favoritos
- `GET /api/favorites` - Obtener todos los favoritos
- `GET /api/favorites/:id` - Obtener favorito por ID
- `GET /api/favorites/user/:userId` - Obtener favoritos de un usuario
- `GET /api/favorites/place/:placeId` - Obtener usuarios que marcaron un lugar como favorito
- `POST /api/favorites` - Crear nuevo favorito
- `DELETE /api/favorites/:id` - Eliminar favorito

## 📚 Documentación Interactiva

La API incluye documentación interactiva con Swagger UI:

- **Swagger UI**: http://localhost:3000/docs
- **Especificación JSON**: http://localhost:3000/swagger.json

En Swagger UI puedes:
- Ver todos los endpoints disponibles
- Probar los endpoints directamente desde la interfaz
- Ver ejemplos de requests y responses
- Validar esquemas de datos

## 📝 Ejemplos de Uso

### Autenticación

#### Registrar un nuevo usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "email": "juan.perez@example.com",
    "password": "miPassword123",
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+1234567890"
  }'
```

#### Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "juan.perez@example.com",
    "password": "miPassword123"
  }'
```

#### Verificar token (usar el token obtenido del login)
```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Obtener perfil del usuario autenticado
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Cambiar contraseña
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "currentPassword": "miPassword123",
    "newPassword": "miNuevaPassword456"
  }'
```

### Usuarios

#### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "email": "juan@example.com",
    "password_hash": "$2b$10$hashedpassword",
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+1234567890"
  }'
```

#### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/users
```

#### Buscar usuarios
```bash
curl "http://localhost:3000/api/users/search?name=Juan"
```

### Lugares

#### Crear un lugar
```bash
curl -X POST http://localhost:3000/api/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurante El Gourmet",
    "description": "Restaurante de alta cocina con especialidades locales",
    "address": "Calle Principal 123, Centro",
    "coordinates": {
      "latitude": 40.4168,
      "longitude": -3.7038
    },
    "phone": "+34 91 123 4567",
    "price_range": "high",
    "category_ids": [1, 2]
  }'
```

#### Buscar lugares
```bash
curl "http://localhost:3000/api/places/search?q=restaurante"
```

#### Obtener lugares por categoría
```bash
curl http://localhost:3000/api/places/category/1
```

### Reseñas

#### Crear una reseña
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "place_id": 1,
    "rating": 5,
    "title": "Excelente experiencia",
    "content": "La comida estuvo deliciosa y el servicio fue excepcional."
  }'
```

#### Obtener reseñas de un lugar
```bash
curl http://localhost:3000/api/reviews/place/1
```

### Comentarios

#### Crear un comentario
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "review_id": 1,
    "content": "Estoy de acuerdo con tu reseña, la comida realmente estuvo excelente."
  }'
```

### Categorías

#### Crear una categoría
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurantes",
    "description": "Lugares para comer y beber",
    "icon_url": "🍽️",
    "color_code": "#FF6B6B"
  }'
```

### Favoritos

#### Agregar a favoritos
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "place_id": 1
  }'
```

#### Obtener favoritos de un usuario
```bash
curl http://localhost:3000/api/favorites/user/1
```

## 🔍 Logging

La aplicación incluye logging completo con Winston:
- Logs de requests y responses
- Logs de errores con stack traces
- Logs de operaciones de base de datos
- Diferentes niveles de log (info, warn, error)

## 📚 Documentación con Swagger

La API incluye documentación interactiva con Swagger UI:

### Acceso a la Documentación
- **Swagger UI**: http://localhost:3000/docs
- **Especificación JSON**: http://localhost:3000/swagger.json

### Características de la Documentación
- **OpenAPI 3.0**: Especificación estándar de la industria
- **Interfaz Interactiva**: Prueba los endpoints directamente desde el navegador
- **Esquemas de Validación**: Documentación completa de los modelos de datos
- **Ejemplos de Request/Response**: Casos de uso reales
- **Códigos de Estado HTTP**: Documentación de todas las respuestas posibles

### Esquemas Documentados
- **User**: Modelo completo de usuario
- **CreateUser**: Esquema para crear usuarios
- **UpdateUser**: Esquema para actualizar usuarios
- **Place**: Modelo completo de lugar
- **CreatePlace**: Esquema para crear lugares
- **UpdatePlace**: Esquema para actualizar lugares
- **Review**: Modelo completo de reseña
- **CreateReview**: Esquema para crear reseñas
- **UpdateReview**: Esquema para actualizar reseñas
- **Comment**: Modelo completo de comentario
- **CreateComment**: Esquema para crear comentarios
- **UpdateComment**: Esquema para actualizar comentarios
- **Category**: Modelo completo de categoría
- **CreateCategory**: Esquema para crear categorías
- **UpdateCategory**: Esquema para actualizar categorías
- **Favorite**: Modelo completo de favorito
- **ErrorResponse**: Respuestas de error estandarizadas
- **HealthResponse**: Respuesta del health check

## 🗄️ Base de Datos

### Configuración
- Host: localhost (configurable)
- Puerto: 3306 (configurable)
- Base de datos: turiapp_db
- Charset: utf8mb4

### Tablas Principales

#### Usuarios
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url VARCHAR(255),
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

#### Lugares
```sql
CREATE TABLE places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    short_description VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    price_range ENUM('free', 'low', 'medium', 'high', 'luxury'),
    opening_hours JSON,
    amenities JSON,
    images JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_visits INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Reseñas
```sql
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    images JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Comentarios
```sql
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_id INT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);
```

#### Categorías
```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    color_code VARCHAR(7),
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### Favoritos
```sql
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_place (user_id, place_id)
);
```

### Procedimientos Almacenados
La base de datos incluye procedimientos almacenados para operaciones complejas:
- `GetUserDashboard(user_id)` - Dashboard del usuario
- `GetPlaceDetails(place_id)` - Detalles completos del lugar
- `GetPlaceReviews(place_id)` - Reseñas de un lugar
- `SearchPlaces(search_term)` - Búsqueda de lugares
- `GetPopularPlaces()` - Lugares populares
- `AddPlaceToFavorites(user_id, place_id)` - Agregar a favoritos
- `UpdatePlaceAverageRating(place_id)` - Actualizar calificación promedio

## 🚦 Variables de Entorno

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=turiapp_db

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## 🏗️ Arquitectura

### Repository Pattern
- `BaseRepository`: Operaciones CRUD básicas
- `UserRepository`: Operaciones específicas de usuarios
- `PlaceRepository`: Operaciones específicas de lugares
- `ReviewRepository`: Operaciones específicas de reseñas
- `CommentRepository`: Operaciones específicas de comentarios
- `CategoryRepository`: Operaciones específicas de categorías
- `FavoriteRepository`: Operaciones específicas de favoritos

### Service Layer
- `UserService`: Lógica de negocio y validaciones de usuarios
- `PlaceService`: Lógica de negocio y validaciones de lugares
- `ReviewService`: Lógica de negocio y validaciones de reseñas
- `CommentService`: Lógica de negocio y validaciones de comentarios
- `CategoryService`: Lógica de negocio y validaciones de categorías
- `FavoriteService`: Lógica de negocio y validaciones de favoritos

### Controllers
- `BaseController`: Funcionalidades comunes
- `UserController`: Endpoints de usuarios
- `PlaceController`: Endpoints de lugares
- `ReviewController`: Endpoints de reseñas
- `CommentController`: Endpoints de comentarios
- `CategoryController`: Endpoints de categorías
- `FavoriteController`: Endpoints de favoritos

### Middleware
- `errorHandler`: Manejo centralizado de errores
- `requestLogger`: Logging de requests

## 🔒 Validaciones

- Validación de email con Joi
- Validación de campos requeridos
- Validación de tipos de datos
- Validación de rangos y longitudes

## 📊 Monitoreo

- Health check endpoint para monitoreo
- Logs estructurados para análisis
- Métricas de tiempo de respuesta
- Tracking de requests con IDs únicos
- Documentación interactiva con Swagger UI
- Especificación OpenAPI para integración

## 🚀 Despliegue

### Desarrollo Local

1. **Compilar el proyecto**: `npm run build`
2. **Configurar variables de entorno**: Copiar `env.example` a `.env`
3. **Configurar base de datos**: Usar Docker Compose o MySQL local
4. **Ejecutar**: `npm start` o `npm run dev`

### Docker

```bash
# Iniciar solo la base de datos
docker-compose up -d db

# O iniciar todo el stack (si tienes Dockerfile para la app)
docker-compose up -d
```

### Producción

1. **Compilar el proyecto**: `npm run build`
2. **Configurar variables de entorno** con valores de producción
3. **Configurar base de datos** de producción
4. **Ejecutar**: `npm start`

La aplicación estará disponible en el puerto 3000 por defecto.

### PM2 (Producción)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación con PM2
pm2 start ecosystem.config.js

# Ver logs
pm2 logs

# Reiniciar la aplicación
pm2 restart turiapp-service
```
