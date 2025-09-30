# Migraciones de Base de Datos

Este directorio contiene scripts de migración para actualizar la base de datos.

## Migraciones Disponibles

### 1. Agregar campo birth_date a users
**Archivo**: `add_birth_date_to_users.sql`
**Fecha**: 2025-09-29
**Descripción**: Agrega el campo `birth_date` a la tabla `users` para el endpoint de registro.

#### Ejecutar migración:
```bash
mysql -h localhost -u root -p123456 turiapp_db < database/migrations/add_birth_date_to_users.sql
```

#### Verificar migración:
```sql
DESCRIBE users;
-- Deberías ver la columna 'birth_date' de tipo DATE
```

## Notas Importantes

- **Siempre haz backup** de tu base de datos antes de ejecutar migraciones
- Las migraciones son **idempotentes** - se pueden ejecutar múltiples veces sin problemas
- Si ya tienes el campo `birth_date` en la tabla `users`, la migración no causará errores

## Orden de Ejecución

Ejecuta las migraciones en orden cronológico:
1. `add_birth_date_to_users.sql`
