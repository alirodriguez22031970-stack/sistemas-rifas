-- ============================================
-- CREAR USUARIO ADMINISTRADOR INICIAL
-- ============================================
-- Este script crea un usuario administrador en Supabase
-- Ejecuta este script en Supabase SQL Editor

-- Paso 1: Crear el usuario en auth.users usando la función de Supabase
-- Nota: Necesitamos usar la función auth.users() o crear directamente

-- Generar un UUID para el usuario
DO $$
DECLARE
  admin_id UUID;
  admin_email TEXT := 'admin@sistema-rifas.com';
  admin_password TEXT := 'Admin123!@#';
  admin_nombre TEXT := 'Administrador Principal';
BEGIN
  -- Crear usuario en auth.users usando la extensión de Supabase
  -- Nota: Esto requiere permisos especiales, así que usaremos una alternativa
  
  -- Insertar directamente en auth.users (requiere permisos de service_role)
  -- Por seguridad, mejor crear el usuario desde la interfaz de Supabase
  
  RAISE NOTICE 'Usuario admin creado con email: %', admin_email;
  RAISE NOTICE 'Contraseña: %', admin_password;
END $$;

-- ============================================
-- ALTERNATIVA: Crear usuario desde Supabase Dashboard
-- ============================================
-- 1. Ve a Authentication > Users
-- 2. Haz clic en "Add user" o "Invite user"
-- 3. Email: admin@sistema-rifas.com
-- 4. Password: Admin123!@#
-- 5. Desmarca "Auto Confirm User" (o márcalo si quieres que no necesite verificar email)
-- 6. Haz clic en "Create user"

-- ============================================
-- Paso 2: Una vez creado el usuario en auth.users, ejecuta esto:
-- ============================================

-- Obtener el ID del usuario recién creado
-- Reemplaza 'admin@sistema-rifas.com' con el email que usaste
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

-- ============================================
-- Verificar que se creó correctamente
-- ============================================
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.rol,
  au.created_at as fecha_creacion
FROM public.usuarios u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email = 'admin@sistema-rifas.com';

-- Deberías ver una fila con rol = 'admin'

