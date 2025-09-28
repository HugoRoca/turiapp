# Swagger UI - Guía de Uso

## 🚀 Acceso a Swagger UI

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

**URL**: http://localhost:3000/docs

## 📚 Características de la Documentación

### 1. Interfaz Interactiva
- **Prueba de Endpoints**: Puedes ejecutar requests directamente desde el navegador
- **Autenticación**: No requiere autenticación para los endpoints públicos
- **Validación en Tiempo Real**: Los campos se validan según los esquemas definidos

### 2. Esquemas de Datos
La documentación incluye esquemas completos para:

#### User Schema
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+1234567890",
  "status": "active",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "last_login": null
}
```

#### CreateUser Schema
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+1234567890",
  "status": "active"
}
```

#### UpdateUser Schema
```json
{
  "name": "Juan Pérez Actualizado",
  "phone": "+1234567899"
}
```

## 🔧 Cómo Usar Swagger UI

### 1. Navegación
- **Tags**: Los endpoints están organizados por categorías (System, Users)
- **Expandir/Contraer**: Haz clic en cada endpoint para ver los detalles
- **Try it out**: Botón para probar cada endpoint

### 2. Probar Endpoints

#### Health Check
1. Ve a la sección **System**
2. Expande `GET /health`
3. Haz clic en **Try it out**
4. Haz clic en **Execute**
5. Verás la respuesta en tiempo real

#### Crear Usuario
1. Ve a la sección **Users**
2. Expande `POST /api/users`
3. Haz clic en **Try it out**
4. Modifica el JSON de ejemplo:
```json
{
  "name": "María García",
  "email": "maria.garcia@example.com",
  "phone": "+1234567891",
  "status": "active"
}
```
5. Haz clic en **Execute**

#### Obtener Usuarios
1. Ve a la sección **Users**
2. Expande `GET /api/users`
3. Haz clic en **Try it out**
4. Opcionalmente agrega parámetros de query
5. Haz clic en **Execute**

### 3. Respuestas de Ejemplo

#### Respuesta Exitosa
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "phone": "+1234567890",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "last_login": null
    }
  ],
  "message": "Request processed successfully"
}
```

#### Respuesta de Error
```json
{
  "success": false,
  "error": "User not found",
  "message": "An error occurred while processing the request"
}
```

## 📋 Códigos de Estado HTTP

La documentación incluye todos los códigos de estado posibles:

- **200 OK**: Operación exitosa
- **400 Bad Request**: Datos inválidos o parámetros faltantes
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email duplicado)
- **500 Internal Server Error**: Error del servidor

## 🔍 Validaciones Documentadas

### Campos Requeridos
- **name**: Mínimo 2 caracteres, máximo 100
- **email**: Formato de email válido, único en el sistema
- **phone**: Mínimo 10 caracteres, máximo 20 (opcional)
- **status**: Solo 'active' o 'inactive'

### Parámetros de Query
- **limit**: Número máximo de resultados (1-100)
- **offset**: Número de resultados a omitir (≥0)
- **name**: Texto para búsqueda (mínimo 1 carácter)
- **email**: Email para búsqueda específica

## 🛠️ Integración con Herramientas

### Postman
1. Importa la especificación desde: http://localhost:3000/swagger.json
2. Postman generará automáticamente una colección con todos los endpoints

### Insomnia
1. Ve a **Application** → **Preferences** → **Data**
2. Haz clic en **Import Data** → **From URL**
3. Ingresa: http://localhost:3000/swagger.json

### Generación de Código
Puedes usar la especificación OpenAPI para generar código cliente en múltiples lenguajes:
- JavaScript/TypeScript
- Python
- Java
- C#
- Go
- PHP

## 📝 Notas Importantes

1. **Desarrollo vs Producción**: La URL del servidor cambia según el entorno
2. **CORS**: La API acepta requests desde cualquier origen en desarrollo
3. **Logging**: Todas las operaciones se registran en los logs
4. **Validación**: Los datos se validan tanto en Swagger como en el servidor
5. **Ejemplos**: Cada endpoint incluye ejemplos de request y response

## 🚀 Próximos Pasos

1. **Explora la Documentación**: Navega por todos los endpoints disponibles
2. **Prueba los Endpoints**: Usa la funcionalidad "Try it out"
3. **Integra con tu Aplicación**: Usa la especificación JSON para generar código cliente
4. **Personaliza**: Modifica los esquemas según tus necesidades específicas