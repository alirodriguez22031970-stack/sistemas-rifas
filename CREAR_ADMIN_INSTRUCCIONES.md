# Crear Usuario Administrador por Defecto

Este documento explica cómo crear el usuario administrador por defecto para el sistema de rifas.

## Opción 1: Usar el Endpoint API (Recomendado)

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre tu navegador y ve a:
   ```
   http://localhost:3000/api/admin/crear-admin-default
   ```

3. O usa curl desde la terminal:
   ```bash
   curl -X POST http://localhost:3000/api/admin/crear-admin-default
   ```

4. El endpoint creará el usuario con las siguientes credenciales:
   - **Email:** `admin@rifas.com`
   - **Contraseña:** `Admin123!@#`

## Opción 2: Crear desde Supabase Dashboard

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Authentication** > **Users**
3. Haz clic en **Add User** > **Create New User**
4. Completa el formulario:
   - **Email:** `admin@rifas.com`
   - **Password:** `Admin123!@#`
   - Marca **Auto Confirm User**
5. Haz clic en **Create User**

6. Luego, ejecuta este SQL en Supabase SQL Editor para crear el registro en `public.usuarios`:

```sql
-- Obtener el ID del usuario recién creado
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Obtener el ID del usuario admin
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@rifas.com';

  -- Crear o actualizar en public.usuarios
  INSERT INTO public.usuarios (
    id,
    email,
    nombre,
    rol,
    created_at,
    updated_at
  ) VALUES (
    admin_user_id,
    'admin@rifas.com',
    'Administrador Principal',
    'admin',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    rol = 'admin',
    nombre = 'Administrador Principal',
    updated_at = NOW();
END $$;
```

## Opción 3: Usar el Script SQL (Requiere permisos especiales)

**Nota:** Este método requiere permisos de administrador en la base de datos y puede no funcionar en todos los casos debido a restricciones de seguridad.

Ejecuta el archivo `CREAR_USUARIO_ADMIN_DEFECTO.sql` en Supabase SQL Editor. Sin embargo, este método puede fallar porque insertar directamente en `auth.users` requiere permisos especiales.

## Verificar que el Usuario se Creó Correctamente

Ejecuta este SQL en Supabase SQL Editor:

```sql
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol,
  au.email_confirmed_at,
  au.created_at
FROM public.usuarios u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@rifas.com';
```

Deberías ver el usuario con `rol = 'admin'`.

## Credenciales por Defecto

- **Email:** `admin@rifas.com`
- **Contraseña:** `Admin123!@#`

**⚠️ IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión por seguridad.

## Solución de Problemas

### Error: "User already exists"
- El usuario ya existe. Puedes usar el endpoint API que actualizará la contraseña y el rol.

### Error: "Missing Supabase environment variables"
- Verifica que tu archivo `.env.local` tenga:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### Error: "Permission denied"
- Asegúrate de usar el `SUPABASE_SERVICE_ROLE_KEY` (no el anon key) para operaciones administrativas.

