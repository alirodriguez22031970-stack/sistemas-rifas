# 👤 Crear Usuario Administrador Inicial

## 📋 Credenciales del Administrador

**Email:** `admin@sistema-rifas.com`  
**Contraseña:** `Admin123!@#`

**⚠️ IMPORTANTE:** Cambia esta contraseña después del primer inicio de sesión.

---

## 🚀 Pasos para Crear el Usuario Administrador

### Paso 1: Crear Usuario en Supabase Auth

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com)
2. En el menú lateral, haz clic en **Authentication**
3. Haz clic en **Users**
4. Haz clic en el botón **"Add user"** o **"Invite user"**
5. Completa el formulario:
   - **Email**: `admin@sistema-rifas.com`
   - **Password**: `Admin123!@#`
   - **Auto Confirm User**: ✅ **Marca esta casilla** (para que no necesite verificar email)
6. Haz clic en **"Create user"** o **"Send invitation"**

### Paso 2: Configurar Rol de Administrador

1. Ve a **SQL Editor** en Supabase
2. Haz clic en **"New query"**
3. Copia y pega este código:

```sql
-- Obtener el ID del usuario y configurarlo como admin
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Obtener el ID del usuario
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'admin@sistema-rifas.com'
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado. Asegúrate de crear el usuario primero en Authentication > Users';
  END IF;

  -- Insertar en la tabla usuarios con rol admin
  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (user_id, 'admin@sistema-rifas.com', 'Administrador Principal', 'admin')
  ON CONFLICT (id) DO UPDATE
  SET rol = 'admin', nombre = 'Administrador Principal';

  RAISE NOTICE 'Usuario administrador configurado correctamente con ID: %', user_id;
END $$;

-- Verificar
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol
FROM public.usuarios u
WHERE u.email = 'admin@sistema-rifas.com';
```

4. Haz clic en **"Run"**
5. Deberías ver el usuario con `rol = 'admin'` en los resultados

### Paso 3: Iniciar Sesión

1. Ve a tu aplicación: `http://localhost:3000/login`
2. Ingresa las credenciales:
   - **Email**: `admin@sistema-rifas.com`
   - **Contraseña**: `Admin123!@#`
3. Haz clic en **"Iniciar Sesión"**
4. Deberías ser redirigido al dashboard de administración

---

## ✅ Verificación

Después de iniciar sesión:
- ✅ Deberías ver el dashboard en `/dashboard`
- ✅ Deberías poder acceder a `/dashboard/usuarios` para gestionar usuarios
- ✅ Deberías poder crear rifas desde `/dashboard/rifas`

---

## 🔐 Cambiar Contraseña (Recomendado)

1. Inicia sesión con las credenciales de arriba
2. Ve a tu perfil (si hay opción) o cambia la contraseña desde Supabase:
   - Ve a **Authentication > Users**
   - Busca `admin@sistema-rifas.com`
   - Haz clic en los tres puntos (⋯)
   - Selecciona **"Reset password"** o **"Change password"**

---

## 📝 Notas Importantes

- El email `admin@sistema-rifas.com` es solo un ejemplo. Puedes usar cualquier email.
- La contraseña debe cumplir los requisitos de Supabase (mínimo 6 caracteres).
- Si cambias el email, actualiza también el script SQL.
- Guarda estas credenciales en un lugar seguro.

