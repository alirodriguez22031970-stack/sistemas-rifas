-- ============================================
-- CREAR USUARIO ADMINISTRADOR POR DEFECTO
-- ============================================
-- Este script crea un usuario administrador por defecto
-- Email: admin@rifas.com
-- Contraseña: Admin123!@#
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- Paso 1: Crear usuario en auth.users usando la función admin
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Crear usuario en auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@rifas.com',
    crypt('Admin123!@#', gen_salt('bf')), -- Contraseña encriptada
    NOW(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- Si el usuario ya existe, obtener su ID
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'admin@rifas.com';
  END IF;

  -- Paso 2: Crear o actualizar usuario en public.usuarios
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

  RAISE NOTICE 'Usuario administrador creado/actualizado con ID: %', admin_user_id;
END $$;

-- Paso 3: Verificar que el usuario se creó correctamente
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

-- ============================================
-- CREDENCIALES POR DEFECTO:
-- ============================================
-- Email: admin@rifas.com
-- Contraseña: Admin123!@#
-- ============================================

