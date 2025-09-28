# TuriApp API - Ejemplos de Uso

## 🚀 Inicio Rápido

### 1. Verificar que la API esté funcionando
```bash
curl http://localhost:3000/health
```

### 2. Obtener información de la API
```bash
curl http://localhost:3000/api
```

## 👥 Endpoints de Usuarios

### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/users
```

### Obtener usuario por ID
```bash
curl http://localhost:3000/api/users/1
```

### Obtener usuario por email
```bash
curl "http://localhost:3000/api/users/email?email=juan.perez@example.com"
```

### Obtener usuarios activos
```bash
curl http://localhost:3000/api/users/active
```

### Buscar usuarios por nombre
```bash
curl "http://localhost:3000/api/users/search?name=Juan"
```

### Crear nuevo usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "phone": "+1234567890",
    "status": "active"
  }'
```

### Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez Actualizado",
    "phone": "+1234567899"
  }'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## 📊 Respuestas de Ejemplo

### Respuesta exitosa
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "+1234567890",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "last_login": null
  },
  "message": "Request processed successfully"
}
```

### Respuesta de error
```json
{
  "success": false,
  "error": "User not found",
  "message": "An error occurred while processing the request"
}
```

### Respuesta de validación
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    "email must be a valid email"
  ]
}
```

## 🔍 Códigos de Estado HTTP

- `200` - OK (operación exitosa)
- `400` - Bad Request (datos inválidos)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (recurso duplicado)
- `500` - Internal Server Error (error del servidor)

## 📝 Notas Importantes

1. **Validación de Email**: Los emails deben ser únicos en el sistema
2. **Estados de Usuario**: Solo se permiten 'active' e 'inactive'
3. **Timestamps**: Se manejan automáticamente (created_at, updated_at)
4. **Logging**: Todas las operaciones se registran en los logs
5. **CORS**: La API acepta requests desde cualquier origen en desarrollo

## 🛠️ Herramientas de Desarrollo

### Usando Postman
1. Importa la colección de endpoints
2. Configura la URL base: `http://localhost:3000`
3. Usa los ejemplos de arriba para probar cada endpoint

### Usando curl con archivos
```bash
# Crear usuario desde archivo JSON
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d @user-data.json
```

### Monitoreo de Logs
```bash
# Ver logs en tiempo real
tail -f logs/combined.log

# Ver solo errores
tail -f logs/error.log
```
